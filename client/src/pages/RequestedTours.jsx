import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import Alert from "../components/Alert";

dayjs.extend(relativeTime);

const MAX_RESPONSE_TIME = 2; // 2 days

export default function RequestedTours() {
  const [tours, setTours] = useState([]);
  const [expandedTourId, setExpandedTourId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [adminCommentError, setAdminCommentError] = useState("");

  const getShortTourId = (tourId) => {
    const last3Digits = tourId.slice(-3);
    return `TOUR_${last3Digits}`;
  };

  const getCountdown = (createdAt, status) => {
    const createdTime = dayjs(createdAt);
    const now = dayjs();
    const diffInHours = now.diff(createdTime, "hour");

    if (status !== "Pending") {
      // If the request is already processed (Approved/Rejected)
      return <span className="text-green-600 font-semibold">Processed ✅</span>;
    }

    if (diffInHours >= MAX_RESPONSE_TIME * 24) {
      // If it's pending and exceeded response time
      return (
        <span className="text-red-600 font-semibold">
          Exceeded response time! ⏳
        </span>
      );
    }

    // If it's pending but still within the response window
    return (
      <span className="text-blue-600 font-semibold">
        {dayjs(createdTime.add(MAX_RESPONSE_TIME, "day")).fromNow(true)}
      </span>
    );
  };

  const handleProcess = (tour) => {
    setSelectedTour(tour);
    setShowProcessModal(true);
  };

  const closeProcessModal = () => {
    setShowProcessModal(false);
    setSelectedTour(null);
  };

  const handleToggleAdminReason = (tourId) => {
    setExpandedTourId(expandedTourId === tourId ? null : tourId);
  };

  // Function to fetch the list of tours
  const fetchTours = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const url = `${apiUrl}/api/tours/requests?page=${page}&search=${searchTerm}&limit=10`;

    axios
      .get(url)
      .then((response) => {
        setTours(response.data.data);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
      });
  };

  // Delete the selected tour
  const handleDelete = (tourId) => {
    setSelectedTourId(tourId);
    setShowModal(true);
  };

  // Approve the tour request
  const handleApprove = () => {
    // Validate admin comment
    if (!adminComment.trim()) {
      setAdminCommentError(
        "Please enter a comment before approving the tour request."
      );
      return; // Prevent the request from being sent if comment is empty
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${
      apiUrl
        ? `${apiUrl}/api/tours/request/${selectedTour._id}/approve`
        : `http://localhost:5000/api/tours/request/${selectedTour._id}/approve`
    }`;

    axios
      .patch(url, { adminReason: adminComment })
      .then((response) => {
        setAlert({
          message: "Tour request approved successfully!",
          type: "success",
        });
        fetchTours(); // Refresh the list after approving
        setShowProcessModal(false); // Close modal
        setAdminComment("");
      })
      .catch((error) => {
        console.error("Error approving tour:", error);
        setAlert({
          message: "Failed to approve the tour request.",
          type: "error",
        });
      });
  };

  // Reject the tour request
  const handleReject = () => {
    // Validate admin comment
    if (!adminComment.trim()) {
      setAdminCommentError(
        "Please enter a comment before rejecting the tour request."
      );

      return; // Prevent the request from being sent if comment is empty
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${
      apiUrl
        ? `${apiUrl}/api/tours/request/${selectedTour._id}/reject`
        : `http://localhost:5000/api/tours/request/${selectedTour._id}/reject`
    }`;

    axios
      .patch(url, { adminReason: adminComment })
      .then((response) => {
        setAlert({
          message: "Tour request rejected successfully!",
          type: "success",
        });
        fetchTours(); // Refresh the list after rejecting
        setShowProcessModal(false); // Close modal
        setAdminComment("");
      })
      .catch((error) => {
        console.error("Error rejecting tour:", error);
        setAlert({
          message: "Failed to reject the tour request.",
          type: "error",
        });
      });
  };

  const confirmDelete = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${
      apiUrl
        ? `${apiUrl}/api/tours/request/${selectedTourId}`
        : `http://localhost:5000/api/tours/request/${selectedTourId}`
    }`;

    axios
      .delete(url)
      .then(() => {
        setAlert({
          message: "Tour request deleted successfully!",
          type: "success",
        });
        fetchTours(); // Refresh the list after deleting
        setShowModal(false); // Close modal
      })
      .catch((error) => {
        console.error("Error deleting tour:", error);
        setAlert({
          message: "Failed to delete the tour request.",
          type: "error",
        });
        setShowModal(false); // Close modal if error occurs
      });
  };

  const cancelDelete = () => {
    setShowModal(false); // Close the modal without deletion
  };

  useEffect(() => {
    fetchTours();
  }, [page, searchTerm]);

  return (
    <>
      <div data-name="about-page" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">
            Requested Tours
          </h1>
          <p className="text-center mb-6">
            Manage all the requested tours. You can view, edit, delete, approve,
            or send an email.
          </p>

          <div className="mb-4 flex justify-end items-center relative">
            <input
              type="text"
              placeholder="Search by Name, Email, or Contact Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 pr-10 rounded-md w-1/2"
            />
            <i className="fas fa-search absolute right-3 text-gray-500"></i>
          </div>

          <div className="overflow-x-auto bg-white rounded-md">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Tour ID
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Contact Number
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">
                    Approve / Reject Note
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">
                    Created At
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">
                    Countdown
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tours.length > 0 ? (
                  tours.map((tour) => (
                    <tr key={tour._id} className="border-b">
                      <td className="py-3 px-4">
                        {getShortTourId(tour._id) || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {tour.name || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {tour.email || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {tour.contactNumber || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {tour.adminReason ? (
                          <span
                            onClick={() => handleToggleAdminReason(tour._id)}
                            className="cursor-pointer text-blue-600 hover:underline"
                          >
                            {expandedTourId === tour._id
                              ? tour.adminReason
                              : `${tour.adminReason.substring(0, 30)}...`}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-white ${
                            tour.status === "Pending"
                              ? "bg-yellow-500"
                              : tour.status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {tour.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {dayjs(tour.createdAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {getCountdown(tour.createdAt, tour.status)}
                      </td>
                      <td className="py-3 px-4 flex space-x-3">
                        <button
                          onClick={() => handleProcess(tour)}
                          className={`flex items-center gap-1 cursor-pointer ${
                            tour.status === "Pending"
                              ? "text-blue-600 hover:text-blue-800"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={tour.status !== "Pending"}
                        >
                          Process
                        </button>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className={`flex items-center gap-1 cursor-pointer ${
                            tour.status === "Pending"
                              ? "text-red-600 hover:text-red-800"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={tour.status !== "Pending"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No requested tours found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="py-2 px-4 border border-gray-300 rounded-md">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>

          {/* Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Are you sure?
                </h3>
                <p className="mb-6 text-center">
                  Do you want to delete this tour request?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Process Modal */}
          {showProcessModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Process Tour Request
                </h3>
                {/* Add tour request summary content here */}
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="rounded-2xl p-6 w-full max-w-3xl mx-auto">
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedTour.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedTour.email}
                      </p>
                      <p>
                        <span className="font-medium">
                          Tour Start Location:
                        </span>{" "}
                        {selectedTour.tourStartLocation}
                      </p>
                      <p>
                        <span className="font-medium">Tour Start Date:</span>{" "}
                        {new Date(
                          selectedTour.tourStartDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedTour.tourDuration} days
                      </p>
                      <p>
                        <span className="font-medium">Estimated Budget:</span> $
                        {selectedTour.estimatedBudget}
                      </p>
                      <p>
                        <span className="font-medium">Additional Note:</span>{" "}
                        {selectedTour.note}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">
                      Locations
                    </h3>
                    <ul className="mt-2 space-y-2 text-gray-700">
                      {selectedTour.selectedLocations.map((location) => (
                        <li
                          key={location._id}
                          className="bg-gray-100 p-3 rounded-lg"
                        >
                          <span className="font-medium">
                            {location.locationName}
                          </span>{" "}
                          - Distance: {location.distance} km - Cost: $
                          {location.distance * location.pricePerUnit}
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">
                      Summary
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {selectedTour.summary}
                    </p>

                    <div className="grid grid-cols-1 gap-4 mt-6">
                      <div>
                        <label className="block font-semibold mb-2">
                          Approve / Reject Comment
                        </label>
                        <textarea
                          name="note"
                          placeholder="Enter your note..."
                          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                          onChange={(e) => {
                            const { name, value } = e.target;
                            setAdminComment(value);
                          }}
                          value={adminComment} // Fixed the value binding
                        ></textarea>
                        {adminCommentError && (
                          <p className="text-red-500 text-sm">
                            {adminCommentError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-2">
                      <button
                        onClick={closeProcessModal}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleReject}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={handleApprove}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* alert  */}
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
