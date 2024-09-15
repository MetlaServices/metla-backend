"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatedErrors = void 0;
// Middleware function to handle errors
const generatedErrors = (err, req, res, next) => {
    var _a;
    const statusCode = err.statusCode || 500;
    // Check for duplicate key error and customize the message
    if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key')) {
        err.message = `${(_a = err.keyValue) === null || _a === void 0 ? void 0 : _a.email} is already registered`;
    }
    // Send the error response
    res.status(statusCode).json({
        message: err.message,
        errorname: err.name,
        // stack: err.stack // Uncomment if you want to include the stack trace
    });
};
exports.generatedErrors = generatedErrors;
//# sourceMappingURL=error.js.map