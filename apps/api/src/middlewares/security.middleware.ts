import { Request, Response, NextFunction } from 'express';
import { SecuritySetting } from '../models/SecuritySetting';
import jwt from 'jsonwebtoken';

export const securityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientIP =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '';

    let settings = await SecuritySetting.findOne();
    if (!settings) {
      settings = await SecuritySetting.create({ isLockdownMode: false, blacklistedIPs: [] });
    }

    // 1. IP Blacklist Check
    if (clientIP && settings.blacklistedIPs.includes(clientIP)) {
      return res.status(403).json({
        message: 'Forbidden: Your IP address has been blacklisted for security violations.',
      });
    }

    // 2. Emergency Storefront Lockdown Check
    if (settings.isLockdownMode) {
      // Allow lockdown toggle endpoint and admin operations if valid admin token present
      const isSecurityEndpoint = req.path.includes('/security');
      const isAuthEndpoint = req.path.includes('/auth/login');
      
      const authHeader = req.headers.authorization;
      let isAdmin = false;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const secret = process.env.JWT_SECRET || 'sripalie_opticals_super_secret_jwt_key_2026';
          const decoded = jwt.verify(token, secret) as any;
          if (decoded && decoded.role === 'admin') {
            isAdmin = true;
          }
        } catch {
          isAdmin = false;
        }
      }

      if (!isAdmin && !isSecurityEndpoint && !isAuthEndpoint) {
        return res.status(503).json({
          message: 'EMERGENCY_LOCKDOWN',
          detail: 'Storefront is currently under emergency security maintenance.',
        });
      }
    }

    next();
  } catch (error) {
    console.error('Security middleware error:', error);
    next();
  }
};
