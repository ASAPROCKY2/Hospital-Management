// src/complaint/complaint.service.ts

import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { ComplaintsTable, TIComplaint } from "../Drizzle/schema";

// Create a new complaint
export const createComplaintService = async (complaint: TIComplaint) => {
  await db.insert(ComplaintsTable).values(complaint);
  return "Complaint submitted successfully";
};

// Get all complaints
export const getAllComplaintsService = async () => {
  return await db.query.ComplaintsTable.findMany();
};

// Get complaint by ID
export const getComplaintByIdService = async (id: number) => {
  return await db.query.ComplaintsTable.findFirst({
    where: eq(ComplaintsTable.complaint_id, id),
  });
};

// Update complaint by ID
export const updateComplaintService = async (
  id: number,
  data: Partial<TIComplaint>
) => {
  await db.update(ComplaintsTable)
    .set(data)
    .where(eq(ComplaintsTable.complaint_id, id));
  return "Complaint updated successfully";
};

// Delete complaint by ID
export const deleteComplaintService = async (id: number) => {
  await db.delete(ComplaintsTable)
    .where(eq(ComplaintsTable.complaint_id, id));
  return "Complaint deleted successfully";
};

// Get complaints by user
export const getComplaintsByUserService = async (userID: number) => {
  return await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.user_id, userID),
    with: {
      doctor: true,
      appointment: true
    }
  });
};

// Get complaints against a doctor
export const getComplaintsByDoctorService = async (doctorID: number) => {
  return await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.doctor_id, doctorID),
    with: {
      user: true,
      appointment: true
    }
  });
};

// Get full complaint details (user, doctor, appointment)
export const getFullComplaintDetailsService = async (id: number) => {
  return await db.query.ComplaintsTable.findFirst({
    where: eq(ComplaintsTable.complaint_id, id),
    with: {
      user: true,
      doctor: true,
      appointment: true
    }
  });
};