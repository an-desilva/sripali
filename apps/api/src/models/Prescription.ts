import mongoose, { Schema, Document } from 'mongoose';
import { IPrescription } from '@sripalie/types';

export interface IPrescriptionDocument extends Omit<IPrescription, '_id'>, Document {}

const PrescriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    patientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    sphere_OD: { type: Number, default: 0 },
    sphere_OS: { type: Number, default: 0 },
    cylinder_OD: { type: Number, default: 0 },
    cylinder_OS: { type: Number, default: 0 },
    axis_OD: { type: Number, default: 0 },
    axis_OS: { type: Number, default: 0 },
    add_power: { type: Number, default: 0 },
    pupillaryDistance: { type: Number, default: 63 },
    prescriptionFileUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model<IPrescriptionDocument>('Prescription', PrescriptionSchema);
