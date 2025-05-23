// VideoCall.models.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define schema for video call requests
const VideoCallSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  date: {
    type: Date,
    default: null
  },
  time: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  acceptedTerms: {
    type: Boolean,
    default: true
  },
  reply: {
    type: String,
    trim: true,
    default: ''
  },
  repliedAt: {
    type: Date,
    default: null
  },
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  flaggedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Create and export the VideoCall model
const VideoCall = mongoose.model('VideoCall', VideoCallSchema);

export default VideoCall;