import { Document, Types } from 'mongoose';
import { Response } from 'express';

// Define the User Interface
interface User extends Document {
    _id: Types.ObjectId; // Use ObjectId type for _id
    getAccessToken: () => string;
    getRefreshToken: () => string;
}
// Send Token Function
export const sendToken = (user: User, statusCode: number, res: Response): void => {
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    const accessTokenExpiresInMilliseconds = 15 * 60 * 1000; // 15 minutes for access token

    res.status(statusCode).json({
        success: true,
        id: user._id.toString(), // Ensure _id is a string in the response
        accessToken,
        refreshToken,
        accessTokenExpiresIn: accessTokenExpiresInMilliseconds // Include the expiration time for access token
    });
};
