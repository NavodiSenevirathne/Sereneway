// VideoCall.routes.js
import express from 'express';
import {
  createVideoCallRequest,
  getAllVideoCallRequests,
  getVideoCallRequest,
  updateVideoCallRequest,
  deleteVideoCallRequest,
  addReply,
  flagForReview
} from '../controllers/VideoCall.controller.js';

const router = express.Router();

/**
 * @route   POST /api/videocalls
 * @desc    Create a new video call request
 * @access  Public
 */
router.post('/', createVideoCallRequest);

/**
 * @route   GET /api/videocalls
 * @desc    Get all video call requests
 * @access  Public
 */
router.get('/', getAllVideoCallRequests);

/**
 * @route   GET /api/videocalls/:id
 * @desc    Get video call request by ID
 * @access  Public
 */
router.get('/:id', getVideoCallRequest);

/**
 * @route   PUT /api/videocalls/:id
 * @desc    Update video call request
 * @access  Public
 */
router.put('/:id', updateVideoCallRequest);

/**
 * @route   DELETE /api/videocalls/:id
 * @desc    Delete video call request
 * @access  Public
 */
router.delete('/:id', deleteVideoCallRequest);

/**
 * @route   POST /api/videocalls/:id/reply
 * @desc    Add a reply to a video call request
 * @access  Public
 */
router.post('/:id/reply', addReply);

/**
 * @route   POST /api/videocalls/:id/flag
 * @desc    Flag a video call request for review
 * @access  Public
 */
router.post('/:id/flag', flagForReview);

export default router;