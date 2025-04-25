import express from 'express';  // Use import instead of require
import mongoose from 'mongoose';  
import dotenv from 'dotenv';  // Import dotenv 
dotenv.config();  // Initialize dotenv
import videocallRouter from './routes/VideoCall.routes.js';  // Import the router
import feedbackRouter from './routes/feedback.routes.js';  // Import the router
import cookieParser from 'cookie-parser';
import tourRoute from './routes/tours.js';
//here should be import userRoute from "./routes/users.js";
//import authRoute from "./routes/auth.js"
 import bookingRoutes from './routes/booking.js';
 import cartRoutes from './routes/cart.js';
 import reportRoutes from './routes/reportRoutes.js';


mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
});


const app = express();
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
app.use("/api/tours", tourRoute);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ 
        success: false,
        statusCode,
        message,
    });
    });