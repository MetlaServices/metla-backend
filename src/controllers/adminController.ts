// src/controllers/contactController.ts

import { Request, Response } from 'express';
import User from '../models/userModel'; // Adjust the path as needed
import { sendMail } from '../utils/sendMail';

const contactController = {
  handleContactForm: async (req: Request, res: Response): Promise<void> => {
   
exports.registerAdmin = catchAsyncErrors(async (req, res, next) => {
    try {
        // console.log(req.body)
        // const authorizedSources = process.env.AUTHORIZED_EMAIL.split(',');
        const { email } = req.body;
        // if (!authorizedSources.includes(email)) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized registration' });
        // }
        console.log(req.body)
        const { password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
        }
        const newAdmin = new Admin({
            email,
            password,
        });

        await newAdmin.save();  
        sendToken(newAdmin, 201, res);
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


  // Add more controller functions here if needed
};

export default contactController;


