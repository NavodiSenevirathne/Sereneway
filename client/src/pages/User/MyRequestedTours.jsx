import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { districts } from "../../assets/data/districts";
import { places } from "../../assets/data/places";
import { tourTypes } from "../../assets/data/tourTypes";
import Alert from "../../components/Alert";

dayjs.extend(relativeTime);

const MAX_RESPONSE_TIME = 2; // 2 days

export default function MyRequestedTours() {
  const email = localStorage.getItem("email");

  const [tours, setTours] = useState([]);
  const [expandedTourId, setExpandedTourId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [alert, setAlert] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    tourStartLocation: "",
    tourStartDate: "",
    selectedLocations: [],
    numberOfPeople: 1,
    tourType: [],
    tourDuration: 1,
    note: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contactNumber: "",
    tourStartLocation: "",
    tourStartDate: "",
    selectedLocations: "",
    numberOfPeople: "",
    tourDuration: "",
    tourType: "",
  });

  const getShortTourId = (tourId) => {
    const last3Digits = tourId.slice(-3);
    return `TOUR_${last3Digits}`;
  };

  const handleToggleAdminReason = (tourId) => {
    setExpandedTourId(expandedTourId === tourId ? null : tourId);
  };

  // Function to fetch the list of tours
  const fetchTours = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const url = `${apiUrl}/api/customize-tours/my-tour-requests/${email}?page=${page}&search=${searchTerm}&limit=10`;

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

  const handleEdit = (tour) => {
    setSelectedTour(tour);

    console.log("test", tour);

    setFormData({
      ...tour,
      tourStartDate: tour.tourStartDate ? tour.tourStartDate.split("T")[0] : "",
      tourType: tour.tourType,
      selectedTourType:
        tourTypes.find((type) => type.label === tour.tourType) || [],
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTour(null);
    setFormData({
      name: "",
      email: "",
      contactNumber: "",
      tourStartLocation: "",
      tourStartDate: "",
      selectedLocations: [],
      numberOfPeople: 1,
      tourType: [],
      tourDuration: 1,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\+?[0-9]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber =
        "Invalid contact number. Only digits and an optional '+' are allowed.";
    } else if (
      formData.contactNumber.startsWith("+") &&
      formData.contactNumber.length < 11
    ) {
      newErrors.contactNumber =
        "International number must be at least 11 characters.";
    } else if (
      !formData.contactNumber.startsWith("+") &&
      formData.contactNumber.length < 10
    ) {
      newErrors.contactNumber = "Local number must be at least 10 digits.";
    }

    if (!formData.tourStartLocation)
      newErrors.tourStartLocation = "Tour start location is required";

    if (!formData.tourStartDate) {
      newErrors.tourStartDate = "Tour start date is required";
    } else if (new Date(formData.tourStartDate) < new Date()) {
      newErrors.tourStartDate = "Tour start date cannot be in the past";
    }

    if (formData.numberOfPeople <= 0)
      newErrors.numberOfPeople = "Number of people must be greater than 0";

    if (!formData.tourDuration || formData.tourDuration <= 0)
      newErrors.tourDuration = "Tour duration must be greater than 0";

    if (formData.selectedLocations.length === 0)
      newErrors.selectedLocations = "Please select at least one location";

    console.log(formData.tourType, formData.tourType.label);

    if (!formData.tourType) newErrors.tourType = "Tour type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special case for tourType, which is now an object
    if (name === "tourType") {
      const selectedTourType = tourTypes.find((type) => type.label === value);
      setFormData({ ...formData, [name]: selectedTourType });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLocationSelect = (place) => {
    setFormData((prev) => {
      const newSelectedLocations = [...prev.selectedLocations];
      const index = newSelectedLocations.findIndex(
        (selectedPlace) => selectedPlace.locationName === place.locationName
      );

      if (index !== -1) {
        newSelectedLocations.splice(index, 1);
      } else {
        newSelectedLocations.push(place);
      }

      return {
        ...prev,
        selectedLocations: newSelectedLocations,
      };
    });
  };

  // Edit the tour request
  const handleEditTour = async (e) => {
    console.log(formData);

    e.preventDefault();

    if (validateForm()) {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.put(
          `${
            apiUrl
              ? ` ${apiUrl}/api/customize-tours/request/${selectedTour._id}`
              : `http://localhost:5000/api/customize-tours/request/${selectedTour._id}`
          }`,
          {
            ...formData,
            tourType: formData.tourType.label,
            basePricePerPerson: formData.tourType.basePricePerPerson,
            userId: email,
          }
        );

        if (response.data.success) {
          setAlert({
            message: "Tour request edited successfully!",
            type: "success",
          });
          setFormData({
            name: "",
            email: "",
            contactNumber: "",
            tourStartLocation: "",
            tourStartDate: "",
            selectedLocations: [],
            numberOfPeople: 1,
            tourType: [],
            tourDuration: 1,
          });
          fetchTours();
          setShowEditModal(false);
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          let errorMessage = "Something went wrong.";

          // Check if the error is related to a field like `basePricePerPerson`
          const fieldError = serverErrors.find(
            (err) => err.path === "basePricePerPerson"
          );

          if (fieldError) {
            errorMessage =
              fieldError.msg || "Invalid data for base price per person.";
          }

          setAlert({
            message: errorMessage,
            type: "error",
          });
        } else {
          setAlert({
            message: error.response
              ? error.response.data.message
              : "Something went wrong.",
            type: "error",
          });
        }
      }
    } else {
      setAlert({
        message: "Please fill in all required fields.",
        type: "error",
      });
    }
  };

  const handleDelete = (tourId) => {
    setSelectedTourId(tourId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${
      apiUrl
        ? `${apiUrl}/api/customize-tours/request/${selectedTourId}`
        : `http://localhost:5000/api/customize-tours/request/${selectedTourId}`
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

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  return (
    <>
      <div data-name="about-page" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">
            My Requested Tours
          </h1>

          <p className="text-center mb-6">
            Here you can view, edit, or delete your requested tours before they
            are approved or rejected by the admin.
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
                    Start Location
                  </th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    Estimated Budget
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
                    Updated At
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
                      <td className="py-3 px-4">
                        {tour.tourStartLocation || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {dayjs(tour.tourStartDate).format("DD/MM/YYYY")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {tour.estimatedBudget
                          ? tour.estimatedBudget.toFixed(2)
                          : "-"}
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
                        {dayjs(tour.updatedAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td className="py-3 px-4 flex space-x-3">
                        <button
                          onClick={() => handleEdit(tour)}
                          className={`flex items-center gap-1 cursor-pointer ${
                            tour.status === "Pending"
                              ? "text-blue-600 hover:text-blue-800"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={tour.status !== "Pending"}
                        >
                          Edit
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

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-center mb-4">
                  Edit Tour Request
                </h3>
                {/* Add tour request summary content here */}
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="rounded-2xl p-6 w-full max-w-3xl mx-auto">
                    <form onSubmit={handleEditTour} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block font-semibold mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            // required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.name}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm">
                              {errors.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            //required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.email}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block font-semibold mb-2">
                            Contact Number
                          </label>
                          <input
                            type="text"
                            name="contactNumber"
                            placeholder="Contact Number"
                            //required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.contactNumber}
                          />
                          {errors.contactNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.contactNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block font-semibold mb-2">
                            Start Location
                          </label>
                          <select
                            name="tourStartLocation"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            //required
                            onChange={handleChange}
                            value={formData.tourStartLocation}
                          >
                            <option value="">Select Tour Start Location</option>
                            {districts.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                          {errors.tourStartLocation && (
                            <p className="text-red-500 text-sm">
                              {errors.tourStartLocation}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold mb-2">
                            Tour Start Date
                          </label>
                          <input
                            type="date"
                            name="tourStartDate"
                            //required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.tourStartDate}
                          />
                          {errors.tourStartDate && (
                            <p className="text-red-500 text-sm">
                              {errors.tourStartDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block font-semibold mb-2">
                            Tour Duration (in days):
                          </label>
                          <input
                            type="number"
                            name="tourDuration"
                            placeholder="Tour Duration"
                            //required
                            min="1"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            value={formData.tourDuration}
                          />
                          {errors.tourDuration && (
                            <p className="text-red-500 text-sm">
                              {errors.tourDuration}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block font-semibold mb-2">
                            Tour Type
                          </label>
                          <select
                            name="tourType"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            //required
                            onChange={handleChange}
                            value={formData.tourType} // Set the selected label
                          >
                            {tourTypes.map((type) => (
                              <option key={type.label} value={type.label}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          {errors.tourType && (
                            <p className="text-red-500 text-sm">
                              {errors.tourType}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block font-semibold mb-2">
                            Number Of People
                          </label>
                          <input
                            type="number"
                            name="numberOfPeople"
                            value={formData.numberOfPeople}
                            min="1"
                            //required
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                          />
                          {errors.numberOfPeople && (
                            <p className="text-red-500 text-sm">
                              {errors.numberOfPeople}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Select Locations */}
                      <div>
                        <label className="block font-semibold mb-2">
                          Select Locations:
                        </label>
                        <div className="overflow-x-auto">
                          <div className="flex space-x-4">
                            {places.map((place) => (
                              <div
                                key={place.locationName}
                                onClick={() => handleLocationSelect(place)}
                                className={`flex-shrink-0 w-52 bg-white p-3 rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-95 ${
                                  formData.selectedLocations.some(
                                    (selectedPlace) =>
                                      selectedPlace.locationName ===
                                      place.locationName
                                  )
                                    ? "border-4 border-blue-500"
                                    : "border"
                                }`}
                              >
                                <img
                                  src={place.image}
                                  alt={place.locationName}
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                                <h3 className="text-md font-semibold">
                                  {place.locationName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {place.description}
                                </p>
                                <p className="mt-2 text-sm text-gray-600">
                                  Distance: {place.distance} km - Price: $
                                  {place.pricePerUnit} per unit
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {errors.selectedLocations && (
                          <p className="text-red-500 text-sm">
                            {errors.selectedLocations}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block font-semibold mb-2">
                            Note
                          </label>
                          <textarea
                            name="note"
                            placeholder="Enter your note..."
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                            onChange={handleChange}
                            value={formData.note}
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6 space-x-2">
                        <button
                          onClick={closeEditModal}
                          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Edit
                        </button>
                      </div>
                    </form>
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
