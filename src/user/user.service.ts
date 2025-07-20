import { eq, sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIUser, UsersTable } from "../Drizzle/schema";

// Create a new user
export const createUserService = async (user: TIUser) => {
  await db.insert(UsersTable).values(user);
  return "User created successfully";
};

// Get user by email
export const getUserByEmailService = async (email: string) => {
  return await db.query.UsersTable.findFirst({
    where: sql`${UsersTable.email} = ${email}`
  });
};

// Verify a user
export const verifyUserService = async (email: string) => {
  await db
    .update(UsersTable)
    .set({ isVerified: true, verificationCode: null })
    .where(sql`${UsersTable.email} = ${email}`);
};

// Login a user
export const userLoginService = async (user: TIUser) => {
  const { email } = user;
  return await db.query.UsersTable.findFirst({
    columns: {
      user_id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      role: true
    },
    where: sql`${UsersTable.email} = ${email}`
  });
};

// Get all users
export const getUsersService = async () => {
  return await db.query.UsersTable.findMany();
};

// Get a user by ID
export const getUserByIdService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, id)
  });
};

// ✅ Update a user by ID
export const updateUserService = async (id: number, updates: Partial<TIUser>) => {
  // ensure we add a timestamp on update
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(UsersTable)
    .set(allowedUpdates)
    .where(eq(UsersTable.user_id, id));

  return "User updated successfully";
};

// Delete a user by ID
export const deleteUserService = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.user_id, id));
  return "User deleted successfully";
};

// Get a user with all their appointments
export const getUserWithAppointments = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      appointments: true
    }
  });
};

// Get a user with all their prescriptions
export const getUserWithPrescriptions = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      prescriptions: true
    }
  });
};

// Get a user with all their complaints
export const getUserWithComplaints = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      complaints: true
    }
  });
};

// Fetch all complaints with full details
export const getAllComplaintsWithDetails = async () => {
  return await db.query.ComplaintsTable.findMany({
    with: {
      user: true,
      appointment: {
        with: {
          doctor: true
        }
      }
    }
  });
};

// Get a user with all their payments
export const getUserWithPayments = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      appointments: {
        with: {
          payments: true
        }
      }
    }
  });
};
