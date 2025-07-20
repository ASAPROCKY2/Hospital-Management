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

//  Create a new complaint
export const createComplaintController = async (req: Request, res: Response) => {
  try {
    const result = await createComplaintService(req.body);
    return res.status(201).json({ message: result });
  } catch (error: any) {
    console.error("Error creating complaint:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get all complaints (with user and doctor info)
export const getAllComplaintsController = async (_req: Request, res: Response) => {
  try {
    const complaints = await getAllComplaintsService();
    return res.status(200).json(complaints);
  } catch (error: any) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get complaint by ID (with user and doctor info)
export const getComplaintByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid complaint ID" });
    }
    const complaint = await getComplaintByIdService(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    return res.status(200).json(complaint);
  } catch (error: any) {
    console.error("Error fetching complaint:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Update complaint by ID
export const updateComplaintController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid complaint ID" });
    }
    const result = await updateComplaintService(id, req.body);
    return res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("Error updating complaint:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Delete complaint by ID
export const deleteComplaintController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid complaint ID" });
    }
    const result = await deleteComplaintService(id);
    return res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("Error deleting complaint:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get complaints submitted by a specific user
export const getComplaintsByUserController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.userID);
    if (isNaN(userID)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const complaints = await getComplaintsByUserService(userID);
    return res.status(200).json(complaints);
  } catch (error: any) {
    console.error("Error fetching complaints by user:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get complaints addressed to a specific doctor
export const getComplaintsByDoctorController = async (req: Request, res: Response) => {
  try {
    const doctorID = Number(req.params.doctorID);
    if (isNaN(doctorID)) {
      return res.status(400).json({ error: "Invalid doctor ID" });
    }
    const complaints = await getComplaintsByDoctorService(doctorID);
    return res.status(200).json(complaints);
  } catch (error: any) {
    console.error("Error fetching complaints by doctor:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get full details for a single complaint (with user & doctor)
export const getFullComplaintDetailsController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid complaint ID" });
    }
    const complaint = await getFullComplaintDetailsService(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    return res.status(200).json(complaint);
  } catch (error: any) {
    console.error("Error fetching full complaint details:", error);
    return res.status(500).json({ error: error.message });
  }
};
