import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientName, phone, appointmentDate, timeSlot, notes } = req.body;

    if (!patientName || !phone || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'Patient name, phone, date, and time slot are required.' });
    }

    const newAppointment = await Appointment.create({
      patientName,
      phone,
      appointmentDate,
      timeSlot,
      notes: notes || '',
      status: 'pending',
    });

    return res.status(201).json(newAppointment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error creating appointment.' });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: 1, timeSlot: 1 });
    return res.status(200).json(appointments);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching appointments.' });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    return res.status(200).json(appointment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error updating appointment status.' });
  }
};
