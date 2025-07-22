// src/doctor/doctor.service.ts

import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIDoctor, DoctorsTable } from "../Drizzle/schema";

// Create a new doctor
export const createDoctorService = async (doctor: TIDoctor) => {
const[newDoctor]=await db.insert(DoctorsTable).values(doctor).returning();
  return newDoctor;
};

// Get all doctors
export const getAllDoctorsService = async () => {
  return await db.query.DoctorsTable.findMany();
};

// Get doctor by ID
export const getDoctorByIdService = async (id: number) => {
  return await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctor_id, id),
  });
};

// Update doctor by ID
export const updateDoctorService = async (id: number, data: Partial<TIDoctor>) => {
  await db.update(DoctorsTable).set(data).where(eq(DoctorsTable.doctor_id, id));
  return "Doctor updated successfully";
};

// Delete doctor by ID
export const deleteDoctorService = async (id: number) => {
  await db.delete(DoctorsTable).where(eq(DoctorsTable.doctor_id, id));
  return "Doctor deleted successfully";
};

// Get doctor with appointments and patients
export const getDoctorWithAppointmentsService = async (doctorID: number) => {
  return await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctor_id, doctorID),
    with: {
      appointments: true
    }
  });
};


// Get doctor with prescriptions
export const getDoctorWithPrescriptionsService = async (doctorID: number) => {
  return await db.query.DoctorsTable.findFirst({
    where: eq(DoctorsTable.doctor_id, doctorID),
    with: {
      prescriptions: true
    }
  });
};
