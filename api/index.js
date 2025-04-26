import express from 'express';  // Use import instead of require
import mongoose from 'mongoose';  
import dotenv from 'dotenv';  // Import dotenv 
dotenv.config();  // Initialize dotenv
import videocallRouter from './routes/VideoCall.routes.js';  // Import the router
import feedbackRouter from './routes/feedback.routes.js';  // Import the router
import userRouter from './routes/user.routes.js';  // Add user routes import
import cookieParser from 'cookie-parser';
import cors from 'cors';  // Import CORS


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:5173'], // Allow both Vite default ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['set-cookie']
};

// Apply middlewares in correct order
app.use(cors(corsOptions)); // CORS should be first
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRouter);  // Add user routes
app.use("/api/videocalls", videocallRouter);
app.use("/api/feedback", feedbackRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
