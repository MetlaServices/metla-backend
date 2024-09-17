import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/adminModel';
import { sendToken } from '../utils/sendToken';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { CustomRequest } from '../middlewares/auth'; // Ensure CustomRequest is correctly imported
import JobModel from '../models/jobModel'; // Import default export
import Contact from '../models/query'; // Import default export

const adminController = {

  // Admin registration function
  registerAdmin: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, email, password } = req.body;

      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
         res.status(400).json({ success: false, message: 'Admin with this email already exists' });
         return
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new admin
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword, // Save hashed password
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
  loginAdmin: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find the admin by email
      const admin = await Admin.findOne({ email }).exec();

      // If admin not found, return 404
      if (!admin) {
         res.status(404).json({ message: 'Admin not found' });
         return
      }

      // Check if the password matches
      const isPasswordMatch =  bcrypt.compare(password, admin.password);

      // If password does not match, return 401
      if (!isPasswordMatch) {
         res.status(401).json({ message: 'Invalid credentials' });
         return
      }

      // If everything is correct, send token
      await sendToken(admin, 200, res);

    } catch (error) {
      console.error('Error in loginAdmin controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),

  // Get current admin details
  currentAdmin: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Use the id from the request object
      const adminId = req.id;
      if (!adminId) {
         res.status(401).json({ success: false, message: 'No user ID found' });
         return
      }

      const admin = await Admin.findById(adminId).exec();

      if (!admin) {
         res.status(404).json({ success: false, message: 'Admin not found' });
         return
      }

      res.json({ success: true, admin });

    } catch (error) {
      console.error('Error fetching current admin:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }),

  // Refresh access token
  refreshToken: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
       res.status(401).json({ success: false, message: 'No refresh token provided' });
       return
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as { id: string };
      const admin = await Admin.findById(decoded.id);

      if (!admin || admin.refreshToken !== refreshToken) {
         res.status(403).json({ success: false, message: 'Invalid refresh token' });
         return
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
  addJobs: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, company, location, description, level, salary, companySize, industry, experience, postedDate } = req.body;

      // Use the id from the request object
      const adminId = req.id;
      if (!adminId) {
         res.status(401).json({ success: false, message: 'No user ID found' });
         return
      }

      // Create a new job document
      const job = new JobModel({
        title,
        company,
        location,
        description,
        level,
        salary,
        companySize,
        industry,
        experience,
        postedDate,
        createdBy: adminId // Include createdBy
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
  }),

  // Fetch all jobs
  fetchJobs: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Fetch jobs from the database
      const jobs = await JobModel.find();
      res.status(200).json({
        success: true,
        jobs,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  })
  
  ,fetchAllQueries: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Fetch all contact form submissions from the database
      const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by creation date in descending order

      // Send the response with the contact form submissions
      res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts,
      });
    } catch (error) {
      // Handle any errors that occur
      console.error('Error fetching contact queries:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact queries',
        error,
      });
    }
  }),
};

export default adminController;
