// models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  /*user: {
    type: String, // Will change to ObjectId with ref: 'User' when auth is implemented
    default: "guest"
  },*/
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
  roomCategory: { 
    type: String, 
    enum: ['normal', 'luxury'], 
    required: true 
  },
  roomType: { 
    type: String, 
    enum: ['single', 'double', 'family'], 
    required: true 
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
  emailSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('CartItem', cartItemSchema);
