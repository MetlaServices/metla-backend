import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the Job interface
interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  level: string;
  salary: number; // Salary in rupees
  companySize: string;
  industry: string;
  experience: string;
  postedDate: Date;
  createdBy: Types.ObjectId; // To reference the admin who created the job
}

// Define the Job schema
const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Entry', 'Mid', 'Senior'], // Example levels; adjust as needed
    },
    salary: {
      type: Number,
      required: true,
      min: [0, 'Salary must be a positive number'], // Assuming salary in rupees
    },
    companySize: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin', // Assuming you have an Admin model
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create and export the Job model
const Job = mongoose.model<IJob>('Job', jobSchema);

export { Job, IJob };
