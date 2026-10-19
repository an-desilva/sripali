import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@sripalie/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isBlocked: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    blockedReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserDocument>('User', UserSchema);
