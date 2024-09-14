import express from 'express';
import contactController from '../controllers/adminController'; // Adjust the path as needed
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import adminController from '../controllers/adminController';
import { isAuthenticated } from '../middlewares/auth';
const router = express.Router();

// Define the route for handling contact form submissions
router.post('/signup', (adminController.registerAdmin));

router.post('/login',(adminController.loginAdmin))

router.post('/currentAdmin',isAuthenticated,(adminController.currentAdmin))

export default router;
