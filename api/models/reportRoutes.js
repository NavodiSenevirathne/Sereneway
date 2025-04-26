// routes/reportRoutes.js
import express from 'express';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Tour Package Performance Report
router.get('/tour-performance', async (req, res) => {
  try {
    // Get date range filter (default to last 30 days if not provided)
    const { startDate, endDate } = req.query;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dateFilter = {
      bookingDate: {
        $gte: startDate ? new Date(startDate) : thirtyDaysAgo,
        $lte: endDate ? new Date(endDate) : new Date()
      }
    };

    // Get all tours
    const tours = await Tour.find().select('_id title regularPrice discountedPrice packageType maxGroupSize duration address imageUrls');
    
    // Get all bookings within date range
    const bookings = await Booking.find(dateFilter);
    
    // Process data for each tour
    const tourPerformance = tours.map(tour => {
      // Get bookings for this tour
      const tourBookings = bookings.filter(booking => 
        booking.tour.toString() === tour._id.toString()
      );
      
      // Calculate metrics
      const bookingsCount = tourBookings.length;
      const totalRevenue = tourBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      const totalGuests = tourBookings.reduce((sum, booking) => sum + booking.adults + booking.children, 0);
      
      // Calculate occupancy rate
      const occupancyRate = tour.maxGroupSize > 0 && bookingsCount > 0
        ? Math.round((totalGuests / (bookingsCount * tour.maxGroupSize)) * 100)
        : 0;
      
      // Calculate revenue per day
      const revenuePerDay = tour.duration > 0 && totalRevenue > 0
        ? Math.round(totalRevenue / (bookingsCount * tour.duration))
        : 0;
      
      // Calculate booking trend (compare first half vs second half of period)
      let bookingTrend = 0;
      if (bookingsCount >= 2) {
        const sortedBookings = [...tourBookings].sort((a, b) => 
          new Date(a.bookingDate) - new Date(b.bookingDate)
        );
        const midpoint = Math.floor(sortedBookings.length / 2);
        const firstHalf = sortedBookings.slice(0, midpoint).length;
        const secondHalf = sortedBookings.slice(midpoint).length;
        
        bookingTrend = firstHalf > 0 
          ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
          : secondHalf > 0 ? 100 : 0;
      }
      
      return {
        _id: tour._id,
        title: tour.title,
        packageType: tour.packageType,
        address: tour.address,
        duration: tour.duration,
        price: tour.discountedPrice || tour.regularPrice,
        maxGroupSize: tour.maxGroupSize,
        bookingsCount,
        totalRevenue,
        totalGuests,
        occupancyRate,
        bookingTrend,
        revenuePerDay,
        imageUrl: tour.imageUrls && tour.imageUrls.length > 0 ? tour.imageUrls[0] : null,
        // Performance score (weighted combination of bookings, revenue, occupancy)
        performanceScore: (
          (bookingsCount * 0.4) + 
          (totalRevenue / 10000 * 0.4) + 
          (occupancyRate * 0.2)
        ).toFixed(1)
      };
    });
    
    // Sort by performance score by default
    tourPerformance.sort((a, b) => b.performanceScore - a.performanceScore);
    
    res.status(200).json({
      success: true,
      count: tourPerformance.length,
      data: tourPerformance
    });
  } catch (error) {
    console.error('Error generating tour performance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate tour performance report',
      error: error.message
    });
  }
});

export default router;
