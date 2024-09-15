import { Request, Response, NextFunction } from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsynError';
import { CustomRequest } from '../middlewares/auth'; // Ensure CustomRequest is correctly imported
import JobModel from '../models/jobModel'; // Import default export
import { Admin } from '../models/adminModel';
const jobController = {

fetchJobs:catchAsyncErrors(async(req:CustomRequest,res:Response,next:NextFunction):Promise<any>=>{
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
  }),

fetchJobById : catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { jobId } = req.params;
    try {
        const jobById = await JobModel.findById(jobId); // Use findById for single document retrieval
        if (!jobById) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        res.status(200).json({ success: true, job: jobById });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}),

  updateJobById:catchAsyncErrors(async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const { adminId, jobId } = req.params;
        const updateData = req.body; // The data to update the job with

        // Check if the admin exists and is an admin
        const admin = await Admin.findById(adminId);
        if (!admin || admin.userType !== 'Admin') {
            res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            return; // Ensure to return after sending a response
        }

        // Check if the job exists
        const job = await JobModel.findById(jobId);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return; // Ensure to return after sending a response
        }

        // Update the job
        const updatedJob = await JobModel.findByIdAndUpdate(jobId, updateData, { new: true });

        res.status(200).json({
            success: true,
            job: updatedJob,
        });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  })
};

export default jobController;
