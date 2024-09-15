"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Ensure the name of the error is the same as the class name
        this.name = this.constructor.name;
        // Captures the stack trace, excluding the constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map