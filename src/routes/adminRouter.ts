import express from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import adminController from '../controllers/adminController';
import { isAuthenticated } from '../middlewares/auth';
const router = express.Router();

// Define the route for handling contact form submissions
router.post('/signup', (adminController.registerAdmin));

router.post('/login',(adminController.loginAdmin))

router.post('/currentAdmin',isAuthenticated,(adminController.currentAdmin))

router.post('/refresh-token' ,adminController.refreshToken)

router.post('/add-job',isAuthenticated,adminController.addJobs)

router.get('/fetchJobs',isAuthenticated,adminController.fetchJobs)
export default router;
