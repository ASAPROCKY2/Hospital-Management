// src/app.ts or src/index.ts

import express from "express";

// Import all route files
import userRoutes from "./user/user.router";
import doctorRoutes from "./doctor/doctor.router";
import appointmentRoutes from "./appointment/appointment.router";
import prescriptionRoutes from "./prescription/prescription.router";
import complaintRoutes from "./complaint/complaint.router";
import paymentRoutes from "./payment/payment.router";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Register all routes
userRoutes(app);
doctorRoutes(app);
appointmentRoutes(app);
prescriptionRoutes(app);
complaintRoutes(app);
paymentRoutes(app);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hospital Management API is live");
});

// Start server
app.listen(8081, () => {
  console.log("Server is running at http://localhost:8081");
});
