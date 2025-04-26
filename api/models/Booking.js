// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  /*user: {
    type: String, // Will change to ObjectId with ref: 'User' when auth is implemented
    required: true
  },  */
  roomType: {
    category: { 
      type: String, 
      enum: ['normal', 'luxury'], 
      required: true 
    },
    subType: { 
      type: String, 
      enum: ['single', 'double', 'family'], 
      required: true 
    }
  },
  rooms: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  adults: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  children: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  nic: { 
    type: String, 
    required: true,
    match: /^[0-9]{12}$|^[0-9]{9}[vV]$/
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
