// src/appointment/appointment.controller.ts

import { Request, Response } from "express";
import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getAppointmentsByDoctorService,
  getAppointmentsByUserService,
} from "./appointment.service";

// Create a new appointment
export const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointment = req.body;
    const result = await createAppointmentService(appointment);
    return res.status(201).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all appointments
export const getAllAppointmentsController = async (_req: Request, res: Response) => {
  try {
    const appointments = await getAllAppointmentsService();
    return res.status(200).json({ data: appointments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid appointment ID" });

    const appointment = await getAppointmentByIdService(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    return res.status(200).json({ data: appointment });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update appointment
export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid appointment ID" });

    const result = await updateAppointmentService(id, updates);
    return res.status(200).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete appointment
export const deleteAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid appointment ID" });

    const result = await deleteAppointmentService(id);
    return res.status(200).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get appointments by doctor ID
export const getAppointmentsByDoctorController = async (req: Request, res: Response) => {
  try {
    const doctorID = parseInt(req.params.id);
    if (isNaN(doctorID)) return res.status(400).json({ message: "Invalid doctor ID" });

    const appointments = await getAppointmentsByDoctorService(doctorID);
    return res.status(200).json({ data: appointments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get appointments by user ID
export const getAppointmentsByUserController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) return res.status(400).json({ message: "Invalid user ID" });

    const appointments = await getAppointmentsByUserService(userID);
    return res.status(200).json({ data: appointments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
