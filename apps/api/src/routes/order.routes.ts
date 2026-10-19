import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPayment,
} from '../controllers/order.controller';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/all', authMiddleware, requireAdmin, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, requireAdmin, updateOrderStatus);
router.patch('/:id/payment', authMiddleware, requireAdmin, updateOrderPayment);

export default router;
