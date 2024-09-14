// src/controllers/contactController.ts

import { Request, Response } from 'express';
import User from '../models/userModel'; // Adjust the path as needed
import { sendMail } from '../utils/sendMail';

const contactController = {
  handleContactForm: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, message } = req.body;
      console.log(req.body)
      // Save contact details to the database
      const newUser = new User({
        name,
        email,
        phone,
        message,
      });
      await newUser.save();

      // Email content
      const htmlContent = `
        <h1>Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;

      // Send the email
       await sendMail(htmlContent);

      // Send a success response
      res.status(201).json({ message: 'Contact details saved and sent successfully!' });
    } catch (error) {
      const statusCode = (error as any).statusCode || 500;
      const errorMessage = (error as any).message || 'An error occurred while handling contact details.';

      console.error(error);
      res.status(statusCode).json({ message: errorMessage });
    }
  },

  // Add more controller functions here if needed
};

export default contactController;


