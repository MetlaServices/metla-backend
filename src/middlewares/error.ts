import { Request, Response, NextFunction } from 'express';

// Define the error type with a statusCode property
interface CustomError extends Error {
  statusCode?: number;
  keyValue?: any;
}

// Middleware function to handle errors
export const generatedErrors = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;

  // Check for duplicate key error and customize the message
  if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key')) {
    err.message = `${err.keyValue?.email} is already registered`;
  }

  // Send the error response
  res.status(statusCode).json({
    message: err.message,
    errorname: err.name,
    // stack: err.stack // Uncomment if you want to include the stack trace
  });
};
