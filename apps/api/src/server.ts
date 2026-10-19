import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { securityMiddleware } from './middlewares/security.middleware';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import prescriptionRoutes from './routes/prescription.routes';
import orderRoutes from './routes/order.routes';
import appointmentRoutes from './routes/appointment.routes';
import analyticsRoutes from './routes/analytics.routes';
import securityRoutes from './routes/security.routes';

import { User } from './models/User';
import { Product } from './models/Product';
import { SecuritySetting } from './models/SecuritySetting';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Global security middleware (IP Blacklist & Store Lockdown check)
app.use('/api', securityMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/security', securityRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'SRIPALIE OPTICALS API', timestamp: new Date() });
});

// Database Seed Function
const seedDefaultData = async () => {
  try {
    // 1. Ensure Security Setting exists
    const security = await SecuritySetting.findOne();
    if (!security) {
      await SecuritySetting.create({ isLockdownMode: false, blacklistedIPs: [] });
    }

    // 2. Ensure Admin account exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Sripalie Store Manager',
        email: 'admin@sripalie.com',
        password: hashed,
        phone: '+94771234567',
        role: 'admin',
        isBlocked: false,
        tokenVersion: 0,
      });
      console.log('[Seed] Admin account created: admin@sripalie.com / admin123');
    }

    // 3. Ensure Sample Optical Products exist
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        {
          title: 'Ray-Ban Aviator Classic Titanium',
          brand: 'Ray-Ban',
          modelCode: 'RB-3025',
          gender: 'unisex',
          shape: 'aviator',
          material: 'Titanium Metallic',
          price: 185.00,
          stockCount: 15,
          images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'],
          isActive: true,
        },
        {
          title: 'Oakley Holbrook Stealth Black',
          brand: 'Oakley',
          modelCode: 'OO-9102',
          gender: 'men',
          shape: 'square',
          material: 'O Matter Acetate',
          price: 162.00,
          stockCount: 12,
          images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
          isActive: true,
        },
        {
          title: 'Gucci Elegance Cat-Eye Rose Gold',
          brand: 'Gucci',
          modelCode: 'GG-0061S',
          gender: 'women',
          shape: 'cat-eye',
          material: 'High Polish Metal & Acetate',
          price: 295.00,
          stockCount: 8,
          images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'],
          isActive: true,
        },
        {
          title: 'Prada Heritage Round Minimalist',
          brand: 'Prada',
          modelCode: 'PR-16MV',
          gender: 'unisex',
          shape: 'round',
          material: 'Handcrafted Acetate',
          price: 240.00,
          stockCount: 10,
          images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'],
          isActive: true,
        },
        {
          title: 'Sripalie Signature Junior Flex',
          brand: 'Sripalie Optics',
          modelCode: 'SO-KID01',
          gender: 'kids',
          shape: 'rectangle',
          material: 'TR90 Ultra-flexible Polycarbonate',
          price: 85.00,
          stockCount: 25,
          images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'],
          isActive: true,
        }
      ]);
      console.log('[Seed] Sample optical products initialized.');
    }
  } catch (error) {
    console.error('[Seed] Error seeding default data:', error);
  }
};

const startServer = async () => {
  await connectDB();
  await seedDefaultData();
  app.listen(PORT, () => {
    console.log(`🚀 [SRIPALIE OPTICALS API] Server running on http://localhost:${PORT}`);
  });
};

startServer();
