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
  await db.update(UsersTable)
    .set({ isVerified: true, verificationCode: null })
    .where(sql`${UsersTable.email} = ${email}`);
};

// Login a user
export const userLoginService = async (user: TIUser) => {    //accepts a user object of type TIUser.
  const { email } = user;
  return await db.query.UsersTable.findFirst({ //Drizzle's query API to find the first user with a matching email
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

// Delete a user by ID
export const deleteUserService = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.user_id, id));
  return "User deleted successfully";
};

// Get a user by ID
export const getUserByIdService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, id)
  });
};



//This pulls a user and all their appointments, including which doctor, payments, and prescriptions are linked to each.

export const getUserWithAppointments = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      appointments: true
    }
  });
};





// Fetches a user along with all their prescriptions.

export const getUserWithPrescriptions = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      prescriptions: true
    }
  });
};




// Fetches a user along with all their complaints.

export const getUserWithComplaints = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      complaints: true
    }
  });
};




//Fetches all complaints in the system
export const getAllComplaintsWithDetails = async () => {
  return await db.query.ComplaintsTable.findMany();
};




// Fetches a user along with all their payments
export const getUserWithPayments = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
  
      appointments: {
        with: {
          payments: true
        }
      }
    },
  });
};

