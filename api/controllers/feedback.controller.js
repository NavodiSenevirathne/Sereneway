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

// Create a new feedback
export const createfeedback = async (req, res, next) => {
  try {
    const { name, email, description, rating, flaggedForReview } = req.body;

    // Check for hate speech
    const hasHateSpeech = containsHateSpeech(description);

    // Create new feedback
    const newFeedback = new Feedback({
      name,
      email,
      description,
      rating,
      flaggedForReview: flaggedForReview || hasHateSpeech,
    });

    // Save feedback
    const savedFeedback = await newFeedback.save();

    // If feedback contains hate speech, send warning email
    if (hasHateSpeech) {
      await sendWarningEmail(email, name, description);
    }

    return res.status(201).json(savedFeedback);
  } catch (error) {
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
    const { name, email, description, rating } = req.body;
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    
    // Check for hate speech in updated description
    const hasHateSpeech = containsHateSpeech(description);
    
    // Update feedback
    feedback.name = name || feedback.name;
    feedback.email = email || feedback.email;
    feedback.description = description || feedback.description;
    feedback.rating = rating || feedback.rating;
    feedback.flaggedForReview = hasHateSpeech || feedback.flaggedForReview;
    
    const updatedFeedback = await feedback.save();
    
    // If feedback now contains hate speech, send warning email
    if (hasHateSpeech && !feedback.flaggedForReview) {
      await sendWarningEmail(email, name, description);
    }
    
    return res.status(200).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

// Delete feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    await Feedback.findByIdAndDelete(req.params.id);
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

// Admin: Get all feedbacks with additional admin info
export const getAdminFeedbacks = async (req, res, next) => {
  try {
    console.log('Admin requesting all feedbacks');
    // Check if user is admin (this should be handled by middleware)
    // For now, we'll just return all feedbacks
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    console.log(`Found ${feedbacks.length} feedbacks`);
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error in getAdminFeedbacks:', error);
    next(error);
  }
};

// Admin: Delete feedback
export const adminDeleteFeedback = async (req, res, next) => {
  try {
    // Check if user is admin (this should be handled by middleware)
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    await Feedback.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Admin: Reply to feedback
export const adminReplyToFeedback = async (req, res, next) => {
  try {
    // Check if user is admin (this should be handled by middleware)
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

const negativeWords = [
  "this sucks",
  "don't like",
  "hate it",
  "bad experience",
  "worst",
  "disappointed",
];