import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/bookings/all_bookings`);
        
        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => {
    return searchQuery === "" || 
           booking.tour?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           booking.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`/api/bookings/${bookingId}`);
        if (response.data.success) {
          setBookings(bookings.filter(booking => booking._id !== bookingId));
          alert("Booking cancelled successfully");
        } else {
          throw new Error(response.data.message || "Failed to cancel booking");
        }
      } catch (err) {
        console.error("Error cancelling booking:", err);
        alert(err.message || "Something went wrong. Please try again later.");
      }
    }
  };
  
  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };
  
  // Close booking details modal
  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-white">My Bookings</h1>
            <Link 
              to="/user/tours" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-green-700"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and stats bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-gray-500">
              You don't have any bookings yet.
            </p>
            <div className="mt-6">
              <Link 
                to="/user/tours" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Browse Tours
              </Link>
            </div>
          </div>
        )}
        
        {/* Bookings list */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-gray-200"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Tour image */}
                  <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
                    {booking.tour?.imageUrls && booking.tour.imageUrls[0] ? (
                      <img 
                        src={booking.tour.imageUrls[0]} 
                        alt={booking.tour.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Booking date */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  
                  {/* Booking details */}
                  <div className="p-5 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {booking.tour?.title || 'Unknown Tour'}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{booking.tour?.address || 'Location not specified'}</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 px-4 py-2 rounded-lg text-right md:text-center">
                        <div className="text-sm text-gray-500">Total Price</div>
                        <div className="text-lg font-bold text-green-600">Rs. {booking.totalPrice.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Booking ID</div>
                        <div className="text-sm font-medium">{booking._id.substring(0, 8)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Room Type</div>
                        <div className="text-sm font-medium capitalize">{booking.roomType.category} {booking.roomType.subType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Rooms</div>
                        <div className="text-sm font-medium">{booking.rooms} {booking.rooms > 1 ? 'rooms' : 'room'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Guests</div>
                        <div className="text-sm font-medium">{booking.adults} adults, {booking.children} children</div>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex space-x-3">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Booking details modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeBookingDetails}></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Booking Details
                    </h3>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Tour</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking.tour?.title || 'Unknown Tour'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Booking Date</h4>
                          <p className="mt-1 text-sm text-gray-900">{format(new Date(selectedBooking.bookingDate), 'MMMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Booking ID</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking._id}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking.fullName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">NIC</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking.nic}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Room Type</h4>
                          <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking.roomType.category} {selectedBooking.roomType.subType}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Number of Rooms</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking.rooms}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Adults</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking.adults}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Children</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedBooking.children}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-500">Total Price</h4>
                        <p className="mt-1 text-lg font-bold text-gray-900">Rs. {selectedBooking.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeBookingDetails}
                >
                  Close
                </button>
                
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    closeBookingDetails();
                    handleCancelBooking(selectedBooking._id);
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
