import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

// Middleware to check if the user is logged in
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Updated middleware to check user role, now includes "doctor"
export const checkRoles = (
    requiredRole: "admin" | "patient" | "doctor" | "both"
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            (req as any).user = decoded;

            if (
                typeof decoded === "object" &&
                decoded !== null &&
                "role" in decoded
            ) {
                const role = (decoded as any).role;

                if (requiredRole === "both") {
                    if (["admin", "patient", "doctor"].includes(role)) {
                        next();
                        return;
                    }
                } else if (role === requiredRole) {
                    next();
                    return;
                }

                res.status(403).json({ message: "Forbidden - Invalid Role" });
                return;
            } else {
                res.status(401).json({ message: "Invalid Token" });
                return;
            }
        } catch (error) {
            res.status(401).json({ message: "Invalid Token" });
        }
    };
};

// Role-specific exports
export const adminRoleAuth = checkRoles("admin");
export const patientRoleAuth = checkRoles("patient");
export const doctorRoleAuth = checkRoles("doctor");
export const bothRoleAuth = checkRoles("both");
