// controllers/tourGuideController.js

import TourGuide from "../models/TourGuide.js";

// Add a Tour Guide
export const addTourGuide = async (req, res) => {
  try {
    const { name, contactInfo, assignedTours, status } = req.body;

    const guide = new TourGuide({ name, contactInfo, assignedTours, status });
    await guide.save();

    res.status(201).json({ message: "Tour Guide added successfully", guide });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Tour Guides
export const getTourGuides = async (req, res) => {
  try {
    const guides = await TourGuide.find();
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a Single Tour Guide
export const getTourGuideById = async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Tour Guide not found" });

    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a Tour Guide
export const updateTourGuide = async (req, res) => {
  try {
    const { name, contactInfo, assignedTours, status } = req.body;
    const guide = await TourGuide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Tour Guide not found" });

    guide.name = name || guide.name;
    guide.contactInfo = contactInfo || guide.contactInfo;
    guide.assignedTours = assignedTours || guide.assignedTours;
    guide.status = status || guide.status;

    await guide.save();
    res.json({ message: "Tour Guide updated successfully", guide });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a Tour Guide
export const deleteTourGuide = async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Tour Guide not found" });

    await guide.deleteOne();
    res.json({ message: "Tour Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
