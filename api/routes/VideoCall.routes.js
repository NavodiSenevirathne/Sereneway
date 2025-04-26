// VideoCall.routes.js
import express from 'express';
// import videoCallController from '../controllers/VideoCall.controller.js';
import * as videoCallController from '../controllers/VideoCall.controller.js';

const router = express.Router();

/**
 * @route   POST /api/videocalls
 * @desc    Create a new video call request
 * @access  Public
 */
router.post('/', videoCallController.createVideoCallRequest);

/**
 * @route   GET /api/videocalls
 * @desc    Get all video call requests
 * @access  Private (Should be protected in production)
 */
router.get('/', videoCallController.getAllVideoCallRequests);

/**
 * @route   GET /api/videocalls/:id
 * @desc    Get video call request by ID
 * @access  Private (Should be protected in production)
 */
router.get('/:id', videoCallController.getVideoCallRequest);

/**
 * @route   PUT /api/videocalls/:id
 * @desc    Update video call request
 * @access  Private (Should be protected in production)
 */
router.put('/:id', videoCallController.updateVideoCallRequest);

/**
 * @route   DELETE /api/videocalls/:id
 * @desc    Delete video call request
 * @access  Private (Should be protected in production)
 */
router.delete('/:id', videoCallController.deleteVideoCallRequest);

export default router;