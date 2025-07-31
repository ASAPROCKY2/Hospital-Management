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
import dashboardRoutes from "./dashboard/dashboard.router";
import userDashboardRoutes from "./userdashboard/UserDashboard.router";
import DoctorDashboardRoutes from "./doctordashboard/DoctorDashboard.router";


const app = express();


app.use(express.json());

// Enable CORS so your React frontend can call this backend
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


userRoutes(app);
doctorRoutes(app);
appointmentRoutes(app);
prescriptionRoutes(app);
complaintRoutes(app);
paymentRoutes(app);
dashboardRoutes(app); 
userDashboardRoutes(app);
DoctorDashboardRoutes(app);


app.get("/", (req, res) => {
  res.send("Hospital Management API is live");
});
const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
