"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Define the route for handling contact form submissions
router.post('/signup', (adminController_1.default.registerAdmin));
router.post('/login', (adminController_1.default.loginAdmin));
router.post('/currentAdmin', auth_1.isAuthenticated, (adminController_1.default.currentAdmin));
router.post('/refresh-token', adminController_1.default.refreshToken);
router.post('/add-job', auth_1.isAuthenticated, adminController_1.default.addJobs);
router.get('/fetchJobs', auth_1.isAuthenticated, adminController_1.default.fetchJobs);
exports.default = router;
//# sourceMappingURL=adminRouter.js.map