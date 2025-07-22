import { eq, sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { DoctorsTable, TIUser, TSUser, UsersTable } from "../Drizzle/schema";

//  Create a new user
export const createUserService = async (user: TIUser) => {
  await db.insert(UsersTable).values(user);
  return "User created successfully";
};

//  Get user by email
export const getUserByEmailService = async (email: string) => {
  return await db.query.UsersTable.findFirst({
    where: sql`${UsersTable.email} = ${email}`,
  });
};

//  Verify a user
export const verifyUserService = async (email: string) => {
  await db
    .update(UsersTable)
    .set({ isVerified: true, verificationCode: null })
    .where(sql`${UsersTable.email} = ${email}`);
};

//  Login a user (fixed signature)
export const userLoginService = async (user:TSUser) => {
  const { email } = user;
  const userExist = await db.query.UsersTable.findFirst({
     columns: {
      user_id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      contact_phone: true,
      address: true,
      role: true,
    },
    where: sql`${UsersTable.email} = ${email}`,
  });
  if (!userExist) {
    throw new Error("User not found");
  }
  let doctor_id:number | undefined = undefined;
  if (userExist.role === "doctor") {
    const doctor = await db.query.DoctorsTable.findFirst({
      columns:{
        doctor_id:true,
      },
      where: sql`${DoctorsTable.user_id} = ${userExist.user_id}`,
    });

    doctor_id = doctor?.doctor_id;
  }
  return {...userExist, doctor_id }; 
};

//  Get all users
export const getUsersService = async () => {
  return await db.query.UsersTable.findMany();
};

//  Get a user by ID
export const getUserByIdService = async (id: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, id),
  });
};

//  Update a user by ID
export const updateUserService = async (
  id: number,
  updates: Partial<TIUser>
) => {
  const allowedUpdates = { ...updates, updated_at: new Date() };

  await db
    .update(UsersTable)
    .set(allowedUpdates)
    .where(eq(UsersTable.user_id, id));

  return "User updated successfully";
};

//  Delete a user by ID
export const deleteUserService = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.user_id, id));
  return "User deleted successfully";
};

//  Get a user with all their appointments
export const getUserWithAppointments = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      appointments: true,
    },
  });
};

//  Get a user with all their prescriptions
export const getUserWithPrescriptions = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      prescriptions: true,
    },
  });
};

//  Get a user with all their complaints
export const getUserWithComplaints = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      complaints: true,
    },
  });
};

//  Fetch all complaints with full details
export const getAllComplaintsWithDetails = async () => {
  return await db.query.ComplaintsTable.findMany({
    with: {
      user: true,
      appointment: {
        with: {
          doctor: true,
        },
      },
    },
  });
};

//  Get a user with all their payments
export const getUserWithPayments = async (userID: number) => {
  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.user_id, userID),
    with: {
      appointments: {
        with: {
          payments: true,
        },
      },
    },
  });
};
