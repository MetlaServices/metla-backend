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
exports.sendMultipleEmails = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email configuration
const host = 'mail.metlaservices.com'; // SMTP server address
const port = 465; // SMTP server port for SSL
const secure = true; // Use SSL (secure) connection
const authUser = 'info@metlaservices.com'; // Domain-specific email address
const authPass = 'Cayro@123'; // Email account's password
console.log(authUser);
// Configure the email transport
const transporter = nodemailer_1.default.createTransport({
    host,
    port,
    secure: false,
    auth: {
        user: authUser,
        pass: authPass,
    },
    tls: { rejectUnauthorized: false },
    // Enable debugging
});
// Debugging information for transporter setup
console.log('Transporter Configured with:');
console.log('  Host:', host);
console.log('  Port:', port);
console.log('  Secure:', secure);
console.log('  Auth User:', authUser);
// Function to send a single email
const sendMail = (htmlContent, to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log to verify that the email content is being generated properly
        console.log('HTML Email Content:', htmlContent);
        const mailOptions = {
            from: 'info@metlaservices.com', // Static sender address
            to: 'info@metlaservices.com', // Recipient email address (passed as an argument)
            subject: 'Contact Form Submission', // Static subject line
            html: htmlContent, // HTML content with form details
        };
        // Log the mail options to verify the email is being constructed correctly
        console.log('Mail Options:', mailOptions);
        // Send the email using nodemailer
        const info = yield transporter.sendMail(mailOptions);
        // Log the response info after sending the email to see if it was successful
        console.log('Email sent successfully:', info);
    }
    catch (error) {
        // Log any error during email sending
        console.error('Error sending email:', error);
        // Include a specific error message to be thrown
        throw new Error('Failed to send email');
    }
});
exports.sendMail = sendMail;
// Function to send multiple emails concurrently
const sendMultipleEmails = (emailContents) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use Promise.all to send all emails concurrently
        const emailPromises = emailContents.map((email) => (0, exports.sendMail)(email.htmlContent, email.to));
        // Wait for all emails to be sent
        yield Promise.all(emailPromises);
        // Log a message once all emails are sent successfully
        console.log('All emails sent successfully.');
    }
    catch (error) {
        console.error('Error sending multiple emails:', error);
        throw new Error('Failed to send one or more emails');
    }
});
exports.sendMultipleEmails = sendMultipleEmails;
//# sourceMappingURL=sendMail.js.map