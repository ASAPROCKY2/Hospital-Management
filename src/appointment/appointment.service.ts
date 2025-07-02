
import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIAppointment, AppointmentsTable } from "../Drizzle/schema";

// Create a new appointment
export const createAppointmentService = async (appointment: TIAppointment) => {
  await db.insert(AppointmentsTable).values(appointment);
  return "Appointment created successfully";
};

// Get all appointments
export const getAllAppointmentsService = async () => {
  return await db.query.AppointmentsTable.findMany({
    with: {
      user: true,
      doctor: true,
      prescriptions: true,
      payments: true
    }
  });
};

// Get appointment by ID
export const getAppointmentByIdService = async (id: number) => {
  return await db.query.AppointmentsTable.findFirst({
    where: eq(AppointmentsTable.appointment_id, id),
    with: {
      user: true,
      doctor: true,
      prescriptions: true,
      payments: true
    }
  });
};

// Update appointment by ID
export const updateAppointmentService = async (
  id: number,
  data: Partial<TIAppointment>
) => {
  await db.update(AppointmentsTable).set(data).where(eq(AppointmentsTable.appointment_id, id));
  return "Appointment updated successfully";
};

// Delete appointment by ID
export const deleteAppointmentService = async (id: number) => {
  await db.delete(AppointmentsTable).where(eq(AppointmentsTable.appointment_id, id));
  return "Appointment deleted successfully";
};

// Get appointments by doctor ID
export const getAppointmentsByDoctorService = async (doctorID: number) => {
  return await db.query.AppointmentsTable.findMany({
    where: eq(AppointmentsTable.doctor_id, doctorID),
    with: {
      user: true,
      prescriptions: true,
      payments: true
    }
  });
};

// Get appointments by user ID
export const getAppointmentsByUserService = async (userID: number) => {
  return await db.query.AppointmentsTable.findMany({
    where: eq(AppointmentsTable.user_id, userID),
    with: {
      doctor: true,
      prescriptions: true,
      payments: true
    }
  });
};
