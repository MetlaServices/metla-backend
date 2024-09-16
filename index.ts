import dotenv from 'dotenv';
dotenv.config();  // Load environment variables
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import indexRouter from './src/routes/indexRouter';
import adminRouter from './src/routes/adminRouter';
import jobRouter from './src/routes/jobRouter'
import connectDB from './src/models/config';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
// Other code...
console.log(process.env.JWT_SECRET)

const PORT = process.env.PORT || 3001;
const app = express();
// Load configuration
connectDB(); // Connect to MongoDB

// Middleware
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(bodyParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: process.env.EXPRESS_SECRET || 'default_secret',
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Add this if serving over HTTPS
    sameSite: 'none' // Set the SameSite attribute to None
  }
}));

app.use(logger('tiny'));
app.use(fileUpload())

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.use('/user', indexRouter);
app.use('/admin',adminRouter)
app.use('/job',jobRouter)

// 404 Handler
app.all("*", (req: Request, res: Response) => {
  res.status(404).send('404 - Not Found');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
