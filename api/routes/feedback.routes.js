import express from 'express';
import { 
  createfeedback, 
  getAllFeedbacks, 
  getFeedbackById, 
  updateFeedback, 
  deleteFeedback, 
  replyToFeedback,
  getFeedbackStats,
  getAdminFeedbacks,
  adminDeleteFeedback,
  adminReplyToFeedback
} from '../controllers/feedback.controller.js';

const router = express.Router();

// Create a new feedback
router.post('/create', createfeedback);

// Get all feedbacks
router.get('/', getAllFeedbacks);

// Get feedback statistics
router.get('/stats/summary', getFeedbackStats);

// Admin routes - these must come before parameterized routes
// Get all feedbacks with admin info
router.get('/admin', getAdminFeedbacks);

// Admin delete feedback
router.delete('/admin/:id', adminDeleteFeedback);

// Admin reply to feedback
router.post('/admin/:id/reply', adminReplyToFeedback);

// Parameterized routes
// Get feedback by ID
router.get('/:id', getFeedbackById);

// Update feedback
router.put('/:id', updateFeedback);

// Delete feedback
router.delete('/:id', deleteFeedback);

// Reply to feedback (admin only)
router.post('/:id/reply', replyToFeedback);

export default router;