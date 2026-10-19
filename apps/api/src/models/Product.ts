import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '@sripalie/types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    modelCode: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids'],
      default: 'unisex',
    },
    shape: {
      type: String,
      enum: ['rectangle', 'round', 'cat-eye', 'aviator', 'square'],
      default: 'rectangle',
    },
    material: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockCount: { type: Number, required: true, default: 0 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
