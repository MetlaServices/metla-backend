import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

// Define the User Interface
interface IUser extends Document {
    _id: Types.ObjectId; // Use ObjectId type for _id
    username: string;
    phone?: string;
    email: string;
    password: string;
    otp: number;
    resetPassword: string;
    comparePassword(password: string): boolean;
    getjwttoken(): string;
}

// Define the User Schema
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    otp: {
        type: Number,
        default: -1
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        minlength: [4, 'Password should be at least 4 characters long'],
    },
    resetPassword: {
        type: String,
        default: '0'
    }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre<IUser>('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
};

// Generate JWT token method
userSchema.methods.getjwttoken = function (): string {
    return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Define and export the User model
const Admin = mongoose.model<IUser>('User', userSchema);

export { Admin };