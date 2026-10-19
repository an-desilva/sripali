import { Router } from 'express';
import { getAnalyticsOverview } from '../controllers/analytics.controller';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/overview', authMiddleware, requireAdmin, getAnalyticsOverview);

export default router;
