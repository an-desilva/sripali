import { Router } from 'express';
import {
  getSecurityStatus,
  getUsersList,
  revokeUserAccess,
  unblockUser,
  blacklistIP,
  removeBlacklistedIP,
  toggleLockdown,
} from '../controllers/security.controller';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/status', authMiddleware, requireAdmin, getSecurityStatus);
router.get('/users', authMiddleware, requireAdmin, getUsersList);
router.post('/revoke-user/:userId', authMiddleware, requireAdmin, revokeUserAccess);
router.post('/unblock-user/:userId', authMiddleware, requireAdmin, unblockUser);
router.post('/blacklist-ip', authMiddleware, requireAdmin, blacklistIP);
router.post('/remove-ip', authMiddleware, requireAdmin, removeBlacklistedIP);
router.post('/toggle-lockdown', authMiddleware, requireAdmin, toggleLockdown);

export default router;
