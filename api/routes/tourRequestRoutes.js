// routes/tourRequestRoutes.js
import express from 'express';
import { getAllTourRequests, updateTourRequest, deleteTourRequest, createTourRequest } from '../controllers/tourRequestController.js';

const router = express.Router();

// Route to get all tour requests
router.get('/tour-requests', getAllTourRequests);

// Route to create a new tour request
router.post('/tour-requests', createTourRequest);

// Route to update a tour request
router.put('/tour-requests/:tourRequestId', updateTourRequest);

// Route to delete a tour request
router.delete('/tour-requests/:tourRequestId', deleteTourRequest);

export default router;
