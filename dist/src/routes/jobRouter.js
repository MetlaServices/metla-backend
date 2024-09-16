"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = __importDefault(require("../controllers/jobController"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/fetchJobs', jobController_1.default.fetchJobs);
router.get('/fetchJob/:jobId', jobController_1.default.fetchJobById);
router.put('/updateJob/:adminId/:jobId', auth_1.isAuthenticated, jobController_1.default.updateJobById);
router;
exports.default = router;
//# sourceMappingURL=jobRouter.js.map