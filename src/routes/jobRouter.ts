import express from 'express';
import jobController from '../controllers/jobController';
import { isAuthenticated } from '../middlewares/auth';
const router = express.Router();

router.get('/fetchJobs',jobController.fetchJobs)

router.get('/fetchJob/:jobId',jobController.fetchJobById)

router.put('/updateJob/:adminId/:jobId',isAuthenticated,jobController.updateJobById)

router
export default router;
