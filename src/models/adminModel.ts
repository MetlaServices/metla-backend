import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the interface for the Admin model
interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Create the schema for the Admin model
const AdminSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware to hash password before saving
AdminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as mongoose.CallbackError); // Explicitly cast error to CallbackError
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Create the Admin model
const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
