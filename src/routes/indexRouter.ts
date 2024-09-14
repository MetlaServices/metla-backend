import express from 'express';
import contactController from '../controllers/indexController'; // Adjust the path as needed
import { catchAsyncErrors } from '../middlewares/catchAsynError';
const router = express.Router();

// Define the route for handling contact form submissions
router.post('/sendContactData', catchAsyncErrors(contactController.handleContactForm));

export default router;
