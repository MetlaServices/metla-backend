import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/adminModel';
import { sendToken } from '../utils/sendToken';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { CustomRequest } from '../middlewares/auth'; // Ensure CustomRequest is correctly imported
import JobModel from '../models/jobModel'; // Import default export
import Contact from '../models/query'; // Import default export
import Application from '../models/applications';
import ErrorHandler from '../utils/ErrorHandler';
import { UploadedFile } from "express-fileupload";
import { initimagekit } from '../utils/imagekit';
import Blog from '../models/Blog';
const imageKit=initimagekit()
const isFileArray = (files: any): files is UploadedFile[] => Array.isArray(files);

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

      if (!admin || admin.getRefreshToken !== refreshToken) {
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
  
  ,
  fetchAllQueries: catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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


  viewApplications:catchAsyncErrors(async(req:CustomRequest,res:Response,next:NextFunction):Promise<void>=>{
      try {
          // Fetch all applications from the database
          const applications = await Application.find()
              .populate({
                  path: 'jobId',
                  select: 'title' // Include only the title field from the Job model
              })
              .populate({
                  path: 'applicantId',
                  select: 'name email phone' // Include fields from the User model
              })
              .exec();
  
          // Send the applications data as a response
          res.status(200).json({
              success: true,
              data: applications
          });
      } catch (error) {
          // Handle errors
          next(new ErrorHandler('Failed to fetch applications', 500));
      }
  }),

  logOut:catchAsyncErrors(async(req:CustomRequest,res:Response,next:NextFunction):Promise<void>=>{
    try {
      // Clear the access and refresh tokens by setting their values to an empty string and setting expiration dates to the past
      res.clearCookie('accessToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'none',
      });

      res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'none',
      });

      res.status(200).json({
          success: true,
          message: 'Logged out successfully',
      });
      
  } catch (error) {
      next(error);
  }
  })
,
  postBlog : catchAsyncErrors(async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const adminId = req.id; // Extract admin ID from request
      if (!adminId) {
           res.status(401).json({ success: false, message: 'No admin ID found' });
           return
      }

      // Fetch the admin details to check user type
      const admin = await Admin.findById(adminId).select('userType');
      if (!admin || admin.userType !== 'admin') {
           res.status(403).json({ success: false, message: 'Forbidden: Only admins can post blogs' });
           return
      }

      const { title, content } = req.body; // Extract title and content from request body

      // Validate required fields
      if (!title || !content) {
           res.status(400).json({ success: false, message: 'Title and content are required' });
           return 
      }

      let image: { url: string; fileId: string } | undefined;

      // Check if an image is available in req.files and upload it to ImageKit
      if (req.files && req.files.image) {
          let uploadedImage;

          // Use the type guard to determine if req.files.image is an array
          if (Array.isArray(req.files.image)) {
              uploadedImage = req.files.image[0]; // Access the first file if it's an array
          } else {
              uploadedImage = req.files.image; // If it's a single file
          }

          const fileBuffer = uploadedImage.data.toString('base64'); // Convert buffer to base64

          const uploadResponse = await imageKit.upload({
              file: fileBuffer, // base64-encoded image
              fileName: uploadedImage.name, // Use the provided image file name
              folder: '/blogs', // Specify folder in ImageKit
          });

          // Set the image object with URL and fileId from the response
          image = {
              url: uploadResponse.url,
              fileId: uploadResponse.fileId,
          };
      }

      // Create a new blog post
      const newBlog = new Blog({
          title,
          content,
          image,
          createdBy: adminId, // Store the admin ID as the creator of the blog post
      });

      await newBlog.save(); // Save the new blog post to the database

      res.status(201).json({
          success: true,
          message: 'Blog post created successfully',
          blog: newBlog,
      });
  } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
  }),

};

export default adminController;
