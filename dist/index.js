"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const indexRouter_1 = __importDefault(require("./src/routes/indexRouter"));
const adminRouter_1 = __importDefault(require("./src/routes/adminRouter"));
const config_1 = __importDefault(require("./src/models/config"));
// Other code...
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
dotenv_1.default.config();
// Load configuration
(0, config_1.default)(); // Connect to MongoDB
// Middleware
app.use((0, cors_1.default)({
    credentials: true,
    origin: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    resave: true,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SECRET || 'default_secret',
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Add this if serving over HTTPS
        sameSite: 'none' // Set the SameSite attribute to None
    }
}));
app.use((0, morgan_1.default)('tiny'));
// Routes
app.get('/', (req, res) => {
    res.send('Hello');
});
app.use('/user', indexRouter_1.default);
app.use('/admin', adminRouter_1.default);
// 404 Handler
app.all("*", (req, res) => {
    res.status(404).send('404 - Not Found');
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map