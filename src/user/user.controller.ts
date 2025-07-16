import { Request, Response } from "express";
import {
  createUserService,
  getUserByEmailService,
  verifyUserService,
  userLoginService,
  getUsersService,
  getUserByIdService,
  deleteUserService,
  getUserWithAppointments,
  getUserWithPrescriptions,
  getUserWithComplaints,
  getUserWithPayments,
  getAllComplaintsWithDetails,
} from "./user.service";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Mailer/mailer";

//  Register a new user
export const createUserController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contactPhone,
      address,
      role,
    } = req.body;

    //  Validate role
    if (!role || !["doctor", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be doctor or patient." });
    }

    //  Check if the user already exists
    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const userToCreate = {
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      contact_phone: contactPhone,
      address,
      role,
    };

    await createUserService(userToCreate);

    if (process.env.NODE_ENV !== "test") {
      await sendEmail(
        email,
        "Verify your account",
        `Hello ${lastName}, your verification code is: ${verificationCode}`,
        `<h3>Hello ${lastName},</h3><p>Your verification code is: <strong>${verificationCode}</strong></p>`
      );
    }

    return res
      .status(201)
      .json({ message: "User created. Verification code sent to email." });
  } catch (err: any) {
    console.error("Error in createUserController:", err);
    return res.status(500).json({ error: err.message });
  }
};

//  Login
export const userLoginController = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const existingUser = await userLoginService(user);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(user.password, existingUser.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user_id: existingUser.user_id,
      email: existingUser.email,
      role: existingUser.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: existingUser.user_id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error in userLoginController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Verify user
export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await verifyUserService(email);
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error: any) {
    console.error("Error in verifyUserController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get all users
export const getUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    return res.status(200).json({ data: users });
  } catch (error: any) {
    console.error("Error in getUsersController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get user by ID
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("Error in getUserByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Delete user
export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

    await deleteUserService(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleteUserByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get user with appointments
export const getUserWithAppointmentsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserWithAppointments(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("Error in getUserWithAppointmentsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get user with prescriptions
export const getUserWithPrescriptionsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserWithPrescriptions(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("Error in getUserWithPrescriptionsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get user with complaints
export const getUserWithComplaintsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserWithComplaints(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("Error in getUserWithComplaintsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Get user with payments
export const getUserWithPaymentsController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserWithPayments(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("Error in getUserWithPaymentsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//  Admin: Get all complaints with full details
export const getAllComplaintsWithDetailsController = async (_req: Request, res: Response) => {
  try {
    const complaints = await getAllComplaintsWithDetails();
    return res.status(200).json({ data: complaints });
  } catch (error: any) {
    console.error("Error in getAllComplaintsWithDetailsController:", error);
    return res.status(500).json({ error: error.message });
  }
};
