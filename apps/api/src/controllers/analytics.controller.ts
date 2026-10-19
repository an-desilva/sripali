import { Request, Response } from 'express';
import { Order } from '../models/Order';

export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    const range = (req.query.range as string) || 'month'; // 'day' | 'week' | 'month' | 'year'

    const now = new Date();
    let startDate = new Date();

    if (range === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'week') {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
      startDate = new Date(startDate.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
    });

    let totalRevenue = 0;
    let totalAdvanceCollected = 0;
    let totalBalanceDue = 0;
    let totalOrders = orders.length;
    let pendingOrders = 0;
    let readyForPickupOrders = 0;
    let completedOrders = 0;

    const chartMap: Record<string, { grossSales: number; advancePaid: number; balanceDue: number; ordersCount: number }> = {};

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
      totalAdvanceCollected += order.advancePaid;
      totalBalanceDue += order.balanceDue;

      if (order.orderStatus === 'Pending' || order.orderStatus === 'Processing') {
        pendingOrders++;
      } else if (order.orderStatus === 'Ready for Pickup') {
        readyForPickupOrders++;
      } else if (order.orderStatus === 'Completed') {
        completedOrders++;
      }

      // Grouping key for charts
      const date = new Date(order.createdAt);
      let label = '';
      if (range === 'day') {
        label = `${date.getHours().toString().padStart(2, '0')}:00`;
      } else if (range === 'week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        label = days[date.getDay()];
      } else if (range === 'month') {
        label = `Day ${date.getDate()}`;
      } else if (range === 'year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        label = months[date.getMonth()];
      }

      if (!chartMap[label]) {
        chartMap[label] = { grossSales: 0, advancePaid: 0, balanceDue: 0, ordersCount: 0 };
      }
      chartMap[label].grossSales += order.totalAmount;
      chartMap[label].advancePaid += order.advancePaid;
      chartMap[label].balanceDue += order.balanceDue;
      chartMap[label].ordersCount += 1;
    });

    const chartData = Object.keys(chartMap).map((label) => ({
      label,
      ...chartMap[label],
    }));

    // If empty data, provide friendly default slots
    if (chartData.length === 0) {
      if (range === 'day') {
        ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].forEach((lbl) => {
          chartData.push({ label: lbl, grossSales: 0, advancePaid: 0, balanceDue: 0, ordersCount: 0 });
        });
      } else if (range === 'week') {
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((lbl) => {
          chartData.push({ label: lbl, grossSales: 0, advancePaid: 0, balanceDue: 0, ordersCount: 0 });
        });
      } else if (range === 'month') {
        ['Week 1', 'Week 2', 'Week 3', 'Week 4'].forEach((lbl) => {
          chartData.push({ label: lbl, grossSales: 0, advancePaid: 0, balanceDue: 0, ordersCount: 0 });
        });
      } else if (range === 'year') {
        ['Q1', 'Q2', 'Q3', 'Q4'].forEach((lbl) => {
          chartData.push({ label: lbl, grossSales: 0, advancePaid: 0, balanceDue: 0, ordersCount: 0 });
        });
      }
    }

    return res.status(200).json({
      totalRevenue,
      totalAdvanceCollected,
      totalBalanceDue,
      totalOrders,
      pendingOrders,
      readyForPickupOrders,
      completedOrders,
      chartData,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error computing analytics.' });
  }
};
