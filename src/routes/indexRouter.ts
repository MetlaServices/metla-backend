import express from 'express';
import indexController from '../controllers/indexController'; // Adjust the path as needed
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { isAuthenticated } from '../middlewares/auth';
const router = express.Router();

// Define the route for handling contact form submissions

router.post('/currentUser',isAuthenticated,catchAsyncErrors(indexController.currentUser))

router.post('/clientQuery', catchAsyncErrors(indexController.handleQueryFormClient));

router.post('/popupForm',catchAsyncErrors(indexController.submitPopUpForm));

router.post('/employeeQuery', catchAsyncErrors(indexController.handleQueryFormEmployee));

router.post('/sendApplicantDetails',catchAsyncErrors(indexController.submitApplicantDetails))

router.post('/send-otp',catchAsyncErrors(indexController.sendEMAILOTP))

router.post('/verify-otp',catchAsyncErrors(indexController.verifyOtp))

router.put('/update-profile',isAuthenticated,catchAsyncErrors(indexController.updateProfile))

router.post('/logout',isAuthenticated,catchAsyncErrors(indexController.logOut))

export default router;
