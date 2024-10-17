import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the Contact interface
interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: Date;
}

// Define the Contact Schema
const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create and export the Contact model
const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
