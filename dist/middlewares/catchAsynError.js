"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncErrors = void 0;
// Higher-order function to wrap async route handlers
const catchAsyncErrors = (func) => (req, res, next) => Promise.resolve(func(req, res, next)).catch(next);
exports.catchAsyncErrors = catchAsyncErrors;
//# sourceMappingURL=catchAsynError.js.map