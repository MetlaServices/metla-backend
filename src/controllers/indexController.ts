// src/controllers/contactController.ts

import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import { sendMail, sendOTP } from '../utils/sendMail';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { sendToken } from '../utils/sendToken';
import { CustomRequest } from '../middlewares/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initimagekit } from '../utils/imagekit';
import Application from '../models/applications';
import { UploadedFile } from 'express-fileupload'; // Import the custom type for file upload
import Contact from '../models/query';

const imageKit = initimagekit();

const contactController = {
  handleContactForm: catchAsyncErrors(async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, message } = req.body;
      console.log(req.body);

      // Save contact details to the database
      const newQuery = new Contact({
        name,
        email,
        phone,
        message,
      });
      await newQuery.save();

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
  }),

  currentUser: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Use the id from the request object
      const userId = req.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No user ID found' });
      }

      const user = await User.findById(userId).exec();
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      console.log(user);
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }),

  refreshToken: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || user.getRefreshToken() !== refreshToken) {
        return res.status(403).json({ success: false, message: 'Invalid refresh token' });
      }

      // Generate a new access token
      const accessToken = user.getAccessToken(); // Ensure this method is defined in your User model
      res.json({ accessToken, accessTokenExpiresIn: 15 * 60 * 1000 }); // 15 minutes
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }),

  sendEMAILOTP: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      // Validate the email
      if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        res.status(400).json({ success: false, message: 'Invalid email address.' });
        return;
      }

      // Find the user by email
      let user = await User.findOne({ email });

      // If user is not found, create a new user
      if (!user) {
        user = new User({ email });
        await user.save();
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
      await user.save();

      // Prepare the OTP email content
      const htmlContent = `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`;

      // Send OTP email
      await sendOTP(htmlContent, email);

      // Send response
      res.status(200).json({ success: true, message: 'OTP sent successfully.', user });
    } catch (error) {
      next(error);
    }
  }),

  verifyOtp: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { otp, email } = req.body;

    // Validate input
    if (!otp || !email) {
      res.status(400).json({ success: false, message: 'OTP and email are required.' });
      return;
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      // Check if the OTP matches
      if (user.otp !== otp) {
        res.status(400).json({ success: false, message: 'Invalid OTP.' });
        return;
      }

      // OTP is valid, clear OTP field and mark user as verified if needed
      user.otp = -1;
      await user.save();

      sendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  }),

  submitApplicantDetails: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Extract form data from the request body
      const {
        applicantId,
        jobId,
        jobTitle,
        email,
        phoneNumber,
        coverLetter,
        status,
      } = req.body;

      console.log(req.files);

      // Check if a resume file was uploaded
      if (!req.files || !req.files.resume) {
        return res.status(400).json({
          message: 'A resume file is required for the application.',
        });
      }

      // Extract the resume file from the request files
      const resumeFile = req.files.resume as UploadedFile;

      // Check if the resume file is an array
      if (Array.isArray(resumeFile)) {
        return res.status(400).json({
          message: 'Only one resume file is allowed.',
        });
      }

      // Check if the resume file is a PDF
      if (resumeFile.mimetype !== 'application/pdf') {
        return res.status(400).json({
          message: 'Only PDF files are allowed for resumes.',
        });
      }

      // Upload the resume PDF file to ImageKit
      const uploadResponse = await imageKit.upload({
        file: resumeFile.data, // File data as a Buffer
        fileName: resumeFile.name, // Original file name
        folder: 'resumes', // Optional folder in ImageKit
      });

      // Create a new Application instance
      const application = new Application({
        applicantId,
        jobId,
        jobTitle,
        email,
        phoneNumber,
        coverLetter,
        status,
        appliedDate: new Date(),
        resumeLink: {
          fieldId: uploadResponse.fileId,
          url: uploadResponse.url,
        },
      });

      // Save the application to the database
      await application.save();

      // Return a success response
      res.status(201).json({
        message: 'Application submitted successfully!',

      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }),

  updateProfile: catchAsyncErrors(async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const { name, phone } = req.body;
      const userId = req.id; // Get the logged-in user ID from the request
  
      console.log('Request Body:', req.body);
      console.log('User ID:', userId);

      console.log(req.files)
      if (!userId) {
        res.status(401).json({ message: 'User ID not found' });
        return;
      }
  
      let resumeLink: { fieldId: string, url: string } | null = null;
  
      // Check if a file was uploaded
      if (req.files && req.files.resumeFile) {
        const file = req.files.resumeFile as UploadedFile;
  
        console.log('Uploaded File:', file);
  
        // Upload file to ImageKit
        try {
          const uploadResponse = await imageKit.upload({
            file: file.data, // File data
            fileName: file.name, // Original file name
            folder: 'resumes', // Optional folder in ImageKit
          });
  
          console.log('Upload Response:', uploadResponse);
  
          resumeLink = {
            fieldId: uploadResponse.fileId,
            url: uploadResponse.url,
          };
        } catch (uploadError) {
          console.error('Error uploading file to ImageKit:', uploadError);
          res.status(500).json({ message: 'Error uploading file', error: uploadError });
          return;
        }
      } else {
        console.log('No file uploaded');
      }
  
      // Update user profile
      try {
        await User.findByIdAndUpdate(userId, {
          name,
          phone,
          resumeLink: resumeLink || undefined, // Only update resumeLink if a file was uploaded
        });
  
        console.log('Profile updated successfully for user:', userId);
      } catch (updateError) {
        console.error('Error updating user profile:', updateError);
        res.status(500).json({ message: 'Error updating profile', error: updateError });
        return;
      }
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('General error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
  }),

 logOut :catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Clear the authorization token from the client's cookies
        res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        
      
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        // Pass the error to the global error handler
        next(error);
    }
}),
  
};

export default contactController;
