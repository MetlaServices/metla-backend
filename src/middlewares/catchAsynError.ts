import { Request, Response, NextFunction } from 'express';

// Define a type for the async function that takes Request, Response, and NextFunction
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Higher-order function to wrap async route handlers
export const catchAsyncErrors = (func: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(func(req, res, next)).catch(next);
