import { Request, Response, NextFunction } from 'express';
import {Admin} from '../models/adminModel';
import { sendToken } from '../utils/sendToken';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
// Define the contactController object
const adminController = {

  // Admin registration function
  registerAdmin: catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const {username, email, password } = req.body;

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

  loginAdmin:catchAsyncErrors(async(req:Request,res:Response,nexr:NextFunction):Promise<any>=>{
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
        sendToken(admin, 200, res);

    } catch (error) {
        console.error('Error in loginAdmin controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }),

  currentAdmin:catchAsyncErrors(async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
   try {
        // Check if token is available in the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const userId = decoded.id;

        const admin = await Admin.findById(userId).exec();

        if (!admin) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }


        res.json({ success: true, admin });

    } catch (error) {
        console.error('Error fetching current admin:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
  })
};

export default adminController;
