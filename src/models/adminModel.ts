import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the Admin Interface
interface IAdmin extends Document {
    _id: Types.ObjectId;
    username: string;
    phone?: string;
    email: string;
    password: string;
    otp: number;
    resetPassword: string;
    userType:String;
    refreshToken: string;
    refreshTokenExpires: Date;
    comparePassword(password: string): boolean;
    getAccessToken(): string;
    getRefreshToken(): string;
}

// Define the Admin Schema
const adminSchema = new Schema<IAdmin>({
    username: {
        type: String,
        required: true
    },
    userType:{
        type:String,
        default:"Admin"
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
        required: true
    },
    password: {
        type: String,
        minlength: [4, 'Password should be at least 4 characters long'],
        required: true
    },
    resetPassword: {
        type: String,
        default: '0'
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpires: {
        type: Date,
    }
}, { timestamps: true });

// Password hashing middleware
adminSchema.pre<IAdmin>('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

// Compare password method
adminSchema.methods.comparePassword = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password);
};

// Generate JWT access token method
adminSchema.methods.getAccessToken = function (): string {
    return jwt.sign({ id: this._id.toString() }, 'JWT_SECRET', {
        expiresIn: '15m' // Short-lived access token
    });
};

// Generate JWT refresh token method
adminSchema.methods.getRefreshToken = function (): string {
    const refreshToken = jwt.sign({ id: this._id.toString() }, 'REFRESH_SECRET', {
        expiresIn: '7d' // Longer-lived refresh token
    });

    // Save the refresh token and its expiry to the admin document
    this.refreshToken = refreshToken;
    this.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    this.save();

    return refreshToken;
};

// Define and export the Admin model
const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export { Admin, IAdmin };
