import express from 'express';
import contactController from '../controllers/adminController'; // Adjust the path as needed
import { catchAsyncErrors } from '../middlewares/catchAsynError';
const router = express.Router();

// Define the route for handling contact form submissions
router.post('/signup', catchAsyncErrors(adminController.signUp));

export default router;
