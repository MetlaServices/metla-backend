"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
// Send Token Function
const sendToken = (user, statusCode, res) => {
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
exports.sendToken = sendToken;
//# sourceMappingURL=sendToken.js.map