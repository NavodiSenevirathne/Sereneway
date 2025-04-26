// routes/tourGuideRoutes.js
import express from 'express';
import { addTourGuide, getTourGuides, getTourGuideById, updateTourGuide, deleteTourGuide } from '../controllers/tourGuideController.js';

const router = express.Router();

router.post('/', addTourGuide);
router.get('/', getTourGuides);
router.get('/:id', getTourGuideById);
router.put('/:id', updateTourGuide);
router.delete('/:id', deleteTourGuide);

export default router;
