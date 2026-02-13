import mongoose from "mongoose";

const TourRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },

    tourStartLocation: { type: String, required: true }, // Start point of the tour
    tourStartDate: { type: Date, required: true }, // Start date
    estimatedEndDate: { type: Date }, // Auto-calculated end date

    selectedLocations: [
      {
        locationName: { type: String, required: true },
        distance: { type: Number, required: true }, // Distance in KM
        pricePerUnit: { type: Number, required: true }, // Cost per KM for travel
      },
    ],

    numberOfPeople: { type: Number, required: true },
    tourDuration: { type: Number, required: true }, // Number of days

    tourType: {
      type: String,
      enum: ["Standard", "Luxury", "Custom"],
      default: "Standard",
    },

    basePricePerPerson: { type: Number, required: true }, // Cost per person (e.g., food, accommodation)
    estimatedBudget: { type: Number, required: true }, // Auto-calculated
    estimatedTimeHours: { type: Number }, // Estimated time in hours

    costBreakdown: { type: Object }, // Cost breakdown per location or service
    summary: { type: String }, // Auto-generated summary

    note: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminReason: { type: String }, // If rejected, reason from admin
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("TourRequest", TourRequestSchema);
