import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import routes
import feedbackRoutes from './routes/feedback.routes.js';
import videoCallRoutes from './routes/VideoCall.routes.js';
// Import other routes as needed

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const feedbackImagesDir = path.join(uploadsDir, 'feedback-images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(feedbackImagesDir)) {
  fs.mkdirSync(feedbackImagesDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving static files from:', path.join(__dirname, 'uploads'));

// Test route for static files
app.get('/test-static', (req, res) => {
  const uploadsPath = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(uploadsPath);
  const feedbackImagesPath = path.join(uploadsPath, 'feedback-images');
  const imageFiles = fs.existsSync(feedbackImagesPath) ? fs.readdirSync(feedbackImagesPath) : [];
  
  res.json({
    uploadsPath,
    files,
    feedbackImagesPath,
    imageFiles
  });
});

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/video-call', videoCallRoutes);
// Add other routes as needed

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sereneway')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 