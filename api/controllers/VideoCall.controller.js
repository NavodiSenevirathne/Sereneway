// VideoCall.controller.js
import VideoCall from '../models/VideoCall.models.js';

// Create a new video call request
export const createVideoCallRequest = async (req, res) => {
  try {
    const newRequest = new VideoCall(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all video call requests (admin only)
export const getAllVideoCallRequests = async (req, res) => {
  try {
    const { search, sort, status } = req.query;
    let query = {};

    // Apply search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Apply sorting
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'dateAsc':
          sortOption = { date: 1 };
          break;
        case 'dateDesc':
          sortOption = { date: -1 };
          break;
        case 'nameAsc':
          sortOption = { name: 1 };
          break;
        case 'nameDesc':
          sortOption = { name: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const requests = await VideoCall.find(query).sort(sortOption);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single video call request
export const getVideoCallRequest = async (req, res) => {
  try {
    const request = await VideoCall.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Video call request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a video call request
export const updateVideoCallRequest = async (req, res) => {
  try {
    const updatedRequest = await VideoCall.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Video call request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a video call request
export const deleteVideoCallRequest = async (req, res) => {
  try {
    const deletedRequest = await VideoCall.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Video call request not found' });
    }
    res.status(200).json({ message: 'Video call request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a reply to a video call request
export const addReply = async (req, res) => {
  try {
    const { text, adminName } = req.body;
    const request = await VideoCall.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Video call request not found' });
    }

    request.replies.push({ text, adminName });
    await request.save();
    
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Flag a request for review
export const flagForReview = async (req, res) => {
  try {
    const request = await VideoCall.findByIdAndUpdate(
      req.params.id,
      { flaggedForReview: true },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Video call request not found' });
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};