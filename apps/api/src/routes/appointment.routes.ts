import { Router } from 'express';
import {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createAppointment);
router.get('/', authMiddleware, requireAdmin, getAllAppointments);
router.patch('/:id/status', authMiddleware, requireAdmin, updateAppointmentStatus);

export default router;
