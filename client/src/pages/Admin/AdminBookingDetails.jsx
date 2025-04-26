// pages/admin/BookingDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/bookings/${id}`);
      console.log("Booking data:", res.data.data); // Debug log
      setBooking(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError(err.response?.data?.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`/api/bookings/${id}`);
      alert('Booking deleted successfully');
      navigate('/admin/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Navigation header
  const AdminHeader = () => (
    <div className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/tour_packages" className="hover:text-gray-300">Tour Packages</Link>
            </li>
            <li>
              <Link to="/admin/bookings" className="hover:text-gray-300 font-bold underline">Bookings</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
        <div className="text-center py-8">Loading booking details...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">Error: {error}</div>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">Booking not found</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <div className="flex space-x-4">
            <Link 
              to="/admin/bookings"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Bookings
            </Link>
            <button 
              onClick={handleDeleteBooking}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete Booking
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{booking.tour?.title || 'Unknown Tour'}</h2>
                <p className="text-gray-500">Booking ID: {booking._id}</p>
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                Confirmed
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tour Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    {booking.tour?.imageUrls?.length > 0 ? (
                      <img 
                        src={booking.tour.imageUrls[0]} 
                        alt={booking.tour?.title || 'Tour'} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">
                    {booking.tour?.description 
                      ? `${booking.tour.description.substring(0, 150)}...` 
                      : 'No description available'}
                  </p>
                  {booking.tour?._id && (
                    <Link 
                      to={`/tours/${booking.tour._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Tour Details
                    </Link>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><span className="font-medium">Name:</span> {booking.fullName || 'N/A'}</p>
                  <p className="mb-2"><span className="font-medium">User ID:</span> {booking.user || 'N/A'}</p>
                  <p className="mb-2"><span className="font-medium">NIC:</span> {booking.nic || 'N/A'}</p>
                  <p className="mb-2"><span className="font-medium">Booking Date:</span> {formatDate(booking.bookingDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><span className="font-medium">Adults:</span> {booking.adults || 0}</p>
                  <p className="mb-2"><span className="font-medium">Children:</span> {booking.children || 0}</p>
                  <p className="mb-2">
                    <span className="font-medium">Room Category:</span> {booking.roomType?.category || 'N/A'}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Room Type:</span> {booking.roomType?.subType || 'N/A'}
                  </p>
                  <p className="mb-2"><span className="font-medium">Rooms:</span> {booking.rooms || 0}</p>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
