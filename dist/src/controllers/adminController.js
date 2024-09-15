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
const adminModel_1 = require("../models/adminModel");
const sendToken_1 = require("../utils/sendToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsynError_1 = require("../middlewares/catchAsynError");
// Define the contactController object
const adminController = {
    // Admin registration function
    registerAdmin: (0, catchAsynError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, password } = req.body;
            // Check if the admin already exists
            const existingAdmin = yield adminModel_1.Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
            }
            // Create a new admin
            const newAdmin = new adminModel_1.Admin({
                username,
                email,
                password,
            });
            // Save the new admin to the database
            yield newAdmin.save();
            // Send token for authentication
            yield (0, sendToken_1.sendToken)(newAdmin, 201, res);
        }
        catch (error) {
            console.error('Error registering admin:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })),
    loginAdmin: (0, catchAsynError_1.catchAsyncErrors)((req, res, nexr) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Find the admin by email
            const admin = yield adminModel_1.Admin.findOne({ email }).exec();
            // If admin not found, return 404
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            // Check if the password matches
            const isPasswordMatch = yield bcryptjs_1.default.compare(password, admin.password);
            // If password does not match, return 401
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // If everything is correct, send token
            (0, sendToken_1.sendToken)(admin, 200, res);
        }
        catch (error) {
            console.error('Error in loginAdmin controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })),
    currentAdmin: (0, catchAsynError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if token is available in the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'User not authenticated' });
            }
            const token = authHeader.split(' ')[1];
            // Verify the token and extract user ID
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const admin = yield adminModel_1.Admin.findById(userId).exec();
            if (!admin) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.json({ success: true, admin });
        }
        catch (error) {
            console.error('Error fetching current admin:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }))
};
exports.default = adminController;
//# sourceMappingURL=adminController.js.map