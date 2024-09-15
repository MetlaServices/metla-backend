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
exports.Admin = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Define the User Schema
const userSchema = new mongoose_1.Schema({
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
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = bcryptjs_1.default.genSaltSync(10);
    this.password = bcryptjs_1.default.hashSync(this.password, salt);
    next();
});
// Compare password method
userSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
// Generate JWT token method
userSchema.methods.getjwttoken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id.toString() }, 'JWT_SECRET', {
        expiresIn: '1d'
    });
};
// Define and export the User model
const Admin = mongoose_1.default.model('Admin', userSchema);
exports.Admin = Admin;
//# sourceMappingURL=adminModel.js.map