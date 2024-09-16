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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enum for application status
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["REVIEWED"] = "reviewed";
    ApplicationStatus["INTERVIEW_SCHEDULED"] = "interview_scheduled";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
const applicationSchema = new mongoose_1.Schema({
    applicantId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Job', required: true },
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
const Application = mongoose_1.default.model('Application', applicationSchema);
exports.default = Application;
//# sourceMappingURL=applications.js.map