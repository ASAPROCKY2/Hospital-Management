import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  integer,
  decimal,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";


// Enums
export const roleEnum = pgEnum("role", ["user", "admin", "doctor"]);
//Defines the type of user in the system
export const appointmentStatusEnum = pgEnum("appointment_status", ["Pending", "Confirmed", "Cancelled"]);
//Defines the status of an appointment
export const complaintStatusEnum = pgEnum("complaint_status", ["Open", "In Progress", "Resolved", "Closed"]);
//Defines the status of a complaint
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "cancelled", 
]);


//Defines the status of a payment

// Users Table
export const UsersTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  firstname: varchar("firstname", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
 password: varchar("password", { length: 100 }).notNull(),

 isVerified: boolean("IsVerified").default(false),
  verificationCode: varchar ("verification_code", { length: 10 }),


  contact_phone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  role: roleEnum("role").default("user"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Doctors Table
export const DoctorsTable = pgTable("doctors", {
  doctor_id: serial("doctor_id").primaryKey(),
  first_name: varchar("first_name", { length: 50 }).notNull(),
  last_name: varchar("last_name", { length: 50 }).notNull(),
  specialization: varchar("specialization", { length: 100 }),
  contact_phone: varchar("contact_phone", { length: 20 }),
  available_days: text("available_days"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Appointments Table
export const AppointmentsTable = pgTable("appointments", {
  appointment_id: serial("appointment_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => UsersTable.user_id, { onDelete: "cascade" }),
  doctor_id: integer("doctor_id").notNull().references(() => DoctorsTable.doctor_id, { onDelete: "cascade" }),
  appointment_date: date("appointment_date").notNull(),
  time_slot: varchar("time_slot", { length: 50 }).notNull(),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }),
  appointment_status: appointmentStatusEnum("appointment_status").default("Pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Prescriptions Table
export const PrescriptionsTable = pgTable("prescriptions", {
  prescription_id: serial("prescription_id").primaryKey(),
  appointment_id: integer("appointment_id").notNull().references(() => AppointmentsTable.appointment_id, { onDelete: "cascade" }),
  doctor_id: integer("doctor_id").notNull().references(() => DoctorsTable.doctor_id, { onDelete: "cascade" }),
  patient_id: integer("patient_id").notNull().references(() => UsersTable.user_id, { onDelete: "cascade" }),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const PaymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  appointment_id: integer("appointment_id").notNull().references(() => AppointmentsTable.appointment_id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_status: paymentStatusEnum("payment_status").default("pending").notNull(),
    
user_id: integer("user_id") 
  .references(() => UsersTable.user_id, { onDelete: "set null" }),
  transaction_id: varchar("transaction_id", { length: 100 }),
  payment_date: date("payment_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Complaints Table
export const ComplaintsTable = pgTable("complaints", {
  complaint_id: serial("complaint_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => UsersTable.user_id, { onDelete: "cascade" }),
    doctor_id: integer("doctor_id").references(() => DoctorsTable.doctor_id, { onDelete: "set null" }),
  related_appointment_id: integer("related_appointment_id").references(() => AppointmentsTable.appointment_id, { onDelete: "set null" }),
  subject: varchar("subject", { length: 100 }).notNull(),
  description: text("description"),
  status: complaintStatusEnum("status").default("Open"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// RELATIONS
export const UserRelations = relations(UsersTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable),
  complaints: many(ComplaintsTable)
}));

export const DoctorRelations = relations(DoctorsTable, ({ many }) => ({
  appointments: many(AppointmentsTable),
  prescriptions: many(PrescriptionsTable)
}));

export const AppointmentRelations = relations(AppointmentsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [AppointmentsTable.user_id],
    references: [UsersTable.user_id],
  }),
  doctor: one(DoctorsTable, {
    fields: [AppointmentsTable.doctor_id],
    references: [DoctorsTable.doctor_id],
  }),
  prescriptions: many(PrescriptionsTable),
  payments: many(PaymentsTable)
}));

export const PrescriptionRelations = relations(PrescriptionsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PrescriptionsTable.appointment_id],
    references: [AppointmentsTable.appointment_id],
  }),
  doctor: one(DoctorsTable, {
    fields: [PrescriptionsTable.doctor_id],
    references: [DoctorsTable.doctor_id],
  }),
  patient: one(UsersTable, {
    fields: [PrescriptionsTable.patient_id],
    references: [UsersTable.user_id],
  }),
}));

export const PaymentRelations = relations(PaymentsTable, ({ one }) => ({
  appointment: one(AppointmentsTable, {
    fields: [PaymentsTable.appointment_id],
    references: [AppointmentsTable.appointment_id]
  }),
  user: one(UsersTable, {
    fields: [PaymentsTable.user_id],
    references: [UsersTable.user_id]
  })
}));


export const ComplaintRelations = relations(ComplaintsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [ComplaintsTable.user_id],
    references: [UsersTable.user_id]
  }),
  appointment: one(AppointmentsTable, {
    fields: [ComplaintsTable.related_appointment_id],
    references: [AppointmentsTable.appointment_id]
  }),
  doctor: one(DoctorsTable, { 
    fields: [ComplaintsTable.doctor_id],
    references: [DoctorsTable.doctor_id]
  })
}));



// infer.types

// User types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

// Doctor types
export type TIDoctor = typeof DoctorsTable.$inferInsert;
export type TSDoctor = typeof DoctorsTable.$inferSelect;

// Appointment types
export type TIAppointment = typeof AppointmentsTable.$inferInsert;
export type TSAppointment = typeof AppointmentsTable.$inferSelect;

// Prescription types
export type TIPrescription = typeof PrescriptionsTable.$inferInsert;
export type TSPrescription = typeof PrescriptionsTable.$inferSelect;

// Complaint types
export type TIComplaint = typeof ComplaintsTable.$inferInsert;
export type TSComplaint = typeof ComplaintsTable.$inferSelect;

// Payment types
export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;
