import nodemailer from 'nodemailer';

// Email configuration
const host = 'mail.metlaservices.com'; // SMTP server address
const port = 465; // SMTP port for SSL
const secure = true; // Use SSL (secure connection)
const authUser = 'info@metlaservices.com'; // Email account's address
const authPass = process.env.MAIL_PASSWORD; // Email account's password from environment variable

// Configure the email transport
const transporter = nodemailer.createTransport({
  host, // SMTP server
  port, // Port 465 for SSL
  secure, // Use SSL
  auth: {
    user: authUser, // Email username
    pass: authPass, // Email password
  },
  tls: { rejectUnauthorized: false }, // Allow self-signed certificates
  connectionTimeout: 10000, // Connection timeout (10 seconds)
  socketTimeout: 10000, // Socket timeout (10 seconds)
  requireTLS: true, // Enforce TLS
});

// Function to send a single email
export const sendMail = async (htmlContent: string): Promise<void> => {
  try {
    const mailOptions = {
      from: 'info@metlaservices.com', // Sender address
      to: 'info@metlaservices.com', // Recipient email
      subject: 'Contact Form Submission', // Email subject
      html: htmlContent, // HTML content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to send OTP to a user
export const sendOTP = async (htmlContent: string, email: string): Promise<void> => {
  try {
    const mailOptions = {
      from: 'info@metlaservices.com', // Sender address for OTP
      to: email, // Recipient email
      subject: 'Your OTP Code', // Email subject
      html: htmlContent, // HTML content for OTP
    };

    // Send OTP email
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Throw the error to be handled by the caller
  }
};
