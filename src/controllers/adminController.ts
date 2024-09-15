import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/adminModel';
import { Job } from '../models/jobModel';
import { sendToken } from '../utils/sendToken';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { CustomRequest } from '../middlewares/auth'; // Ensure CustomRequest is correctly imported

// Define the contactController object
const adminController = {

  // Admin registration function
  registerAdmin: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { username, email, password } = req.body;

      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
      }

      // Create a new admin
      const newAdmin = new Admin({
        username,
        email,
        password,
      });

      // Save the new admin to the database
      await newAdmin.save();

      // Send token for authentication
      await sendToken(newAdmin, 201, res);

    } catch (error) {
      console.error('Error registering admin:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }),

  // Admin login function
  loginAdmin: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email, password } = req.body;

      // Find the admin by email
      const admin = await Admin.findOne({ email }).exec();

      // If admin not found, return 404
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Check if the password matches
      const isPasswordMatch = await bcrypt.compare(password, admin.password);

      // If password does not match, return 401
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If everything is correct, send token
      await sendToken(admin, 200, res);

    } catch (error) {
      console.error('Error in loginAdmin controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),

  // Get current admin details
  currentAdmin: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Use the id from the request object
      const adminId = req.id;
      if (!adminId) {
        return res.status(401).json({ success: false, message: 'No user ID found' });
      }

      const admin = await Admin.findById(adminId).exec();

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }

      res.json({ success: true, admin });

    } catch (error) {
      console.error('Error fetching current admin:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }),

  // Refresh access token
  refreshToken: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as { id: string };
      const admin = await Admin.findById(decoded.id);

      if (!admin || admin.refreshToken !== refreshToken) {
        return res.status(403).json({ success: false, message: 'Invalid refresh token' });
      }

      // Generate a new access token
      const accessToken = admin.getAccessToken(); // Ensure this method is defined in your Admin model
      res.json({ accessToken, accessTokenExpiresIn: 15 * 60 * 1000 }); // 15 minutes
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }),

  // Add a new job
  addJobs: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { title, company, location, description, level, salary, companySize, industry, experience, postedDate } = req.body;
      
      // Use the id from the request object
      const adminId = req.id;
      if (!adminId) {
        return res.status(401).json({ success: false, message: 'No user ID found' });
      }

      // Create a new job document
      const job = new Job({
        title,
        company,
        location,
        description,
        level,
        salary, // Assuming salary is already in rupees
        companySize,
        industry,
        experience,
        postedDate,
      });

      // Save the job to the database
      await job.save();

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Job added successfully!',
        job,
      });
    } catch (error) {
      console.error('Error adding job:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  })
};

export default adminController;
