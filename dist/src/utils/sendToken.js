"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
// Send Token Function
const sendToken = (user, statusCode, res) => {
    const token = user.getjwttoken();
    const expiresInMilliseconds = Number(1) * 24 * 60 * 60 * 1000;
    res.status(statusCode).json({
        success: true,
        id: user._id.toString(), // Ensure _id is a string in the response
        token,
        expiresIn: expiresInMilliseconds
    });
};
exports.sendToken = sendToken;
//# sourceMappingURL=sendToken.js.map