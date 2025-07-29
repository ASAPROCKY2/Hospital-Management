import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIAppointment, AppointmentsTable, PaymentsTable } from "../Drizzle/schema";

//  Create a new appointment
export const createAppointmentService = async (appointment: TIAppointment) => {
  await db.insert(AppointmentsTable).values(appointment);
  return "Appointment created successfully";
};

//  Get all appointments (flatten doctor/patient info safely)
export const getAllAppointmentsService = async () => {
  const rows = await db.query.AppointmentsTable.findMany({
    with: {
      user: true,
      doctor: true,
      prescriptions: true,
      payments: true,
    },
  });

  return rows.map((appt) => {
    const doctorName = appt.doctor
      ? `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`
      : null;
    const patientName = appt.user
      ? `${appt.user.firstname} ${appt.user.lastname}`
      : null;

    return {
      appointment_id: appt.appointment_id,
      appointment_date: appt.appointment_date,
      time_slot: appt.time_slot,
      total_amount: appt.total_amount,
      appointment_status: appt.appointment_status,
      created_at: appt.created_at,
      updated_at: appt.updated_at,
      doctor_id: appt.doctor_id,
      doctor_name: doctorName,
      user_id: appt.user_id,
      patient_name: patientName,
      prescriptions: appt.prescriptions,
      payments: appt.payments,
    };
  });
};

//  Get single appointment by ID
export const getAppointmentByIdService = async (id: number) => {
  const appt = await db.query.AppointmentsTable.findFirst({
    where: eq(AppointmentsTable.appointment_id, id),
    with: {
      user: true,
      doctor: true,
      prescriptions: true,
      payments: true,
    },
  });

  if (!appt) return null;

  const doctorName = appt.doctor
    ? `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`
    : null;
  const patientName = appt.user
    ? `${appt.user.firstname} ${appt.user.lastname}`
    : null;

  return {
    appointment_id: appt.appointment_id,
    appointment_date: appt.appointment_date,
    time_slot: appt.time_slot,
    total_amount: appt.total_amount,
    appointment_status: appt.appointment_status,
    created_at: appt.created_at,
    updated_at: appt.updated_at,
    doctor_id: appt.doctor_id,
    doctor_name: doctorName,
    user_id: appt.user_id,
    patient_name: patientName,
    prescriptions: appt.prescriptions,
    payments: appt.payments,
  };
};

//  Update appointment by ID
export const updateAppointmentService = async (
  id: number,
  data: Partial<TIAppointment>
) => {
  await db
    .update(AppointmentsTable)
    .set(data)
    .where(eq(AppointmentsTable.appointment_id, id));
  return "Appointment updated successfully";
};

//  Delete appointment by ID
export const deleteAppointmentService = async (id: number) => {
  await db.delete(AppointmentsTable).where(eq(AppointmentsTable.appointment_id, id));
  return "Appointment deleted successfully";
};

//  Cancel appointment by ID (new)
export const cancelAppointmentService = async (appointmentId: number) => {

  await db
    .update(AppointmentsTable)
    .set({ appointment_status: "Cancelled" })
    .where(eq(AppointmentsTable.appointment_id, appointmentId));


  await db
    .update(PaymentsTable)
    .set({ payment_status: "cancelled" })
    .where(eq(PaymentsTable.appointment_id, appointmentId));

  return "Appointment cancelled";
};

//  Get appointments by doctor
export const getAppointmentsByDoctorService = async (doctorID: number) => {
  const rows = await db.query.AppointmentsTable.findMany({
    where: eq(AppointmentsTable.doctor_id, doctorID),
    with: {
      user: true,
      doctor: true,
    },
  });

  return rows.map((appt) => ({
    appointment_id: appt.appointment_id,
    appointment_date: appt.appointment_date,
    time_slot: appt.time_slot,
    total_amount: appt.total_amount,
    appointment_status: appt.appointment_status,
    doctor_id: appt.doctor_id,
    doctor_name: appt.doctor
      ? `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`
      : null,
    user_id: appt.user_id,
    patient_name: appt.user
      ? `${appt.user.firstname} ${appt.user.lastname}`
      : null,
  }));
};

//  Get appointments by user
export const getAppointmentsByUserService = async (userID: number) => {
  const rows = await db.query.AppointmentsTable.findMany({
    where: eq(AppointmentsTable.user_id, userID),
    with: {
      user: true,
      doctor: true,
    },
  });

  return rows.map((appt) => ({
    appointment_id: appt.appointment_id,
    appointment_date: appt.appointment_date,
    time_slot: appt.time_slot,
    total_amount: appt.total_amount,
    appointment_status: appt.appointment_status,
    doctor_id: appt.doctor_id,
    doctor_name: appt.doctor
      ? `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`
      : null,
    user_id: appt.user_id,
    patient_name: appt.user
      ? `${appt.user.firstname} ${appt.user.lastname}`
      : null,
  }));
};
