import nodemailer from 'nodemailer';

// Email configuration
const host = 'mail.metlaservices.com'; // SMTP server address
const port = 465; // SMTP server port for SSL
const secure = true; // Use SSL (secure) connection
const authUser = 'info@metlaservices.com'; // Domain-specific email address
const authPass = 'Cayro@123'; // Email account's password

// Configure the email transport
const transporter = nodemailer.createTransport({
  host,
  port,
  secure:true,
  auth: {
    user: authUser,
    pass: authPass,
  },
  // Enable debugging
});

// Debugging information for transporter setup
console.log('Transporter Configured with:');
console.log('  Host:', host);
console.log('  Port:', port);
console.log('  Secure:', secure);
console.log('  Auth User:', authUser);
console.log('  Auth Password Loaded:', authPass ? 'Loaded' : 'Not Loaded'); // Avoid logging actual password

// Function to send email
export const sendMail = async (htmlContent: string): Promise<void> => {
  try {
    // Log to verify that the email content is being generated properly
    console.log('HTML Email Content:', htmlContent);

    const mailOptions = {
      from: authUser, // Static sender address
      to: 'info@metlaservices.com', // Recipient email address (or use environment variable)
      subject: 'Contact Form Submission', // Static subject line
      html: htmlContent, // HTML content with form details
    };

    // Log the mail options to verify the email is being constructed correctly
    console.log('Mail Options:', mailOptions);

    // Send the email using nodemailer
    const info = await transporter.sendMail(mailOptions);

    // Log the response info after sending the email to see if it was successful
    console.log('Email sent successfully:', info);

  } catch (error) {
    // Log any error during email sending
    console.error('Error sending email:', error);

    // Include a specific error message to be thrown
    throw new Error('Failed to send email');
  }
};
