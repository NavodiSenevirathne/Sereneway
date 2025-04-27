import { validationResult } from "express-validator";
import TourRequest from "../models/TourRequest.model.js";
import { sendEmail } from "../utils/customizeTourRequestEmailService.js";

// 📌 Create a new tour request
export const createTourRequest = async (req, res) => {
  try {
    // ✅ Step 1: Validate Inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name,
      email,
      contactNumber,
      tourStartLocation,
      tourStartDate,
      selectedLocations,
      numberOfPeople,
      tourDuration,
      tourType,
      basePricePerPerson,
      note,
      userId,
    } = req.body;

    // ✅ Step 2: Ensure required fields exist
    if (!selectedLocations || selectedLocations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one location must be selected.",
      });
    }

    // ✅ Step 3: Validate tour start date (must be in the future)
    const today = new Date();
    const startDate = new Date(tourStartDate);
    if (startDate < today) {
      return res.status(400).json({
        success: false,
        message: "Tour start date must be in the future.",
      });
    }

    // ✅ Step 4: Calculate Estimated Budget & Travel Time
    let totalDistance = 0;
    let totalTravelCost = 0;
    const costBreakdown = [];

    selectedLocations.forEach((location) => {
      const locationCost = location.distance * location.pricePerUnit;
      totalTravelCost += locationCost;
      totalDistance += location.distance;

      costBreakdown.push({
        locationName: location.locationName,
        distance: location.distance,
        cost: locationCost.toFixed(2),
      });
    });

    // Accommodation & food cost
    const accommodationCost =
      basePricePerPerson * numberOfPeople * tourDuration;

    // Final estimated budget (Travel + Accommodation)
    const estimatedBudget = (totalTravelCost + accommodationCost).toFixed(2);

    // ✅ Step 5: Estimate total travel time (assuming 60 km/h avg speed)
    const estimatedTimeHours = totalDistance / 60;

    // ✅ Step 6: Calculate estimated end date
    const estimatedEndDate = new Date(startDate);
    estimatedEndDate.setDate(estimatedEndDate.getDate() + tourDuration);

    // ✅ Step 7: Generate a summary
    const summary = `A ${tourDuration}-day ${tourType} tour starting from ${tourStartLocation} on ${startDate.toDateString()}, covering ${
      selectedLocations.length
    } locations, with an estimated budget of $${estimatedBudget} (including $${accommodationCost.toFixed(
      2
    )} for accommodation and food).`;

    // ✅ Step 8: Create and Save the Tour Request
    const tourRequest = new TourRequest({
      name,
      email,
      contactNumber,
      tourStartLocation,
      tourStartDate: startDate,
      estimatedEndDate,
      selectedLocations,
      numberOfPeople,
      tourDuration,
      tourType,
      basePricePerPerson,
      estimatedBudget,
      estimatedTimeHours,
      costBreakdown,
      summary,
      note,
      status: "Pending",
      userId,
    });

    await tourRequest.save();

    res.status(201).json({
      success: true,
      message: "Tour request created successfully!",
      data: tourRequest,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📌 View a tour request by ID
export const getTourRequest = async (req, res) => {
  try {
    const tourRequest = await TourRequest.findById(req.params.id);
    if (!tourRequest)
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    res.status(200).json({ success: true, data: tourRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Edit a tour request
export const editTourRequest = async (req, res) => {
  try {
    const updatedTour = await TourRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTour)
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    res.status(200).json({ success: true, data: updatedTour });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📌 Delete a tour request
export const deleteTourRequest = async (req, res) => {
  try {
    const deletedTour = await TourRequest.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour request permanently deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Approve a tour request
export const approveTourRequest = async (req, res) => {
  try {
    const { adminReason } = req.body;
    if (!adminReason) {
      return res
        .status(400)
        .json({ success: false, message: "Reason required for approval" });
    }

    const approvedTour = await TourRequest.findByIdAndUpdate(
      req.params.id,
      { status: "Approved", adminReason },
      { new: true }
    );

    if (!approvedTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Extract details safely
    const {
      name,
      email,
      estimatedBudget = "Not specified",
      selectedLocations = [],
      tourStartDate = "Not specified",
      estimatedEndDate = "Not specified",
      numberOfPeople = "Not specified",
    } = approvedTour;

    // Convert selected locations into a destination string
    const destinations = Array.isArray(selectedLocations)
      ? selectedLocations.map((loc) => loc.locationName).join(", ")
      : "Not specified";

    // Construct email HTML
    const emailContent = `
      <p>Dear ${name},</p>
      <p>We are pleased to inform you that your tour request has been <b>approved</b>!</p>
      
      <h3>Tour Details:</h3>
      <ul>
        <li><b>Destinations:</b> ${destinations}</li>
        <li><b>Budget:</b> $${estimatedBudget}</li>
        <li><b>Travel Dates:</b> ${tourStartDate} to ${estimatedEndDate}</li>
        <li><b>Number of Travelers:</b> ${numberOfPeople}</li>
      </ul>
      
      <p><b>Approval Reason:</b> ${adminReason}</p>
      
      <p>We look forward to making your trip a memorable experience. If you have any questions, feel free to contact us.</p>
      
      <p>Best regards,<br/>
      <b>Your Travel Team</b></p>
    `;

    // Send approval email
    await sendEmail(email, "Your Tour Request is Approved!", emailContent);

    res.status(200).json({
      success: true,
      message: "Tour request approved",
      data: approvedTour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Reject a tour request (Admin only)
export const rejectTourRequest = async (req, res) => {
  try {
    const { adminReason } = req.body;
    if (!adminReason)
      return res
        .status(400)
        .json({ success: false, message: "Reason required for rejection" });

    const rejectedTour = await TourRequest.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", adminReason },
      { new: true }
    );

    if (!rejectedTour)
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });

    // Send rejection email
    await sendEmail(
      rejectedTour.email,
      "Your Tour Request is Rejected",
      `<p>Dear ${rejectedTour.name},</p>
       
      <p>We regret to inform you that your tour request has been rejected.</p>
       
       <p>Reason: ${adminReason}</p>
       
       <p>For further inquiries, please contact us.</p>

       <p>Best regards,<br/>
       <b>Your Travel Team</b></p>
       `
    );

    res.status(200).json({
      success: true,
      message: "Tour request rejected",
      data: rejectedTour,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all tour requests, sorted by createdAt in descending order
export const getAllTourRequests = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    // Pagination settings
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { contactNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Get total count for pagination
    const totalRecords = await TourRequest.countDocuments(searchFilter);

    // Fetch tour requests with search and pagination
    const tourRequests = await TourRequest.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      data: tourRequests,
      totalPages: Math.ceil(totalRecords / limitNumber),
      currentPage: pageNumber,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all my tour requests, sorted by createdAt in descending order
export const getAllMyTourRequests = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const { userId } = req.params;

    // Pagination settings
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Search filter
    const searchFilter = {
      userId, // 👉 Filter by userId
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { contactNumber: { $regex: search, $options: "i" } },
        ],
      }),
    };

    // Get total count for pagination
    const totalRecords = await TourRequest.countDocuments(searchFilter);

    // Fetch tour requests with search and pagination
    const tourRequests = await TourRequest.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      data: tourRequests,
      totalPages: Math.ceil(totalRecords / limitNumber),
      currentPage: pageNumber,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
