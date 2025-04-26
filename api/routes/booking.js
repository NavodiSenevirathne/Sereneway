import express from 'express';
import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

const router = express.Router();

// ===== AUTHENTICATION MIDDLEWARE (UNCOMMENT LATER) =====
/*
// Verify user is logged in
const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ success: false, message: "You are not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Token is not valid" });
    }
    req.user = user;
    next();
  });
};

// Verify user is admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "You are not authorized" });
  }
  next();
};
*/

// Create booking
router.post('/', async (req, res) => {
  try {
    // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
    // Add user ID from authenticated user
    // req.body.user = req.user.id;
    
    const { tour, adults, children, roomType } = req.body;
    
    // Get tour capacity
    console.log("Looking for tour with ID:", tour);
    const tourDoc = await Tour.findById(tour);
    console.log("Found tour:", tourDoc);

    if (!tourDoc) {
      return res.status(404).json({ error: 'Tour not found' });
    } 
    
    const existingBookings = await Booking.find({ tour });
    
    // Calculate remaining capacity
    const totalBooked = existingBookings.reduce((acc, curr) => 
      acc + curr.adults + curr.children, 0);
    const remaining = tourDoc.maxGroupSize - totalBooked;
    
    if ((adults + children) > remaining) {
      return res.status(400).json({ error: 'Not enough capacity' });
    }

    // Create new booking
    const booking = new Booking(req.body);
    await booking.save();
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get remaining capacity
router.get('/capacity/:tourId', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    const bookings = await Booking.find({ tour: req.params.tourId });
    
    const totalBooked = bookings.reduce((acc, curr) => acc + curr.adults + curr.children, 0);
    const remaining = tour.maxGroupSize - totalBooked;
    
    res.json({ remaining });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ADMIN BOOKING MANAGEMENT ROUTES =====

// Get all bookings (admin only)
//router.get('/admin', async (req, res) => {
  router.get('/all_bookings', async (req, res) => {
  // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
  // verifyUser, verifyAdmin,
  
  try {
    // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
    // Check if user is admin
    /*
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access all bookings'
      });
    }
    */

    const bookings = await Booking.find()
      .populate({
        path: 'tour',
        select: 'title imageUrls'
      })
      // UNCOMMENT WHEN USER MODEL IS IMPLEMENTED:
      /*
      .populate({
        path: 'user',
        select: 'username email'
      })
      */
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// ===== USER BOOKING MANAGEMENT ROUTES =====

// Get user bookings
router.get('/user/:userId', async (req, res) => {
  // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
  // verifyUser,
  
  try {
    // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
    // const userId = req.user._id;
    // COMMENT OUT WHEN AUTH IS IMPLEMENTED:
    const userId = req.params.userId;

    // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
    /*
    // Check if user is requesting their own bookings or is admin
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these bookings'
      });
    }
    */

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'tour',
        select: 'title imageUrls regularPrice discountedPrice offer'
      })
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user bookings',
      error: error.message
    });
  }
});

// ===== SHARED BOOKING ROUTES =====

// Get booking by ID
router.get('/:id', async (req, res) => {
  // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
  // verifyUser,
  
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate({
        path: 'tour',
        select: 'title description imageUrls regularPrice discountedPrice offer'
      });
      // UNCOMMENT WHEN USER MODEL IS IMPLEMENTED:
      /*
      .populate({
        path: 'user',
        select: 'username email'
      });
      */

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
    /*
    // Check if user is admin or the booking owner
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }
    */

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
  // verifyUser,
  
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // UNCOMMENT WHEN AUTH IS IMPLEMENTED:
    /*
    // Check if user is admin or the booking owner
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }
    */

    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
});

export default router;
