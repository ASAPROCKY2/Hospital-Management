import {
  createUserService,
  getUserByEmailService,
  verifyUserService,
  userLoginService,
  getUsersService,
  deleteUserService,
  getUserByIdService,
  getUserWithAppointments,
  getUserWithPrescriptions,
  getUserWithComplaints,
  getUserWithPayments,
  getAllComplaintsWithDetails
} from "../../src/user/user.service";

import db from "../../src/Drizzle/db";
import { UsersTable } from "../../src/Drizzle/schema";


jest.mock("../../src/Drizzle/db", () => {
  const mockFindFirst = jest.fn();
  const mockFindMany = jest.fn();
  //stimulate the findFirst and findMany methods

  return {
    __esModule: true,
    default: {
      insert: jest.fn(() => ({
        values: jest.fn().mockResolvedValue(undefined)
      })),
      update: jest.fn(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined)
      })),
      delete: jest.fn(() => ({
        where: jest.fn().mockResolvedValue(undefined)
      })),
      query: {
        UsersTable: {
          findFirst: mockFindFirst,
          findMany: mockFindMany
        },
        ComplaintsTable: {
          findMany: mockFindMany
        }
      }
    }
  };
});

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserService", () => {
    it("should insert a user and return success message", async () => {
      const user = {
        firstname: "Test",
        lastname: "User",
        email: "test@mail.com",
        password: "hashed",
        role: "user" as const
      };

      const result = await createUserService(user);
      expect(db.insert).toHaveBeenCalledWith(UsersTable);
      expect(result).toBe("User created successfully");
    });
  });

  describe("getUserByEmailService", () => {
    it("should return user by email if found", async () => {
      const mockUser = {
        user_id: 1,
        firstname: "Test",
        lastname: "User",
        email: "test@mail.com",
        password: "hashed",
        role: "user"
      };

      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await getUserByEmailService("test@mail.com");
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
      const result = await getUserByEmailService("none@mail.com");
      expect(result).toBeNull();
    });
  });

  describe("verifyUserService", () => {
    it("should update user as verified and clear code", async () => {
      const mockSet = jest.fn().mockReturnThis();
      const mockWhere = jest.fn().mockResolvedValue(undefined);
      (db.update as jest.Mock).mockReturnValueOnce({ set: mockSet, where: mockWhere });

      await verifyUserService("test@mail.com");
      expect(mockSet).toHaveBeenCalledWith({
        isVerified: true,
        verificationCode: null
      });
    });
  });

  describe("userLoginService", () => {
    it("should return user data on login", async () => {
      const mockUser = {
        user_id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@mail.com",
        password: "secret",
        role: "user"
      };

      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await userLoginService({ email: "john@mail.com" } as any);
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUsersService", () => {
    it("should return all users", async () => {
      const mockUsers = [{ user_id: 1 }, { user_id: 2 }];
      (db.query.UsersTable.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);
      const result = await getUsersService();
      expect(result).toEqual(mockUsers);
    });
  });

  describe("deleteUserService", () => {
    it("should delete a user and return success message", async () => {
      const result = await deleteUserService(1);
      expect(result).toBe("User deleted successfully");
    });
  });

  describe("getUserByIdService", () => {
    it("should return a user by ID", async () => {
      const mockUser = { user_id: 1, firstname: "Sam" };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);
      const result = await getUserByIdService(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserWithAppointments", () => {
    it("should return user with appointments", async () => {
      const mockData = { user_id: 1, appointments: [] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithAppointments(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserWithPrescriptions", () => {
    it("should return user with prescriptions", async () => {
      const mockData = { user_id: 1, prescriptions: [] };
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithPrescriptions(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserWithComplaints", () => {
    it("should return user with complaints", async () => {
      const mockData = {
        user_id: 1,
        complaints: [
          {
            complaint_id: 1,
            appointment: { appointment_id: 2 }
          }
        ]
      };

      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithComplaints(1);

      expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith({
        where: expect.anything(),
        with: {
          complaints: true
        }
      });

      expect(result).toEqual(mockData);
    });
  });

  describe("getAllComplaintsWithDetails", () => {
    it("should return complaints with user and doctor", async () => {
      const mockComplaints = [
        {
          complaint_id: 1,
          user: { user_id: 1 },
          appointment: {
            appointment_id: 10,
            doctor: { doctor_id: 2 }
          }
        }
      ];

      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockComplaints);
      const result = await getAllComplaintsWithDetails();

      expect(db.query.ComplaintsTable.findMany).toHaveBeenCalledWith({
        with: {
          user: true,
          appointment: {
            with: {
              doctor: true
            }
          }
        }
      });

      expect(result).toEqual(mockComplaints);
    });
  });

  describe("getUserWithPayments", () => {
    it("should return user with appointments and payments", async () => {
      const mockData = {
        user_id: 1,
        appointments: [
          {
            appointment_id: 5,
            payments: [{ payment_id: 9 }]
          }
        ]
      };

      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getUserWithPayments(1);

      expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith({
        where: expect.anything(),
        with: {
          appointments: {
            with: {
              payments: true
            }
          }
        }
      });

      expect(result).toEqual(mockData);
    });
  });
});
