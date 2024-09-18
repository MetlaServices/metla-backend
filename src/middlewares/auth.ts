import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/ErrorHandler'; // Adjust the path to your ErrorHandler utility
import { catchAsyncErrors } from './catchAsynError'; // Adjust the path to your catchAsyncErrors middleware

// Define and export a custom type for the Request object to include the user ID
export interface CustomRequest extends Request {
    id?: string; // Make id optional in case it's not set
}

// Middleware to check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        // Ensure you have your secret in an environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.id = decoded.id;
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
});
