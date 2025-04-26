// models/TourRequest.js
const mongoose = require('mongoose');

const tourRequestSchema = new mongoose.Schema({
  groupSize: {
    type: Number,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  preferredHotels: {
    type: [String], // Array of hotel names
    required: true
  },
  mealPreference: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Any'],
    default: 'Any'
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const TourRequest = mongoose.model('TourRequest', tourRequestSchema);
module.exports = TourRequest;
