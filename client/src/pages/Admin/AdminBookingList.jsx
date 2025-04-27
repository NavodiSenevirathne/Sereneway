import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings/all_bookings');
      console.log('API Response:', res.data);
      setBookings(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
      alert('Booking deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  const handleViewBooking = (id) => {
    console.log(`Navigating to booking: ${id}`);
    navigate(`/admin/bookings/${id}`);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Bookings Management</h1>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading bookings...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Bookings Management</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Tour Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          <>
            {/* Mobile view - card layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {currentItems.map((booking) => (
                <div key={booking._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-3">
                    <img 
                      className="h-10 w-10 rounded-full object-cover mr-3" 
                      src={booking.tour?.imageUrls?.[0] || '/placeholder-image.jpg'} 
                      alt={booking.tour?.title || 'Tour'} 
                    />
                    <div>
                      <h3 className="font-medium">{booking.tour?.title || 'Unknown Tour'}</h3>
                      <p className="text-sm text-gray-500">Booked by: {booking.fullName || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <p className="text-sm"><span className="font-medium">Date:</span> {booking.bookingDate ? formatDate(booking.bookingDate) : 'N/A'}</p>
                    <p className="text-sm"><span className="font-medium">Guests:</span> {booking.adults || 0} Adults, {booking.children || 0} Children</p>
                    <p className="text-sm"><span className="font-medium">Room:</span> {booking.roomType?.category || 'N/A'} {booking.roomType?.subType || ''}</p>
                    <p className="text-sm"><span className="font-medium">Price:</span> Rs. {booking.totalPrice?.toLocaleString() || '0'}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => handleViewBooking(booking._id)}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop view - table layout */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={booking.tour?.imageUrls?.[0] || '/placeholder-image.jpg'} 
                              alt={booking.tour?.title || 'Tour'} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.tour?.title || 'Unknown Tour'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">NIC: {booking.nic || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.adults || 0} Adults, {booking.children || 0} Children
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.roomType?.category || 'N/A'} {booking.roomType?.subType || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.bookingDate ? formatDate(booking.bookingDate) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rs. {booking.totalPrice?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewBooking(booking._id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 overflow-x-auto">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
