"use strict";
// src/controllers/contactController.ts
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
const userModel_1 = __importDefault(require("../models/userModel")); // Adjust the path as needed
const sendMail_1 = require("../utils/sendMail");
const contactController = {
    handleContactForm: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, phone, message } = req.body;
            console.log(req.body);
            // Save contact details to the database
            const newUser = new userModel_1.default({
                name,
                email,
                phone,
                message,
            });
            yield newUser.save();
            // Email content
            const htmlContent = `
        <h1>Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;
            // Send the email
            yield (0, sendMail_1.sendMail)(htmlContent);
            // Send a success response
            res.status(201).json({ message: 'Contact details saved and sent successfully!' });
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || 'An error occurred while handling contact details.';
            console.error(error);
            res.status(statusCode).json({ message: errorMessage });
        }
    }),
    // Add more controller functions here if needed
};
exports.default = contactController;
//# sourceMappingURL=indexController.js.map