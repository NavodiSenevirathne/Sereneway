

import express from 'express'
import { createTour, 
         updateTour,
         deleteTour,
         getSingleTour,
         getAllTour,
         getTourBySearch,
         getFeaturedTour,
         getTourCount} from '../controllers/tourpackageController.js';



const router = express.Router()

//create new tour
router.post('/create', createTour);

//update tour
router.put('/update/:id', updateTour);

//delete tour
router.delete('/:id', deleteTour);

//get single tour
router.get('/get/:id', getSingleTour);

//get all tours
router.get('/', getAllTour);  

//get tour by search
router.get("/search/getTourBySearch", getTourBySearch);

//get tour by search
router.get("/search/getFeaturedTours", getFeaturedTour);

//get tour count
router.get("/search/getTourCount", getTourCount);

export default router;
