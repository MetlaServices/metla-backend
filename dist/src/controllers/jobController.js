"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsynError_1 = require("../middlewares/catchAsynError");
const jobModel_1 = __importDefault(require("../models/jobModel")); // Import default export
const adminModel_1 = require("../models/adminModel");
const jobController = {
    fetchJobs: (0, catchAsynError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Fetch jobs from the database
            const jobs = yield jobModel_1.default.find();
            res.status(200).json({
                success: true,
                jobs,
            });
        }
        catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    })),
    fetchJobById: (0, catchAsynError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobId } = req.params;
        try {
            const jobById = yield jobModel_1.default.findById(jobId); // Use findById for single document retrieval
            if (!jobById) {
                res.status(404).json({ success: false, message: 'Job not found' });
                return;
            }
            res.status(200).json({ success: true, job: jobById });
        }
        catch (error) {
            console.error('Error fetching job:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    })),
    updateJobById: (0, catchAsynError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { adminId, jobId } = req.params;
            const updateData = req.body; // The data to update the job with
            // Check if the admin exists and is an admin
            const admin = yield adminModel_1.Admin.findById(adminId);
            if (!admin || admin.userType !== 'Admin') {
                res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
                return; // Ensure to return after sending a response
            }
            // Check if the job exists
            const job = yield jobModel_1.default.findById(jobId);
            if (!job) {
                res.status(404).json({ success: false, message: 'Job not found' });
                return; // Ensure to return after sending a response
            }
            // Update the job
            const updatedJob = yield jobModel_1.default.findByIdAndUpdate(jobId, updateData, { new: true });
            res.status(200).json({
                success: true,
                job: updatedJob,
            });
        }
        catch (error) {
            console.error('Error updating job:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }))
};
exports.default = jobController;
//# sourceMappingURL=jobController.js.map