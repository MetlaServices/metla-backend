import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/ErrorHandler'; // Adjust the path to your ErrorHandler utility
import { catchAsyncErrors } from './catchAsynError'; // Adjust the path to your catchAsyncErrors middleware

// Define a custom type for the Request object to include the user ID
interface CustomRequest extends Request {
    id?: string; // Make id optional in case it's not set
}

// Middleware to check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        // Type assertion to ensure the environment variable is a string
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.id = decoded.id;
        // console.log("Authenticated user ID:", req.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
});
