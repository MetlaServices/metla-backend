import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

// Mailtrap Configuration for Testing
const MAILTRAP_TOKEN = 'd3ef27db3e36e8b6016b7b4c120dc07e';
const MAILTRAP_INBOX_ID = 3145504;

const mailtrapTransport = nodemailer.createTransport(
  MailtrapTransport({
    token: MAILTRAP_TOKEN,
    testInboxId: MAILTRAP_INBOX_ID,
  })
);

// SMTP Configuration for Production
const SMTP_HOST = 'mail.cayroservices.com';
const SMTP_PORT = 465;
const SMTP_SECURE = true; // Use SSL
const SMTP_USER = 'info@cayroservices.com';
const SMTP_PASS = 'qG;O]%-*E?F_';

const smtpTransport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: { rejectUnauthorized: false }, // Allow self-signed certificates
  connectionTimeout: 10000,
  socketTimeout: 10000,
  requireTLS: true,
});

// Define types for responses
interface SMTPResponse {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

interface MailtrapResponse {
  // Adjust these properties based on Mailtrap's actual response
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
}

// Function to send a single email (for testing or production)
export const sendMail = async (htmlContent: string, isTest: boolean = false): Promise<void> => {
  try {
    const mailOptions = {
      from: SMTP_USER, // Sender address
      to: SMTP_USER, // Recipient email (same as sender for testing)
      subject: 'Contact Form Submission',
      html: htmlContent,
    };

    const transport = isTest ? mailtrapTransport : smtpTransport;

    const info = await transport.sendMail(mailOptions);

    // Check if response is of type SMTPResponse
    const smtpResponse = info as SMTPResponse;
    if (smtpResponse.messageId) {
      console.log('Email sent successfully:', smtpResponse);
      console.log('Message ID:', smtpResponse.messageId);
      console.log('Accepted recipients:', smtpResponse.accepted);
      console.log('Rejected recipients:', smtpResponse.rejected);
    } else {
      console.log('Mailtrap Response:', info);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to send OTP to a user (for testing or production)
export const sendOTP = async (htmlContent: string, email: string, isTest: boolean = false): Promise<void> => {
  try {
    const mailOptions = {
      from: SMTP_USER, // Sender address
      to: email, // Recipient email
      subject: 'Your OTP Code',
      html: htmlContent,
    };

    const transport = isTest ? mailtrapTransport : smtpTransport;

    const info = await transport.sendMail(mailOptions);

    // Check if response is of type SMTPResponse
    const smtpResponse = info as SMTPResponse;
      console.log('OTP email sent successfully:', smtpResponse);
      console.log('Message ID:', smtpResponse.messageId);
      console.log('Accepted recipients:', smtpResponse.accepted);
      console.log('Rejected recipients:', smtpResponse.rejected);
      console.log('Mailtrap Response:', info);
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Throw the error to be handled by the caller
  }
};
