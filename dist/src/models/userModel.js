"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Define the User Schema
const userSchema = new mongoose_1.Schema({
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
        type: Date,
    },
    userType: {
        type: String,
        default: "User"
    }
}, { timestamps: true });
// Password hashing middleware
// Compare password method
userSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
// Generate JWT access token method
userSchema.methods.getAccessToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Short-lived access token
    });
};
// Generate JWT refresh token method
userSchema.methods.getRefreshToken = function () {
    if (!process.env.REFRESH_SECRET) {
        throw new Error('REFRESH_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id: this._id.toString() }, process.env.REFRESH_SECRET, {
        expiresIn: '7d', // Longer-lived refresh token
    });
};
// Define and export the User model
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=userModel.js.map