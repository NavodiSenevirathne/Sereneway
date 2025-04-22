// VideoCall.controller.js
import VideoCall from '../models/VideoCall.models.js';

// Controller methods for video call functionality
const videoCallController = {
  // Create a new video call request
  createVideoCall: async (req, res) => {
    try {
      const { name, email, country, date, time, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !country) {
        return res.status(400).json({ success: false, message: 'Name, email, and country are required fields' });
      }
      
      // Create new video call request
      const newVideoCall = new VideoCall({
        name,
        email,
        country,
        date,
        time,
        message
      });
      
      // Save to database
      const savedVideoCall = await newVideoCall.save();
      
      return res.status(201).json({
        success: true,
        message: 'Video call request submitted successfully',
        data: savedVideoCall
      });
    } catch (error) {
      console.error('Error creating video call request:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while creating video call request',
        error: error.message
      });
    }
  },
  
  // Get all video call requests
  getAllVideoCallRequests: async (req, res) => {
    try {
      const videoCallRequests = await VideoCall.find().sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: videoCallRequests.length,
        data: videoCallRequests
      });
    } catch (error) {
      console.error('Error fetching video call requests:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching video call requests',
        error: error.message
      });
    }
  },
  
  // Get video call by ID
  getVideoCallById: async (req, res) => {
    try {
      const videoCall = await VideoCall.findById(req.params.id);
      
      if (!videoCall) {
        return res.status(404).json({
          success: false,
          message: 'Video call request not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: videoCall
      });
    } catch (error) {
      console.error('Error fetching video call request:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching video call request',
        error: error.message
      });
    }
  },
  
  // Update video call request
  updateVideoCall: async (req, res) => {
    try {
      const videoCall = await VideoCall.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!videoCall) {
        return res.status(404).json({
          success: false,
          message: 'Video call request not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Video call request updated successfully',
        data: videoCall
      });
    } catch (error) {
      console.error('Error updating video call request:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating video call request',
        error: error.message
      });
    }
  },
  
  // Delete video call request
  deleteVideoCall: async (req, res) => {
    try {
      const videoCall = await VideoCall.findByIdAndDelete(req.params.id);
      
      if (!videoCall) {
        return res.status(404).json({
          success: false,
          message: 'Video call request not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Video call request deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting video call request:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while deleting video call request',
        error: error.message
      });
    }
  }
};

export default videoCallController;