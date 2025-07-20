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

// ✅ Create a new appointment
export const createAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointmentData = req.body;
    const message = await createAppointmentService(appointmentData);
    return res.status(201).json({ success: true, message });
  } catch (error: any) {
    console.error("❌ Error creating appointment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get all appointments (flattened with doctor/patient names)
export const getAllAppointmentsController = async (_req: Request, res: Response) => {
  try {
    const appointments = await getAllAppointmentsService();
    return res.status(200).json({ success: true, data: appointments });
  } catch (error: any) {
    console.error("❌ Error fetching appointments:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get appointment by ID
export const getAppointmentByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    }

    const appointment = await getAppointmentByIdService(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({ success: true, data: appointment });
  } catch (error: any) {
    console.error("❌ Error fetching appointment by ID:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update appointment
export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    }

    const updates = req.body;
    const message = await updateAppointmentService(id, updates);
    return res.status(200).json({ success: true, message });
  } catch (error: any) {
    console.error("❌ Error updating appointment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete appointment
export const deleteAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    }

    const message = await deleteAppointmentService(id);
    return res.status(200).json({ success: true, message });
  } catch (error: any) {
    console.error("❌ Error deleting appointment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get appointments by doctor ID
export const getAppointmentsByDoctorController = async (req: Request, res: Response) => {
  try {
    const doctorID = Number(req.params.id);
    if (isNaN(doctorID)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }

    const appointments = await getAppointmentsByDoctorService(doctorID);
    return res.status(200).json({ success: true, data: appointments });
  } catch (error: any) {
    console.error("❌ Error fetching appointments by doctor:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//  Get appointments by user ID
export const getAppointmentsByUserController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.id);
    if (isNaN(userID)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const appointments = await getAppointmentsByUserService(userID);
    return res.status(200).json({ success: true, data: appointments });
  } catch (error: any) {
    console.error("❌ Error fetching appointments by user:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
