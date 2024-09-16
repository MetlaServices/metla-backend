// src/controllers/contactController.ts

import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import { sendMail, sendOTP } from '../utils/sendMail';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { sendToken } from '../utils/sendToken';
import { CustomRequest } from '../middlewares/auth';
import bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import { initimagekit } from '../utils/imagekit';
import Application from '../models/applications';
const imageKit = initimagekit();

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



  // User login function
  // loginUser: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try {
  //     const { email, password } = req.body;

  //     // Find the User by email
  //     const user = await User.findOne({ email }).exec();

  //     // If User not found, return 404
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }

  //     // Check if the password matches
  //     const isPasswordMatch = await bcrypt.compare(password, user.password);

  //     // If password does not match, return 401
  //     if (!isPasswordMatch) {
  //       return res.status(401).json({ message: 'Invalid credentials' });
  //     }

  //     // If everything is correct, send token
  //     await sendToken(user, 200, res);

  //   } catch (error) {
  //     console.error('Error in loginUser controller:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // }),

  currentUser: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Use the id from the request object
      const UserId = req.id;
      if (!UserId) {
        return res.status(401).json({ success: false, message: 'No user ID found' });
      }

      const user = await User.findById(UserId).exec();

      if (!User) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, User });

    } catch (error) {
      console.error('Error fetching current User:', error);
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

      if (!user || user.getRefreshToken !== refreshToken) {
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


  // Add more controller functions here if needed
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
      await user.save();
  
      // Prepare the OTP email content
      const htmlContent = `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`;
  
      // Send OTP email
      await sendOTP(htmlContent, email);
  
      // Send response
      res.status(200).json({ success: true, message: 'OTP sent successfully.' });
    } catch (error) {
      next(error);
    }
  }),
  
  //Verify OTP controller
  verifyOtp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

  
      // res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } catch (error) {
      next(error);
    }
  },


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

      console.log(req.files)
      // Check if a resume file was uploaded
      if (!req.files || !req.files.resume) {
        return res.status(400).json({
          message: 'A resume file is required for the application.',
        });
      }
  
      // Extract the resume file from the request files
      const resumeFile = req.files.resume;
  
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
      // const uploadResponse = await imageKit.upload({
      //   file: resumeFile.buffer.toString('binary'), // Convert buffer to binary string
      //   fileName: resumeFile.name, // Use the 'name' property instead of 'originalname'
      //   fileType: 'application/pdf',
      // });
  
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
     
      });
  
      // Save the application to the database
      await application.save();
  
      // Return a success response
      res.status(201).json({
        message: "Application submitted successfully!",
      });
    } catch (error) {
      // Handle any errors that occur during the submission process
      console.log(error);
      next(error);
    }
  }),
  
  
};

export default contactController;


