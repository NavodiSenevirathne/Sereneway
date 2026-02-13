import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// ℹ️ import routes
import customizeTourRoutes from "./routes/TourRequest.route.js";
import videocallRouter from "./routes/VideoCall.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import tourRouter from "./routes/tours.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:5174", "http://localhost:5173", "*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to SERENEWAY Application Backend");
});

// ℹ️ added routes
app.use("/api/users", userRouter);
app.use("/api/videocalls", videocallRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/customize-tours", customizeTourRoutes);
app.use("/api/tours", tourRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const CONNECTION_URL = process.env.MONGO || `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sereneway.i9pf4.mongodb.net/?retryWrites=true&w=majority&appName=SereneWay`;

const PORT = process.env.PORT || 5001;

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server Running on port : ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
