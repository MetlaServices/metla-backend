import nodemailer from 'nodemailer';

// Mailtrap Configuration for Testing
const mailtrapTransport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, // Your Mailtrap credentials
    pass: process.env.MAILTRAP_PASS,
  },
});

// SMTP Configuration for Production
const smtpTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.MAIL_ENCRYPTION === 'true', // Boolean, convert from string
  auth: {
    user: process.env.MAIL_TO_ADDRESS,
    pass: process.env.MAIL_PASS,
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

// Function to send a single email (for testing or production)
export const sendMail = async (
  htmlContent: string,
  userType: string,
  isTest: boolean = false
): Promise<void> => {
  try {
    console.log('Preparing to send email...');
    const mailOptions = {
      from: process.env.MAIL_TO_ADDRESS, // Sender address
      to: process.env.MAIL_TO_ADDRESS,   // Recipient email (same as sender for testing)
      subject: `Query Form Submission from ${userType}`, // Correctly interpolating userType
      html: htmlContent,
    };

    const transport = isTest ? mailtrapTransport : smtpTransport;
    
    console.log(`Using transport: ${isTest ? 'Mailtrap' : 'SMTP'}`);
    console.log('Mail options:', mailOptions);
    
    const info = await transport.sendMail(mailOptions);

    console.log('Email sent successfully:', info);
    console.log('Message ID:', info.messageId);
    console.log('Accepted recipients:', info.accepted);
    console.log('Rejected recipients:', info.rejected);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.'); // Throw an error to notify the caller of the failure
  }
};

// Function to send OTP to a user (for testing or production)
export const sendOTP = async (htmlContent: string, email: string, isTest: boolean = false): Promise<void> => {
  try {
    console.log('Preparing to send OTP...');
    const mailOptions = {
      from: process.env.MAIL_TO_ADDRESS, // Sender address
      to: email, // Recipient email
      subject: 'Your OTP Code',
      html: htmlContent,
    };

    const transport = isTest ? mailtrapTransport : smtpTransport;

    console.log(`Using transport for OTP: ${isTest ? 'Mailtrap' : 'SMTP'}`);
    console.log('Mail options for OTP:', mailOptions);
    
    const info = await transport.sendMail(mailOptions);

    console.log('OTP email sent successfully:', info);
    console.log('Message ID:', info.messageId);
    console.log('Accepted recipients:', info.accepted);
    console.log('Rejected recipients:', info.rejected);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Throw the error to be handled by the caller
  }
};
