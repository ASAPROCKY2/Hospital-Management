// src/prescription/prescription.service.ts

import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { PrescriptionsTable, TIPrescription } from "../Drizzle/schema";

//  Create a new prescription
export const createPrescriptionService = async (prescription: TIPrescription) => {
  await db.insert(PrescriptionsTable).values(prescription);
  return "Prescription created successfully";
};

//  Get all prescriptions (now including doctor, patient, and appointment)
export const getAllPrescriptionsService = async () => {
  return await db.query.PrescriptionsTable.findMany({
    with: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
};

//  Get prescription by ID
export const getPrescriptionByIdService = async (id: number) => {
  return await db.query.PrescriptionsTable.findFirst({
    where: eq(PrescriptionsTable.prescription_id, id),
    with: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
};

//  Update prescription by ID
export const updatePrescriptionService = async (
  id: number,
  data: Partial<TIPrescription>
) => {
  await db
    .update(PrescriptionsTable)
    .set(data)
    .where(eq(PrescriptionsTable.prescription_id, id));
  return "Prescription updated successfully";
};

//  Delete prescription by ID
export const deletePrescriptionService = async (id: number) => {
  await db
    .delete(PrescriptionsTable)
    .where(eq(PrescriptionsTable.prescription_id, id));
  return "Prescription deleted successfully";
};

// Get all prescriptions written by a doctor
export const getPrescriptionsByDoctorService = async (doctorID: number) => {
  return await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.doctor_id, doctorID),
    with: {
      appointment: true,
      patient: true,
    },
  });
};

//  Get all prescriptions for a patient
export const getPrescriptionsByPatientService = async (userID: number) => {
  return await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.patient_id, userID),
    with: {
      doctor: true,
      appointment: true,
    },
  });
};

//  Get full prescription details (doctor, patient, appointment)
export const getFullPrescriptionDetailsService = async (id: number) => {
  return await db.query.PrescriptionsTable.findFirst({
    where: eq(PrescriptionsTable.prescription_id, id),
    with: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
};
