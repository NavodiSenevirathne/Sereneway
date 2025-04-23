import express from "express";
import {
  approveTourRequest,
  createTourRequest,
  deleteTourRequest,
  editTourRequest,
  getAllTourRequests,
  getTourRequest,
  rejectTourRequest,
} from "../controllers/TourRequest.controller.js";
import { validateTourRequest } from "../middlewares/validations/TourRequest.validation.js";

const router = express.Router();

// 🚀 Tour request routes
router.post("/request", validateTourRequest, createTourRequest);
router.get("/request/:id", getTourRequest);
router.put("/request/:id", editTourRequest);
router.delete("/request/:id", deleteTourRequest);
router.get("/requests", getAllTourRequests);

// 🚀 Admin actions
router.patch("/request/:id/approve", approveTourRequest);
router.patch("/request/:id/reject", rejectTourRequest);

export default router;
