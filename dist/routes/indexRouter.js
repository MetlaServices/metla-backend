"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexController_1 = __importDefault(require("../controllers/indexController")); // Adjust the path as needed
const catchAsynError_1 = require("../middlewares/catchAsynError");
const router = express_1.default.Router();
// Define the route for handling contact form submissions
router.post('/contact', (0, catchAsynError_1.catchAsyncErrors)(indexController_1.default.handleContactForm));
exports.default = router;
//# sourceMappingURL=indexRouter.js.map