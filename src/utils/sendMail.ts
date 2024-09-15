import nodemailer from 'nodemailer';

// Email configuration
const host = 'mail.metlaservices.com'; // SMTP server address
const port = 465; // SMTP server port for SSL
const secure = true; // Use SSL (secure) connection
const authUser = 'info@metlaservices.com'; // Domain-specific email address
const authPass = 'Cayro@123'; // Email account's password

console.log(authUser);

// Configure the email transport
const transporter = nodemailer.createTransport({
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
export const sendMail = async (htmlContent: string): Promise<void> => {
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
  } catch (error) {
    console.error('Error sending email:', error);

    // Attempt to send multiple contents in a single email as a fallback
    // await sendMultipleContentsInSingleMail([{ htmlContent }]);
  }
};

// Function to send multiple contents in one email
// export const sendMultipleContentsInSingleMail = async (emailContents: { htmlContent: string }[]): Promise<void> => {
//   try {
//     const combinedHtmlContent = emailContents.map(email => email.htmlContent).join('<br><br>');

//     // Send a single email with the combined content
//     await sendMail(combinedHtmlContent);

//     console.log('Single email with combined contents sent successfully.');
//   } catch (error) {
//     console.error('Error sending combined email:', error);
//   }
// };
