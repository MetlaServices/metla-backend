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
const userModel_1 = __importDefault(require("../models/userModel")); // Adjust the path as needed
const contactController = {
    handleContactForm: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, phone, message } = req.body;
            // Create a new user document with the contact details
            const newUser = new userModel_1.default({
                name,
                email,
                phone,
                message,
            });
            // Save the user document to the database
            yield newUser.save();
            // Send a success response
            res.status(201).json({ message: 'Contact details saved successfully!' });
        }
        catch (error) {
            // Determine the status code and message based on error type
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || 'An error occurred while saving contact details.';
            console.error(error);
            res.status(statusCode).json({ message: errorMessage });
        }
    }),
    // Add more controller functions here if needed
};
exports.default = contactController;
//# sourceMappingURL=indexController.js.map