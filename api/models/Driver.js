// Driver.models.js
import mongoose from 'mongoose';

// Define schema for Driver
const DriverSchema = new mongoose.Schema({
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

// Create and export the Driver model
const Driver = mongoose.model('Driver', DriverSchema);

export default Driver;
