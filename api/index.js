import express from 'express';  // Use import instead of require
import mongoose from 'mongoose';  
import dotenv from 'dotenv';  // Import dotenv 
dotenv.config();  // Initialize dotenv
import videocallRouter from './routes/VideoCall.routes.js';  // Import the router
import feedbackRouter from './routes/feedback.routes.js';  // Import the router
import cookieParser from 'cookie-parser';
import tourGuideRouter from './routes/tourGuideRoutes.js';  // Import the tour guide routes
import driverRouter from './routes/driverRoutes.js';  // Import the driver routes
import userRouter from './routes/user.routes.js';  // Import the user routes
import cors from 'cors'; // Import CORS

const paymentRoutes = require('./routes/paymentRoutes');

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
});


const app = express();

const corsOptions = {
  origin: 'http://localhost:5174', // Replace with the front-end URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};

app.use(cors(corsOptions)); // Enable CORS with the defined options

app.use(express.json());
app.use(cookieParser());

/*const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`);
});*/

app.listen(5001,()=>{
    console.log('Server is running on port 5001');
});


app.use("/api/videocalls", videocallRouter); 
app.use("/api/feedback", feedbackRouter);
app.use("/api/tourguides", tourGuideRouter);  // Add the tour guide routes
app.use("/api/drivers", driverRouter);  // Add the driver routes
app.use("/api/users", userRouter);  // Add the user routes

app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ 
        success: false,
        statusCode,
        message,
    });
    });