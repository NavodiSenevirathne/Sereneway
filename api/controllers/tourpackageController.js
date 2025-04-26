
import mongoose from "mongoose";
import Tour from '../models/Tour.js'

//create new tour

export const createTour = async (req, res)=>{
    console.log("Incoming request body:", req.body);  // Debugging line
    const newTour = new Tour(req.body)
 
    try{
        const savedTour = await newTour.save();
        res.status(200).json({
            success:true, 
            message: "successfully created tour package",
            data:savedTour,
        });

    }catch(err){
        console.error("error creating tour package", err);
        res.status(500).json({
            success:false, 
            message: "failed to create tour package, try again"
        });
    }
};



//update tour


export const updateTour = async (req, res) => {
    const { id } = req.params;

    console.log("Received ID:", id); // Debugging

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid tour ID format",
        });
    }

    try {
        // Check if the tour exists before updating
        const tourExists = await Tour.findById(id);
        console.log("Tour found:", tourExists); // Debugging

        if (!tourExists) {
            return res.status(404).json({
                success: false,
                message: "Tour package not found",
            });
        }

        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Successfully updated tour package",
            data: updatedTour,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update package",
            error: err.message,
        });
    }
};





//delete tour

export const deleteTour = async(req, res)=>{
    const id = req.params.id;

    try{
        const deletedTour = await Tour.findByIdAndDelete(id);

        res.status(200).json({
            success:true, 
            message: "successfully deleted the tour package",
    
        });

    }catch(err){
        res.status(500).json({
            success:false, 
            message: "failed to delete package",
        });

    }
};




//get single tour package

export const getSingleTour = async (req, res) => {
         const id = req.params.id;

    try {
       
        console.log("Received Tour ID:", id); // Log after defining id
        const tour = await Tour.findById(id);

        res.status(200).json({
            success: true,
            message: "Successfully got tour package",
            data: tour,
        });
        
    } catch (err) {
        console.error("Error fetching tour:", err); // Log actual error
        res.status(500).json({
            success: false,
            message: "Failed to get tour package",
            error: err.message, // Provide error details
        });
    }
};






//get all tour

export const getAllTour = async(req, res)=>{

    //for pagination

    const page = parseInt(req.query.page);
    

    try {
       
        const tours = await Tour.find({})
        .skip(page*8)
        .limit(8)


        res.status(200).json({
            success: true,
            count:tours.length,
            message: "Successfully got all tour packages",
            data: tours,
        });
        
    } catch (err) {
        console.error("Error fetching all tours:", err); // Log actual error
        res.status(500).json({
            success: false,
            message: "Failed to get all tour packages",
            error: err.message, // Provide error details
        });
    }
    
};




//get tour package by search

export const getTourBySearch = async(req, res)=>{


    //hete "i" means case sensitive
    const province = new RegExp(req.query.province, 'i')
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
       //gte means grater than equel
        const tours = await Tour.find({
            province,
            maxGroupSize: {$gte: maxGroupSize},
        });

        res.status(200).json({
            success: true,
            count:tours.length,
            message: "Successfully",
            data: tours,
            
        });
        
    } catch (err) {
        console.error("Error fetching all tours:", err); // Log actual error
        res.status(500).json({
            success: false,
            message: "Failed to get all tour packages",
            error: err.message, // Provide error details
        });
    }
}




//get featured tour

export const getFeaturedTour = async(req, res)=>{
    try {
        const tours = await Tour.find({featured:true}).limit(8);

        res.status(200).json({
            success: true,
            message: "Successfully",
            data: tours,
        });
        
    } catch (err) {
        console.error("Error fetching all tours:", err); // Log actual error
        res.status(500).json({
            success: false,
            message: "Failed to get all tour packages",
            error: err.message, // Provide error details
        });
    }
    
};


//get tour count

export const getTourCount = async(req, res)=>{
    try {
        const tourCount = await Tour.estimatedDocumentCount();

        res.status(200).json({
            success: true,
            data: tourCount,
        });
        
    } catch (err) {
        console.error("fail to get tour count:", err); // Log actual error
        res.status(500).json({
            success: false,
            message: "fail to get tour count",
            error: err.message, // Provide error details
        });
    }
    
};




