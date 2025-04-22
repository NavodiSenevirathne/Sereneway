import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  replies: [replySchema],
  /*imageUrls: {
    type: Array,
    required: true,
  },*/
}, {
  timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;