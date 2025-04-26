// TourGuide.models.js
import mongoose from 'mongoose';

// Define schema for Tour Guide
const TourGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  assignedTours: [{
    type: String
  }], // Array of tour IDs or names
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
});

// Create and export the TourGuide model
const TourGuide = mongoose.model('TourGuide', TourGuideSchema);

export default TourGuide;
