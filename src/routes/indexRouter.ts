import express from 'express';
import indexController from '../controllers/indexController'; // Adjust the path as needed
import { catchAsyncErrors } from '../middlewares/catchAsynError';
const router = express.Router();

// Define the route for handling contact form submissions
router.post('/sendContactData', catchAsyncErrors(indexController.handleContactForm));


router.post('/sendApplicantDetails',catchAsyncErrors(indexController.submitApplicantDetails))

router.post('/send-otp',catchAsyncErrors(indexController.sendEMAILOTP))

router.post('/verify-otp',catchAsyncErrors(indexController.verifyOtp))
export default router;
