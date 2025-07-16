// src/index.ts

import express from "express";
import cors from "cors";

// Import all route files
import userRoutes from "./user/user.router";
import doctorRoutes from "./doctor/doctor.router";
import appointmentRoutes from "./appointment/appointment.router";
import prescriptionRoutes from "./prescription/prescription.router";
import complaintRoutes from "./complaint/complaint.router";
import paymentRoutes from "./payment/payment.router";

const app = express();

//  Enable JSON body parsing
app.use(express.json());

//  Enable CORS so your React frontend can call this backend
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin (Vite default)
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    credentials: true, // if you need to send cookies or auth headers
  })
);

// ✅ Register all routes
userRoutes(app);
doctorRoutes(app);
appointmentRoutes(app);
prescriptionRoutes(app);
complaintRoutes(app);
paymentRoutes(app);

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Hospital Management API is live");
});

// ✅ Start server
app.listen(8081, () => {
  console.log("Server is running at http://localhost:8081");
});
