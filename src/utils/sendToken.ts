import { Document, Types } from 'mongoose';
import { Response } from 'express';

// Define the User Interface
interface User extends Document {
    _id: Types.ObjectId; // Use ObjectId type for _id
    getjwttoken: () => string;
}

// Send Token Function
export const sendToken = (user: User, statusCode: number, res: Response): void => {
    const token = user.getjwttoken();
    const expiresInMilliseconds = Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000;

    res.status(statusCode).json({
        success: true,
        id: user._id.toString(), // Ensure _id is a string in the response
        token,
        expiresIn: expiresInMilliseconds
    });
};
