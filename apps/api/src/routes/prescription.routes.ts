import { Router } from 'express';
import {
  createPrescription,
  getMyPrescriptions,
  getAllPrescriptions,
  getUploadPresignedUrl,
} from '../controllers/prescription.controller';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createPrescription);
router.get('/my', authMiddleware, getMyPrescriptions);
router.get('/all', authMiddleware, requireAdmin, getAllPrescriptions);
router.post('/upload-url', authMiddleware, getUploadPresignedUrl);

export default router;
