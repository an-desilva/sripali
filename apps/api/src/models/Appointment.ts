import mongoose, { Schema, Document } from 'mongoose';
import { IAppointment } from '@sripalie/types';

export interface IAppointmentDocument extends Omit<IAppointment, '_id'>, Document {}

const AppointmentSchema: Schema = new Schema(
  {
    patientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);
