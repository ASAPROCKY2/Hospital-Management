import db from "./db";
import {
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
  PrescriptionsTable,
  PaymentsTable,
  ComplaintsTable,
} from "./schema";

async function seed() {
  console.log("Seeding to database started...");

  // Insert users (patients + admin)
  await db.insert(UsersTable).values([
    { firstname: "Emily", lastname: "Ngugi", email: "emily.ngugi@example.com", password: "hashed123", contact_phone: "0712345678", address: "Westlands, Nairobi", role: "user" },
    { firstname: "Daniel", lastname: "Otieno", email: "dan.otieno@example.com", password: "hashed456", contact_phone: "0723456789", address: "Kisumu CBD", role: "user" },
    { firstname: "Aisha", lastname: "Mohamed", email: "aisha.mo@example.com", password: "hashed789", contact_phone: "0734567890", address: "Nyali, Mombasa", role: "user" },
    { firstname: "Kevin", lastname: "Mwangi", email: "kevin.mwangi@example.com", password: "hashed321", contact_phone: "0745678901", address: "Eldoret Town", role: "user" },
    { firstname: "Joy", lastname: "Wanjiru", email: "joy.wanjiru@example.com", password: "hashed999", contact_phone: "0756789012", address: "Thika Road", role: "admin" },
  ]);

  // Insert doctors
  await db.insert(DoctorsTable).values([
    { first_name: "Michael", last_name: "Njoroge", specialization: "General Medicine", contact_phone: "0701002001", available_days: "Mon,Tue,Wed" },
    { first_name: "Grace", last_name: "Mwende", specialization: "Pediatrics", contact_phone: "0701002002", available_days: "Tue,Thu,Fri" },
    { first_name: "James", last_name: "Ouma", specialization: "Dermatology", contact_phone: "0701002003", available_days: "Mon,Fri" },
    { first_name: "Susan", last_name: "Kariuki", specialization: "Cardiology", contact_phone: "0701002004", available_days: "Wed,Thu" },
    { first_name: "Peter", last_name: "Mulei", specialization: "Orthopedics", contact_phone: "0701002005", available_days: "Mon,Tue,Thu" },
  ]);

  // Insert appointments
  await db.insert(AppointmentsTable).values([
    { user_id: 1, doctor_id: 1, appointment_date: "2025-07-05", time_slot: "09:00 - 10:00", total_amount: "1200.00", appointment_status: "Confirmed" },
    { user_id: 2, doctor_id: 2, appointment_date: "2025-07-06", time_slot: "11:00 - 12:00", total_amount: "1500.00", appointment_status: "Pending" },
    { user_id: 3, doctor_id: 3, appointment_date: "2025-07-07", time_slot: "10:00 - 11:00", total_amount: "1800.00", appointment_status: "Cancelled" },
    { user_id: 4, doctor_id: 4, appointment_date: "2025-07-08", time_slot: "14:00 - 15:00", total_amount: "2000.00", appointment_status: "Confirmed" },
    { user_id: 1, doctor_id: 5, appointment_date: "2025-07-09", time_slot: "13:00 - 14:00", total_amount: "1600.00", appointment_status: "Pending" },
  ]);

  // Insert prescriptions
  await db.insert(PrescriptionsTable).values([
    { appointment_id: 1, doctor_id: 1, patient_id: 1, notes: "Take Amoxicillin 500mg three times a day for 7 days" },
    { appointment_id: 2, doctor_id: 2, patient_id: 2, notes: "Paracetamol syrup 5ml every 6 hours for 3 days" },
    { appointment_id: 3, doctor_id: 3, patient_id: 3, notes: "Apply antifungal cream twice daily" },
    { appointment_id: 4, doctor_id: 4, patient_id: 4, notes: "Losartan 50mg once daily for blood pressure" },
    { appointment_id: 5, doctor_id: 5, patient_id: 1, notes: "Ibuprofen 400mg every 8 hours after meals" },
  ]);

  // Insert payments
 await db.insert(PaymentsTable).values([
  {
    appointment_id: 1,
    amount: "1200.00",
    payment_status: "paid",
    transaction_id: "TXN001",
    payment_date: "2025-07-05",
  },
  {
    appointment_id: 2,
    amount: "1500.00",
    payment_status: "pending",
    transaction_id: "TXN002",
    payment_date: "2025-07-06",
  },
  {
    appointment_id: 3,
    amount: "1800.00",
    payment_status: "cancelled",
    transaction_id: "TXN003",
    payment_date: "2025-07-07",
  },
  {
    appointment_id: 4,
    amount: "2000.00",
    payment_status: "paid",
    transaction_id: "TXN004",
    payment_date: "2025-07-08",
  },
  {
    appointment_id: 5,
    amount: "1600.00",
    payment_status: "pending",
    transaction_id: "TXN005",
    payment_date: "2025-07-09",
  },
]);


  // Insert complaints
  await db.insert(ComplaintsTable).values([
    { user_id: 1, related_appointment_id: 1, subject: "Late doctor", description: "Doctor arrived 30 minutes late", status: "Open" },
    { user_id: 2, related_appointment_id: 2, subject: "No show", description: "Doctor did not attend the session", status: "In Progress" },
    { user_id: 3, related_appointment_id: 3, subject: "Wrong bill", description: "Overcharged for basic consultation", status: "Resolved" },
    { user_id: 4, related_appointment_id: 4, subject: "Rude staff", description: "Receptionist was impolite", status: "Closed" },
    { user_id: 1, related_appointment_id: 5, subject: "Short consultation", description: "Only spent 5 minutes with doctor", status: "Open" },
  ]);

  console.log("Seeding to database completed successfully.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
