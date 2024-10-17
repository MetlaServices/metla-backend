import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the User Interface
interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string; // Changed to 'string'
  getAccessToken(): string;
  getRefreshToken(): string;
  comparePassword(password: string): boolean;
  otp: number;
  otpExpires: number; // Changed to 'number'
  userType: string; // Changed to 'string'
}

// Define the User Schema
const adminSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
  },
  otp: {
    type: Number,
    default: null,
  },
  otpExpires: {
    type: Number,
  },
  userType: {
    type: String,
    default: 'Admin',
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Password hashing middleware (not provided, but should be here)

// Compare password method
adminSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password); // This is synchronous
};

// Generate JWT access token method
adminSchema.methods.getAccessToken = function (): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short-lived access token
  });
};

// Generate JWT refresh token method
adminSchema.methods.getRefreshToken = function (): string {
  if (!process.env.REFRESH_SECRET) {
    throw new Error('REFRESH_SECRET is not defined');
  }
  return jwt.sign({ id: this._id.toString() }, process.env.REFRESH_SECRET, {
    expiresIn: '7d', // Longer-lived refresh token
  });
};

// Define and export the User model
const Admin = mongoose.model<IUser>('Admin', adminSchema);

export { Admin, IUser };
