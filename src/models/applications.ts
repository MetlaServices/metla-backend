import mongoose, { Schema, Document } from 'mongoose';

// Enum for application status
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface IApplication extends Document {
  applicantId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId; // Reference to Job
  jobTitle: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  status: ApplicationStatus; // Use enum type
  appliedDate: Date;
  resumeLink: {
    fieldId: string;
    url: string;
  };
}

const applicationSchema = new Schema<IApplication>({
  applicantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus), // Use the enum values
    required: true,
  },
  appliedDate: { type: Date, default: Date.now },
  resumeLink: {
    type: Object,
    required: true,
    fieldId: { type: String, required: true },
    url: { type: String, required: true },
  },
});

const Application = mongoose.model<IApplication>('Application', applicationSchema);
export default Application;