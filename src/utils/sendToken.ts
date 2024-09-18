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
    // Set cookies for accessToken and refreshToken
    res.cookie('accessToken', accessToken, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: accessTokenExpiresInMilliseconds, // Set expiration time for the access token
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'none',
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // Example: 7 days for the refresh token
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });

    res.status(statusCode).json({
        success: true,
        id: user._id.toString(), // Ensure _id is a string in the response
        accessToken,
        refreshToken,
        accessTokenExpiresIn: accessTokenExpiresInMilliseconds // Include the expiration time for access token
    });
};
