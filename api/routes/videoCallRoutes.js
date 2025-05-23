import express from 'express';
import {
  submitRequest,
  getAllRequests,
  getMyRequests,
  approveRequest,
  declineRequest
} from '../controllers/videoCallController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/request', protect, submitRequest);
router.get('/my-requests', protect, getMyRequests);

// Admin routes
router.get('/requests', protect, admin, getAllRequests);
router.post('/:id/approve', protect, admin, approveRequest);
router.post('/:id/decline', protect, admin, declineRequest);

export default router; 