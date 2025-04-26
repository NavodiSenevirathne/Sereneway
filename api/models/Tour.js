import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        accommodation: { 
            type: String, 
            required: true },

        packageType: {
            type: String,
            required: true,
        },

        featured: {
            type: Boolean,
            default: false,
        },

        offer: {
            type: Boolean,
            default: false,
        },

        maxGroupSize: {
            type: Number,
            required: true,
        },

        days: {
            type: Number,
            required: true,
        },

        regularPrice: {
            type: Number,
            required: true,
        },

        discountedPrice: {
            type: Number,
            required: true,
        },

        imageUrls: {
            type: Array,
            required: true,
        },
    },

    {timestamps: true}
);

const Tours = mongoose.model("Tour", tourSchema)
export default Tours;
