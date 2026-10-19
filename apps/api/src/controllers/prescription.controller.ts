import { Response } from 'express';
import { Prescription } from '../models/Prescription';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generatePresignedUploadUrl } from '../config/s3';

export const createPrescription = async (req: AuthRequest, res: Response) => {
  try {
    const {
      patientName,
      phone,
      sphere_OD,
      sphere_OS,
      cylinder_OD,
      cylinder_OS,
      axis_OD,
      axis_OS,
      add_power,
      pupillaryDistance,
      prescriptionFileUrl,
      notes,
    } = req.body;

    const prescription = await Prescription.create({
      userId: req.user ? req.user._id : undefined,
      patientName: patientName || (req.user ? req.user.name : 'Walk-in Patient'),
      phone: phone || (req.user ? req.user.phone : ''),
      sphere_OD: Number(sphere_OD || 0),
      sphere_OS: Number(sphere_OS || 0),
      cylinder_OD: Number(cylinder_OD || 0),
      cylinder_OS: Number(cylinder_OS || 0),
      axis_OD: Number(axis_OD || 0),
      axis_OS: Number(axis_OS || 0),
      add_power: Number(add_power || 0),
      pupillaryDistance: Number(pupillaryDistance || 63),
      prescriptionFileUrl: prescriptionFileUrl || '',
      notes: notes || '',
    });

    return res.status(201).json(prescription);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error creating prescription.' });
  }
};

export const getMyPrescriptions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    const prescriptions = await Prescription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(prescriptions);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching prescriptions.' });
  }
};

export const getAllPrescriptions = async (req: AuthRequest, res: Response) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    return res.status(200).json(prescriptions);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching all prescriptions.' });
  }
};

export const getUploadPresignedUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ message: 'fileName and fileType are required.' });
    }
    const data = await generatePresignedUploadUrl(fileName, fileType);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error generating presigned upload URL.' });
  }
};
