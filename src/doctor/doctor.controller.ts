// src/doctor/doctor.controller.ts
import { Request, Response } from "express";
import {
  createDoctorService,
  getAllDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorWithAppointmentsService,
  getDoctorWithPrescriptionsService,
} from "./doctor.service";

// ✅ Create a new doctor (with optional image_url)
export const createDoctorController = async (req: Request, res: Response) => {
  try {
    const doctor = req.body;

    if (!doctor.user_id) {
      return res.status(400).json({ message: "User ID is required to create a doctor." });
    }

    // doctor.image_url can come directly from the frontend (e.g., Cloudinary secure_url)
    const createdDoctor = await createDoctorService(doctor);

    return res.status(201).json({
      message: "Doctor created successfully",
      data: createdDoctor,
    });
  } catch (error: any) {
    console.error("Error in createDoctorController:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get all doctors
export const getAllDoctorsController = async (_req: Request, res: Response) => {
  try {
    const doctors = await getAllDoctorsService();
    return res.status(200).json({ data: doctors });
  } catch (error: any) {
    console.error("Error in getAllDoctorsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get doctor by ID
export const getDoctorByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid doctor ID." });

    const doctor = await getDoctorByIdService(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    return res.status(200).json({ data: doctor });
  } catch (error: any) {
    console.error("Error in getDoctorByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Update doctor by ID (supports updating image_url too)
export const updateDoctorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid doctor ID." });

    const updates = req.body;
    // updates.image_url is allowed (optional)
    const result = await updateDoctorService(id, updates);

    return res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("Error in updateDoctorController:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Delete doctor by ID
export const deleteDoctorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid doctor ID." });

    const result = await deleteDoctorService(id);
    return res.status(200).json({ message: result });
  } catch (error: any) {
    console.error("Error in deleteDoctorController:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get doctor with full appointment info
export const getDoctorWithAppointmentsController = async (req: Request, res: Response) => {
  try {
    const doctorID = parseInt(req.params.id);
    if (isNaN(doctorID)) return res.status(400).json({ message: "Invalid doctor ID." });

    const doctor = await getDoctorWithAppointmentsService(doctorID);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    return res.status(200).json({ data: doctor });
  } catch (error: any) {
    console.error("Error in getDoctorWithAppointmentsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get doctor with prescription info
export const getDoctorWithPrescriptionsController = async (req: Request, res: Response) => {
  try {
    const doctorID = parseInt(req.params.id);
    if (isNaN(doctorID)) return res.status(400).json({ message: "Invalid doctor ID." });

    const doctor = await getDoctorWithPrescriptionsService(doctorID);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    return res.status(200).json({ data: doctor });
  } catch (error: any) {
    console.error("Error in getDoctorWithPrescriptionsController:", error);
    return res.status(500).json({ error: error.message });
  }
};
