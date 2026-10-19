import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

const generateToken = (userId: string, role: string, tokenVersion: number) => {
  const secret = process.env.JWT_SECRET || 'sripalie_opticals_super_secret_jwt_key_2026';
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign({ userId, role, tokenVersion }, secret, options);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'customer';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: userRole,
      isBlocked: false,
      tokenVersion: 0,
    });

    const token = generateToken(user._id.toString(), user.role, user.tokenVersion);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isBlocked: user.isBlocked,
        tokenVersion: user.tokenVersion,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server registration error.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id.toString(), user.role, user.tokenVersion);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isBlocked: user.isBlocked,
        tokenVersion: user.tokenVersion,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server login error.' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  return res.status(200).json({ user: req.user });
};
