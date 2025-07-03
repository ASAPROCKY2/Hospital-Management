// src/complaint/complaint.controller.ts

import { Request, Response } from "express";
import {
  createComplaintService,
  getAllComplaintsService,
  getComplaintByIdService,
  updateComplaintService,
  deleteComplaintService,
  getComplaintsByUserService,
  getComplaintsByDoctorService,
  getFullComplaintDetailsService,
} from "./complaint.service";

// Create a new complaint
export const createComplaintController = async (req: Request, res: Response) => {
  const result = await createComplaintService(req.body);
  res.status(201).json({ message: result });
};

// Get all complaints
export const getAllComplaintsController = async (_req: Request, res: Response) => {
  const complaints = await getAllComplaintsService();
  res.json(complaints);
};

// Get complaint by ID
export const getComplaintByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const complaint = await getComplaintByIdService(id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }
  res.json(complaint);
};

// Update complaint by ID
export const updateComplaintController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await updateComplaintService(id, req.body);
  res.json({ message: result });
};

// Delete complaint by ID
export const deleteComplaintController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await deleteComplaintService(id);
  res.json({ message: result });
};

// Get complaints submitted by a user
export const getComplaintsByUserController = async (req: Request, res: Response) => {
  const userID = Number(req.params.userID);
  const complaints = await getComplaintsByUserService(userID);
  res.json(complaints);
};

// Get complaints against a doctor
export const getComplaintsByDoctorController = async (req: Request, res: Response) => {
  const doctorID = Number(req.params.doctorID);
  const complaints = await getComplaintsByDoctorService(doctorID);
  res.json(complaints);
};

// Get full complaint details (user, doctor, appointment)
export const getFullComplaintDetailsController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const complaint = await getFullComplaintDetailsService(id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }
  res.json(complaint);
};
