import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the User Interface
interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  resumeLink: {
    fieldId: string;
    url: string;
  };
  getAccessToken(): string;
  getRefreshToken(): string;
  comparePassword(password: string): boolean;
  otp: number;
  otpExpires: Number;
  userType:String;
}

// Define the User Schema
const userSchema = new Schema<IUser>({
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
  resumeLink: {
    type: Object,
    default: {
      fieldId: '',
      url: '',
    },
  },
  otp: {
    type: Number,
    default: null,
  },
  otpExpires: {
    type: Number,
  },
  userType:{
    type:String,
    default:"User"
  }
}, { timestamps: true });

// Password hashing middleware

// Compare password method
userSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

// Generate JWT access token method
userSchema.methods.getAccessToken = function (): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short-lived access token
  });
};

// Generate JWT refresh token method
userSchema.methods.getRefreshToken = function (): string {
  if (!process.env.REFRESH_SECRET) {
    throw new Error('REFRESH_SECRET is not defined');
  }
  return jwt.sign({ id: this._id.toString() }, process.env.REFRESH_SECRET, {
    expiresIn: '7d', // Longer-lived refresh token
  });
};

// Define and export the User model
const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
