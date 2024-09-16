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
exports.sendOTP = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email configuration
const host = 'smtp.gmail.com'; // SMTP server address
const port = 465; // SMTP server port for SSL
const secure = true; // Use SSL (secure) connection
const authUser = 'servicesmetla@gmail.com'; // Domain-specific email address
const authPass = 'mniy wpdd avfy yrxc'; // Email account's password
console.log(authUser);
// Configure the email transport
const transporter = nodemailer_1.default.createTransport({
    host,
    port,
    secure, // SSL enabled
    auth: {
        user: authUser,
        pass: authPass,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000, // Connection timeout in milliseconds (10 seconds)
    socketTimeout: 10000, // Socket timeout in milliseconds (10 seconds)
});
// Debugging information for transporter setup
console.log('Transporter Configured with:');
console.log('  Host:', host);
console.log('  Port:', port);
console.log('  Secure:', secure);
console.log('  Auth User:', authUser);
// Function to send a single email
const sendMail = (htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('HTML Email Content:', htmlContent);
        const mailOptions = {
            from: 'info@metlaservices.com', // Static sender address
            to: 'info@metlaservices.com', // Recipient email address
            subject: 'Contact Form Submission', // Static subject line
            html: htmlContent, // HTML content
        };
        console.log('Mail Options:', mailOptions);
        // Attempt to send email
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
    }
    catch (error) {
        console.error('Error sending email:', error);
        // Attempt to send multiple contents in a single email as a fallback
        // await sendMultipleContentsInSingleMail([{ htmlContent }]);
    }
});
exports.sendMail = sendMail;
const sendOTP = (htmlContent, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: 'servicesmetla@gmail.com',
            to: email,
            subject: 'OTP Code',
            html: htmlContent,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
    }
    catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
});
exports.sendOTP = sendOTP;
//# sourceMappingURL=sendMail.js.map