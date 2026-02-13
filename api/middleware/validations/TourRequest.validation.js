import { body } from "express-validator";

export const validateTourRequest = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("contactNumber")
    .isLength({ min: 10, max: 15 })
    .withMessage("Invalid contact number"),
  body("tourStartLocation")
    .notEmpty()
    .withMessage("Tour start location is required"),
  body("tourStartDate").notEmpty().withMessage("Travel date is required"),
  body("selectedLocations")
    .isArray({ min: 1 })
    .withMessage("At least one location must be selected"),
  body("numberOfPeople")
    .isInt({ min: 1 })
    .withMessage("Number of people must be at least 1"),
  body("tourDuration")
    .isInt({ min: 1 })
    .withMessage("Tour duration must be at least 1 day"),
  body("tourType")
    .isIn(["Standard", "Luxury", "Custom"])
    .withMessage("Invalid tour type"),
  body("basePricePerPerson")
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),
  body("userId").notEmpty().withMessage("UserId is required"),
];

// ✅ Validation for updating a tour request (some fields optional)
export const validateTourUpdate = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("contactNumber")
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage("Invalid contact number"),
  body("tourStartDate")
    .optional()
    .notEmpty()
    .withMessage("Travel date cannot be empty"),
  body("selectedLocations")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one location must be selected"),
  body("numberOfPeople")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Number of people must be at least 1"),
  body("tourDuration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Tour duration must be at least 1 day"),
  body("tourType")
    .optional()
    .isIn(["Standard", "Luxury", "Custom"])
    .withMessage("Invalid tour type"),
  body("basePricePerPerson")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),
];

// ✅ Validation for cancelling a tour request
export const validateTourCancellation = [
  body("adminReason").notEmpty().withMessage("Cancellation reason is required"),
];
