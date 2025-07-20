// src/complaint/complaint.service.ts
import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { ComplaintsTable, TIComplaint } from "../Drizzle/schema";

//  Create a new complaint
export const createComplaintService = async (complaint: TIComplaint) => {
  await db.insert(ComplaintsTable).values(complaint);
  return "Complaint submitted successfully";
};

//  Get all complaints (with joined user and doctor info)
export const getAllComplaintsService = async () => {
  const complaints = await db.query.ComplaintsTable.findMany({
    with: {
      user: true,
      doctor: true,
    },
  });

  return complaints.map((c) => ({
    complaint_id: c.complaint_id,
    subject: c.subject,
    description: c.description,
    status: c.status,
    created_at: c.created_at,
    updated_at: c.updated_at,

    doctor_id: c.doctor_id,
    doctor_name: c.doctor
      ? `Dr. ${c.doctor.first_name} ${c.doctor.last_name}`
      : "Unknown doctor",

    user_id: c.user_id,
    patient_name: c.user
      ? `${c.user.firstname} ${c.user.lastname}`
      : "Unknown user",
  }));
};

//  Get a single complaint by ID
export const getComplaintByIdService = async (id: number) => {
  const complaint = await db.query.ComplaintsTable.findFirst({
    where: eq(ComplaintsTable.complaint_id, id),
    with: {
      user: true,
      doctor: true,
    },
  });

  if (!complaint) return null;

  return {
    complaint_id: complaint.complaint_id,
    subject: complaint.subject,
    description: complaint.description,
    status: complaint.status,
    created_at: complaint.created_at,
    updated_at: complaint.updated_at,

    doctor_id: complaint.doctor_id,
    doctor_name: complaint.doctor
      ? `Dr. ${complaint.doctor.first_name} ${complaint.doctor.last_name}`
      : "Unknown doctor",

    user_id: complaint.user_id,
    patient_name: complaint.user
      ? `${complaint.user.firstname} ${complaint.user.lastname}`
      : "Unknown user",
  };
};

//  Update complaint
export const updateComplaintService = async (
  id: number,
  data: Partial<TIComplaint>
) => {
  await db.update(ComplaintsTable)
    .set(data)
    .where(eq(ComplaintsTable.complaint_id, id));
  return "Complaint updated successfully";
};

//  Delete complaint
export const deleteComplaintService = async (id: number) => {
  await db.delete(ComplaintsTable)
    .where(eq(ComplaintsTable.complaint_id, id));
  return "Complaint deleted successfully";
};

//  Get complaints by user
export const getComplaintsByUserService = async (userID: number) => {
  const complaints = await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.user_id, userID),
    with: {
      doctor: true,
    },
  });

  return complaints.map((c) => ({
    complaint_id: c.complaint_id,
    subject: c.subject,
    description: c.description,
    status: c.status,
    created_at: c.created_at,
    updated_at: c.updated_at,

    doctor_id: c.doctor_id,
    doctor_name: c.doctor
      ? `Dr. ${c.doctor.first_name} ${c.doctor.last_name}`
      : "Unknown doctor",

    user_id: c.user_id,
  }));
};

//  Get complaints against a doctor
export const getComplaintsByDoctorService = async (doctorID: number) => {
  const complaints = await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.doctor_id, doctorID),
    with: {
      user: true,
    },
  });

  return complaints.map((c) => ({
    complaint_id: c.complaint_id,
    subject: c.subject,
    description: c.description,
    status: c.status,
    created_at: c.created_at,
    updated_at: c.updated_at,

    user_id: c.user_id,
    patient_name: c.user
      ? `${c.user.firstname} ${c.user.lastname}`
      : "Unknown user",
  }));
};

//  Get full complaint details
export const getFullComplaintDetailsService = async (id: number) => {
  const complaint = await db.query.ComplaintsTable.findFirst({
    where: eq(ComplaintsTable.complaint_id, id),
    with: {
      user: true,
      doctor: true,
    },
  });

  if (!complaint) return null;

  return {
    complaint_id: complaint.complaint_id,
    subject: complaint.subject,
    description: complaint.description,
    status: complaint.status,
    created_at: complaint.created_at,
    updated_at: complaint.updated_at,

    doctor_id: complaint.doctor_id,
    doctor_name: complaint.doctor
      ? `Dr. ${complaint.doctor.first_name} ${complaint.doctor.last_name}`
      : "Unknown doctor",

    user_id: complaint.user_id,
    patient_name: complaint.user
      ? `${complaint.user.firstname} ${complaint.user.lastname}`
      : "Unknown user",
  };
};
