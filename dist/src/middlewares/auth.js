"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler")); // Adjust the path to your ErrorHandler utility
const catchAsynError_1 = require("./catchAsynError"); // Adjust the path to your catchAsyncErrors middleware
// Middleware to check if user is authenticated
exports.isAuthenticated = (0, catchAsynError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ErrorHandler_1.default("Login first to access this resource", 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        // Type assertion to ensure the environment variable is a string
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;
        // console.log("Authenticated user ID:", req.id);
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Invalid token. Please log in again.", 401));
    }
}));
//# sourceMappingURL=auth.js.map