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
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Failed to create prescription", details: error });
  }
};

// Get all prescriptions
export const getAllPrescriptionsController = async (_req: Request, res: Response) => {
  try {
    const prescriptions = await getAllPrescriptionsService();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions", details: error });
  }
};

// Get prescription by ID
export const getPrescriptionByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const prescription = await getPrescriptionByIdService(id);
    if (prescription) {
      res.json(prescription);
    } else {
      res.status(404).json({ error: "Prescription not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching prescription", details: error });
  }
};

// Update prescription
export const updatePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const message = await updatePrescriptionService(id, req.body);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: "Failed to update prescription", details: error });
  }
};

// Delete prescription
export const deletePrescriptionController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const message = await deletePrescriptionService(id);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete prescription", details: error });
  }
};

// Get prescriptions by doctor
export const getPrescriptionsByDoctorController = async (req: Request, res: Response) => {
  try {
    const doctorID = Number(req.params.doctorID);
    const prescriptions = await getPrescriptionsByDoctorService(doctorID);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions by doctor", details: error });
  }
};

// Get prescriptions by patient
export const getPrescriptionsByPatientController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.userID);
    const prescriptions = await getPrescriptionsByPatientService(userID);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions by patient", details: error });
  }
};

// Get full prescription details
export const getFullPrescriptionDetailsController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const prescription = await getFullPrescriptionDetailsService(id);
    if (prescription) {
      res.json(prescription);
    } else {
      res.status(404).json({ error: "Prescription not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescription details", details: error });
  }
};
