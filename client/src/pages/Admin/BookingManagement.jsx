import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import axios from "axios";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [updateBooking, setUpdateBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Dummy data for testing; replace with actual API call
      setBookings([
        {
          id: 1,
          tour: "Cultural Triangle Explorer",
          user: "John Doe",
          date: "2024-02-15",
          participants: 2,
          amount: 1598,
          status: "confirmed",
          payment: "paid",
        },
      ]);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5001/api/bookings/${id}`, { status });
      fetchBookings();
      setUpdateBooking(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100 ">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Booking Management</h2>

          {/* Table Wrapper (Scrollable on Small Screens) */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div className="grid grid-cols-1 sm:grid-cols-7 font-semibold pb-2 border-b border-gray-300">
                <span>Tour</span>
                <span>User</span>
                <span>Date</span>
                <span>Participants</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {/* Table Rows */}
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-1 sm:grid-cols-7 py-2 border-b border-gray-100 items-center text-center sm:text-left"
                >
                  <span>{booking.tour}</span>
                  <span>{booking.user}</span>
                  <span>{booking.date}</span>
                  <span>{booking.participants}</span>
                  <span>${booking.amount}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold mx-auto sm:mx-0 ${
                      booking.status === "confirmed"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-200 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {/* Buttons Wrapper (Stacked on Small Screens) */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => setExpandedBooking(booking)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setUpdateBooking(booking)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Booking Details Popup */}
      {expandedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
            <p><strong>Tour:</strong> {expandedBooking.tour}</p>
            <p><strong>User:</strong> {expandedBooking.user}</p>
            <p><strong>Date:</strong> {expandedBooking.date}</p>
            <p><strong>Participants:</strong> {expandedBooking.participants}</p>
            <p><strong>Amount:</strong> ${expandedBooking.amount}</p>
            <p><strong>Status:</strong> {expandedBooking.status}</p>
            <p><strong>Payment:</strong> {expandedBooking.payment}</p>

            <button
              onClick={() => setExpandedBooking(null)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Status Popup */}
      {updateBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <p><strong>Tour:</strong> {updateBooking.tour}</p>
            <p><strong>User:</strong> {updateBooking.user}</p>
            <p><strong>Date:</strong> {updateBooking.date}</p>
            <p><strong>Participants:</strong> {updateBooking.participants}</p>
            <p><strong>Amount:</strong> ${updateBooking.amount}</p>
            <p><strong>Payment:</strong> {updateBooking.payment}</p>

            {/* Status Buttons (Stacked on Small Screens) */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={() => updateStatus(updateBooking.id, "Pending")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md w-full"
              >
                Pending
              </button>
              <button
                onClick={() => updateStatus(updateBooking.id, "Confirmed")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md w-full"
              >
                Confirmed
              </button>
              <button
                onClick={() => updateStatus(updateBooking.id, "Cancelled")}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md w-full"
              >
                Cancelled
              </button>
            </div>

            <button
              onClick={() => setUpdateBooking(null)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
