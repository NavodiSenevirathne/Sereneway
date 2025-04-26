// User.models.js
import mongoose from 'mongoose';

// Define schema for user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
