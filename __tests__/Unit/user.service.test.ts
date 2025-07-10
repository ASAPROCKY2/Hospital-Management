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

jest.mock("../../src/Drizzle/db", () => { //replace the real database module with a mock version
  const mockInsert = jest.fn(() => ({
    values: jest.fn().mockResolvedValueOnce(undefined)
  }));

  const mockUpdate = jest.fn(() => ({
    set: jest.fn().mockReturnThis(),//make fake set function that let you continue chaining other functions  
    where: jest.fn().mockResolvedValueOnce(undefined)
  }));

  const mockDelete = jest.fn(() => ({
    where: jest.fn().mockResolvedValueOnce(undefined)
  }));

  const mockQuery = {
    UsersTable: {
      findFirst: jest.fn(),
      findMany: jest.fn() 
    },
    ComplaintsTable: {
      findMany: jest.fn()
    }
  };

  return {
    __esModule: true,
    default: {
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      query: mockQuery
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
        role: "user" as "user"
      };
      const result = await createUserService(user);
      expect(db.insert).toHaveBeenCalledWith(UsersTable);
      expect(result).toBe("User created successfully");
    });
  });




  //test getUserByEmailService

  describe("getUserByEmailService", () => { //group of tests that are related to the createUSERService
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
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getUserByEmailService("unknown@mail.com");
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});


//test verifyUserService
describe("verifyUserService", () => {
  it("should update user to be verified and clear verificationCode", async () => {
    const email = "verified@example.com";

    const mockSet = jest.fn().mockReturnThis();
    const mockWhere = jest.fn().mockResolvedValueOnce(undefined);

    // Override the mock db.update setup for this specific test
    (db.update as jest.Mock).mockReturnValueOnce({
      set: mockSet,
      where: mockWhere
    });

    const result = await verifyUserService(email);

    expect(db.update).toHaveBeenCalledWith(UsersTable);
    expect(mockSet).toHaveBeenCalledWith({
      isVerified: true,
      verificationCode: null
    });
    expect(mockWhere).toHaveBeenCalledWith(expect.anything()); // Matches sql condition

    expect(result).toBeUndefined(); // The service does not return anything
  });
});








//test login a user
describe("userLoginService", () => {
  it("should return user data if found", async () => {
    const mockUser = {
      user_id: 1,
      firstname: "Jane",
      lastname: "Doe",
      email: "jane@example.com",
      password: "hashedpassword",
      role: "user"
    };

    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await userLoginService({ email: "jane@example.com" } as any);
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await userLoginService({ email: "ghost@example.com" } as any);
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});



//test get all users 
  
describe("getUsersService", () => {
  it("should return all users", async () => {
    const mockUsers = [
      {
        user_id: 1,
        firstname: "Alice",
        lastname: "Kimani",
        email: "alice@example.com",
        role: "user"
      },
      {
        user_id: 2,
        firstname: "Brian",
        lastname: "Otieno",
        email: "brian@example.com",
        role: "admin"
      }
    ];

    (db.query.UsersTable.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);

    const result = await getUsersService();
    expect(db.query.UsersTable.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it("should return an empty array if no users found", async () => {
    (db.query.UsersTable.findMany as jest.Mock).mockResolvedValueOnce([]);

    const result = await getUsersService();
    expect(db.query.UsersTable.findMany).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});



//test delete user by id
 
describe("deleteUserService", () => {
  it("should delete user and return success message", async () => {
    const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
    (db.delete as jest.Mock).mockReturnValueOnce({ where: mockWhere });

    const result = await deleteUserService(1);

    expect(db.delete).toHaveBeenCalledWith(UsersTable);
    expect(mockWhere).toHaveBeenCalled();
    expect(result).toBe("User deleted successfully");
  });
});



//test get user by id

// test getUserByIdService
describe("getUserByIdService", () => {
  it("should return user if found by ID", async () => {
    const mockUser = {
      user_id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      role: "user"
    };

    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await getUserByIdService(1);

    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getUserByIdService(999);

    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});


// test getUserWithAppointments

describe("getUserWithAppointments", () => {
  it("should return user with appointments and nested doctor, payments, and prescriptions", async () => {
    const mockUser = {
      user_id: 1,
      firstname: "Test",
      appointments: [
        {
          appointment_id: 101,
          doctor: { doctor_id: 1, name: "Dr. Smith" },
          payments: [{ payment_id: 201, amount: "1000" }],
          prescriptions: [{ prescription_id: 301, drug: "Paracetamol" }]
        }
      ]
    };

    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await getUserWithAppointments(1);

    expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith({
      where: expect.anything(), // we assume eq(...) is used
      with: {
        appointments: {
          with: {
            doctor: true,
            payments: true,
            prescriptions: true
          }
        }
      }
    });

    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getUserWithAppointments(999);
    expect(result).toBeNull();
  });
  
});



// test getUserWithPrescriptions

describe("getUserWithPrescriptions", () => {
  it("should return user with prescriptions and nested doctor and appointment", async () => {
    const mockUser = {
      user_id: 1,
      prescriptions: [
        {
          prescription_id: 1,
          drug: "Ibuprofen",
          doctor: { doctor_id: 2, name: "Dr. Jane" },
          appointment: { appointment_id: 5, date: "2025-07-06" }
        }
      ]
    };

    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await getUserWithPrescriptions(1);

    expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith({
      where: expect.anything(),
      with: {
        prescriptions: {
          with: {
            doctor: true,
            appointment: true
          }
        }
      }
    });

    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getUserWithPrescriptions(999);
    expect(result).toBeNull();
  });
});


// test getUserWithComplaints
describe("getUserWithComplaints", () => {
  it("should return user with complaints and linked appointments", async () => {
    const mockUser = {
      user_id: 1,
      complaints: [
        {
          complaint_id: 1,
          description: "Late appointment",
          appointment: { appointment_id: 3, date: "2025-07-04" }
        }
      ]
    };

    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await getUserWithComplaints(1);

    expect(db.query.UsersTable.findFirst).toHaveBeenCalledWith({
      where: expect.anything(),
      with: {
        complaints: {
          with: {
            appointment: true
          }
        }
      }
    });

    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getUserWithComplaints(404);
    expect(result).toBeNull();
  });
});


//test all complaints with details

describe("getAllComplaintsWithDetails", () => {
  it("should return all complaints with user and doctor info", async () => {
    const mockComplaints = [
      {
        complaint_id: 1,
        user: { user_id: 1, firstname: "John" },
        appointment: {
          appointment_id: 2,
          doctor: { doctor_id: 3, name: "Dr. Henry" }
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

  it("should return empty array if no complaints", async () => {
    (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

    const result = await getAllComplaintsWithDetails();
    expect(result).toEqual([]);
  });
});


//test getUserWithPayments
describe("getUserWithPayments", () => {
  it("should return user with appointments and their payments", async () => {
    const mockUser = {
      user_id: 1,
      appointments: [
        {
          appointment_id: 10,
          payments: [
            { payment_id: 1, amount: "2000" }
          ]
        }
      ]
    };

    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

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

    expect(result).toEqual(mockUser);
  });

  it("should return null if user not found", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getUserWithPayments(999);
    expect(result).toBeNull();
  });
});



})
