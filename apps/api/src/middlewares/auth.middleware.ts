import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser } from '@sripalie/types';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
  tokenVersion: number;
  role: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'sripalie_opticals_super_secret_jwt_key_2026';

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User session invalid. User not found.' });
    }

    // Security checks: Check if user is blocked or if session tokenVersion was revoked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account blocked due to security reasons.' });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Session expired or revoked. Please log in again.' });
    }

    req.user = user.toObject() as unknown as IUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrator privilege required.' });
  }
  next();
};
