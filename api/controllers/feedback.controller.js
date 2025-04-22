import Feedback from "../models/feedback.models.js";
import nodemailer from "nodemailer";

import { sendWarningEmail } from "../utils/emailService.js";

// Helper function to check for hate speech
const containsHateSpeech = (text) => {
  const hateWords = [
    "hate",
    "terrible",
    "awful",
    "worst",
    "garbage",
    "trash",
    "useless",
    "pathetic",
    "horrible",
    "disappointing",
  ];

  return hateWords.some((word) =>
    text.toLowerCase().includes(word.toLowerCase())
  );
};

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

// Create feedback
export const createfeedback = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);

    const { name, email, description, rating } = req.body;

    // Check for negative words in the description
    const containsNegativeWords = negativeWords.some((word) =>
      description.toLowerCase().includes(word)
    );

    if (containsNegativeWords) {
      // If negative words are found, send warning email
      console.log("Negative words found, sending email...");
      await sendWarningEmail(email, description);
    }

    // Create feedback in the database
    const feedback = await Feedback.create(req.body);

    // Send the response only once after handling everything
    return res.status(201).json(feedback);
  } catch (error) {
    console.error("Error in createfeedback:", error);
    next(error);
  }
};



// Get all feedbacks
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    return res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// Update feedback
export const updateFeedback = async (req, res, next) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

// Delete feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Admin reply to feedback
export const replyToFeedback = async (req, res, next) => {
  try {
    const { text, adminName } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Add reply to feedback
    if (!feedback.replies) {
      feedback.replies = [];
    }

    feedback.replies.push({
      text,
      adminName,
      date: new Date(),
    });

    await feedback.save();

    // Send email notification to customer about the reply
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: feedback.email,
      subject: "Response to your feedback",
      html: `
        <h2>We've responded to your feedback</h2>
        <p>Dear ${feedback.name},</p>
        <p>Thank you for sharing your thoughts with us. Our team has responded to your feedback:</p>
        <p><em>"${text}"</em></p>
        <p>If you have any further questions or concerns, please don't hesitate to reach out.</p>
        <p>Best regards,<br>${adminName}<br>The Tour Management Team</p>
      `,
    });

    return res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// Get feedback statistics
export const getFeedbackStats = async (req, res, next) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingsCount: {
            $push: { rating: "$rating" },
          },
        },
      },
    ]);

    // Calculate star counts
    const starCounts = [0, 0, 0, 0, 0]; // For 1-5 stars

    if (stats.length > 0 && stats[0].ratingsCount) {
      stats[0].ratingsCount.forEach((item) => {
        starCounts[item.rating - 1]++;
      });
    }

    const result =
      stats.length > 0
        ? {
            totalCount: stats[0].totalCount,
            averageRating: stats[0].averageRating,
            starCounts,
          }
        : {
            totalCount: 0,
            averageRating: 0,
            starCounts,
          };

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const negativeWords = [
  "this sucks",
  "don't like",
  "hate it",
  "bad experience",
  "worst",
  "disappointed",
];