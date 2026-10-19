import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '@sripalie/types';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  framePrice: { type: Number, required: true },
  lensType: {
    type: String,
    enum: ['single-vision', 'bifocal', 'progressive', 'blue-cut'],
    required: true,
  },
  lensPrice: { type: Number, required: true },
  prescriptionData: {
    sphere_OD: Number,
    sphere_OS: Number,
    cylinder_OD: Number,
    cylinder_OS: Number,
    axis_OD: Number,
    axis_OS: Number,
    add_power: Number,
    pupillaryDistance: Number,
    prescriptionFileUrl: String,
  },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    advancePaid: { type: Number, required: true, min: 0, default: 0 },
    balanceDue: { type: Number, required: true, min: 0, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online'],
      default: 'cash',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    isWalkIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);
