import { Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      items,
      advancePaid = 0,
      paymentMethod = 'cash',
      isWalkIn = false,
    } = req.body;

    if (!customerName || !customerPhone || !items || !Array.length) {
      return res.status(400).json({ message: 'Customer details and items are required.' });
    }

    // Auto-generate order number SO-XXXX
    const count = await Order.countDocuments();
    const orderNumber = `SO-${1001 + count}`;

    let calculatedTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      const framePrice = product ? product.price : item.framePrice || 0;

      let lensPrice = 0;
      switch (item.lensType) {
        case 'single-vision':
          lensPrice = 30;
          break;
        case 'bifocal':
          lensPrice = 50;
          break;
        case 'progressive':
          lensPrice = 90;
          break;
        case 'blue-cut':
          lensPrice = 65;
          break;
        default:
          lensPrice = 30;
      }

      const itemTotal = framePrice + lensPrice;
      calculatedTotal += itemTotal;

      processedItems.push({
        productId: item.productId,
        framePrice,
        lensType: item.lensType,
        lensPrice,
        prescriptionData: item.prescriptionData || {},
      });

      // Reduce product stock count
      if (product) {
        product.stockCount = Math.max(0, product.stockCount - 1);
        await product.save();
      }
    }

    const advance = Number(advancePaid);
    const balance = Math.max(0, calculatedTotal - advance);

    const order = await Order.create({
      orderNumber,
      userId: req.user ? req.user._id : undefined,
      customerName,
      customerPhone,
      items: processedItems,
      totalAmount: calculatedTotal,
      advancePaid: advance,
      balanceDue: balance,
      paymentMethod,
      orderStatus: 'Pending',
      isWalkIn: Boolean(isWalkIn),
    });

    return res.status(201).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error creating order.' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching user orders.' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching all orders.' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching order.' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status value.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Completed') {
      order.balanceDue = 0;
      order.advancePaid = order.totalAmount;
    }

    await order.save();
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error updating order status.' });
  }
};

export const updateOrderPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { additionalPaid } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const paid = Number(additionalPaid || 0);
    order.advancePaid = Math.min(order.totalAmount, order.advancePaid + paid);
    order.balanceDue = Math.max(0, order.totalAmount - order.advancePaid);

    if (order.balanceDue === 0 && order.orderStatus === 'Ready for Pickup') {
      order.orderStatus = 'Completed';
    }

    await order.save();
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error updating order payment.' });
  }
};
