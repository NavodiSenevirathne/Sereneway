// controllers/tourRequestController.js
const TourRequest = require('../models/TourRequest');
const mongoose = require('mongoose');

// Get all tour requests
const getAllTourRequests = async (req, res) => {
  try {
    const tourRequests = await TourRequest.find().sort({ createdAt: -1 });
    res.status(200).json(tourRequests);
  } catch (error) {
    console.error("Error fetching tour requests:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new tour request
const createTourRequest = async (req, res) => {
  const {
    groupSize,
    budget,
    startDate,
    endDate,
    preferredHotels,
    mealPreference,
    specialRequirements,
    contactEmail,
    contactNo,
    status
  } = req.body;

  if (!groupSize || !budget || !startDate || !endDate || !preferredHotels || !contactEmail || !contactNo) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const newTourRequest = new TourRequest({
      groupSize,
      budget,
      startDate,
      endDate,
      preferredHotels,
      mealPreference,
      specialRequirements,
      contactEmail,
      contactNo,
      status: status || "Pending"
    });

    await newTourRequest.save();
    res.status(201).json({
      message: "Tour request created successfully",
      tourRequest: newTourRequest
    });
  } catch (error) {
    console.error("Error creating tour request:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a tour request by ID
const updateTourRequest = async (req, res) => {
  const { tourRequestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourRequestId)) {
    return res.status(400).json({ message: "Invalid Tour Request ID" });
  }

  try {
    const updated = await TourRequest.findByIdAndUpdate(
      tourRequestId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    res.json({ message: "Tour request updated successfully", tourRequest: updated });
  } catch (error) {
    console.error("Error updating tour request:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a tour request by ID
const deleteTourRequest = async (req, res) => {
  const { tourRequestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tourRequestId)) {
    return res.status(400).json({ message: "Invalid Tour Request ID" });
  }

  try {
    const deleted = await TourRequest.findByIdAndDelete(tourRequestId);

    if (!deleted) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    res.json({ message: "Tour request deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour request:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllTourRequests,
  createTourRequest,
  updateTourRequest,
  deleteTourRequest
};
