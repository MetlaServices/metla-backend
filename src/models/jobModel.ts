import mongoose, { Schema, Document } from 'mongoose';

interface Job extends Document {
  title: string;
  company: string;
  location: string;
  description: string;
  level: 'junior' | 'mid' | 'senior'; // Ensure these values match what you're using
  salary: number;
  companySize: string;
  industry: string;
  experience: string;
  postedDate: Date;
  createdBy: mongoose.Types.ObjectId; // Ensure this field is defined
}

const jobSchema = new Schema<Job>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['junior', 'mid', 'senior'], // Define allowed values
    required: true 
  },
  salary: { type: Number, required: true },
  companySize: { type: String, required: true },
  industry: { type: String, required: true },
  experience: { type: String, required: true },
  postedDate: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true } // Add the field here
});

const JobModel = mongoose.model<Job>('Job', jobSchema);

export default JobModel;
