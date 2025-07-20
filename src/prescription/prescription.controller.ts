// src/prescription/prescription.controller.ts
import { Request, Response } from "express";
import {
  createPrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,
  updatePrescriptionService,
  deletePrescriptionService,
  getPrescriptionsByDoctorService,
  getPrescriptionsByPatientService,
  getFullPrescriptionDetailsService,
} from "./prescription.service";

// Create a new prescription
export const createPrescriptionController = async (req: Request, res: Response) => {
  try {
    const message = await createPrescriptionService(req.body);
    return res.status(201).json({ message });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to create prescription", details: error.message });
  }
};

// Get all prescriptions (now includes doctor/patient/appointment)
export const getAllPrescriptionsController = async (_req: Request, res: Response) => {
  try {
    const prescriptions = await getAllPrescriptionsService();
    return res.status(200).json({
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch prescriptions", details: error.message });
  }
};

// Get prescription by ID
export const getPrescriptionByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const prescription = await getPrescriptionByIdService(id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    return res.status(200).json({ data: prescription });
  } catch (error: any) {
    return res.status(500).json({ error: "Error fetching prescription", details: error.message });
  }
};

// Update prescription
export const updatePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const message = await updatePrescriptionService(id, req.body);
    return res.status(200).json({ message });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to update prescription", details: error.message });
  }
};

// Delete prescription
export const deletePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const message = await deletePrescriptionService(id);
    return res.status(200).json({ message });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to delete prescription", details: error.message });
  }
};

// Get prescriptions by doctor
export const getPrescriptionsByDoctorController = async (req: Request, res: Response) => {
  try {
    const doctorID = Number(req.params.doctorID);
    const prescriptions = await getPrescriptionsByDoctorService(doctorID);
    return res.status(200).json({
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch prescriptions by doctor", details: error.message });
  }
};

// Get prescriptions by patient
export const getPrescriptionsByPatientController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.userID);
    const prescriptions = await getPrescriptionsByPatientService(userID);
    return res.status(200).json({
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch prescriptions by patient", details: error.message });
  }
};

// Get full prescription details
export const getFullPrescriptionDetailsController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const prescription = await getFullPrescriptionDetailsService(id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    return res.status(200).json({ data: prescription });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch prescription details", details: error.message });
  }
};
