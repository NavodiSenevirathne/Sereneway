import axios from "axios";
import React, { useEffect, useState } from "react";
import { districts } from "../../assets/data/districts";
import { places } from "../../assets/data/places";
import { tourTypes } from "../../assets/data/tourTypes";
import Alert from "../../components/Alert";

export default function RequestTour() {
  const email = localStorage.getItem("email");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successData, setSuccessData] = useState();
  const [alert, setAlert] = useState(null);

  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState([]);
  const [accommodationCost, setAccommodationCost] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    tourStartLocation: "",
    tourStartDate: "",
    selectedLocations: [],
    numberOfPeople: 1,
    tourType: tourTypes[0],
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

    if (!formData.tourType || !formData.tourType.label)
      newErrors.tourType = "Tour type is required";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        const response = await axios.post(
          `${
            apiUrl
              ? ` ${apiUrl}/api/customize-tours/request`
              : `http://localhost:5000/api/customize-tours/request`
          }`,
          {
            ...formData,
            tourType: formData.tourType.label,
            basePricePerPerson: formData.tourType.basePricePerPerson,
            userId: email,
          }
        );

        if (response.data.success) {
          setFormSubmitted(true);
          setSuccessData(response.data.data);
          setAlert({
            message: "Tour request submitted successfully!",
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
            tourType: tourTypes[0],
            tourDuration: 1,
          });
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

  const handleNewRequest = () => {
    setEstimatedBudget(0);
    setAccommodationCost(0);
    setCostBreakdown([]);
    setFormSubmitted(false);
  };

  useEffect(() => {
    if (!formData) return; // Ensure formData exists

    const {
      selectedLocations = [],
      tourType,
      numberOfPeople,
      tourDuration,
      tourStartDate: startDate,
    } = formData;

    if (!tourType || !startDate || numberOfPeople <= 0 || tourDuration <= 0) {
      console.warn("Invalid tour data, skipping calculations.");
      return;
    }

    const basePricePerPerson = Number(tourType.basePricePerPerson) || 0;

    // ✅ Step 4: Calculate Estimated Budget & Travel Time
    let totalDistance = 0;
    let totalTravelCost = 0;
    const costBreakdown = [];

    selectedLocations.forEach((location) => {
      if (!location.distance || !location.pricePerUnit) return;

      const locationCost =
        Number(location.distance) * Number(location.pricePerUnit);
      totalTravelCost += locationCost;
      totalDistance += Number(location.distance);

      costBreakdown.push({
        locationName: location.locationName,
        distance: Number(location.distance),
        cost: locationCost.toFixed(2),
      });
    });

    // Accommodation & food cost
    const accommodationCost =
      basePricePerPerson * numberOfPeople * tourDuration;

    // Final estimated budget (Travel + Accommodation)
    const estimatedBudget = (totalTravelCost + accommodationCost).toFixed(2);

    // ✅ Step 5: Estimate total travel time (assuming 60 km/h avg speed)
    const estimatedTimeHours = totalDistance / 60;

    // ✅ Step 6: Calculate estimated end date
    const estimatedEndDate = new Date(startDate);
    estimatedEndDate.setDate(estimatedEndDate.getDate() + Number(tourDuration));

    console.log({
      estimatedBudget,
      estimatedTimeHours: estimatedTimeHours.toFixed(2),
      estimatedEndDate: estimatedEndDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
      costBreakdown,
    });

    setEstimatedBudget(estimatedBudget);
    setAccommodationCost(accommodationCost);
    setCostBreakdown(costBreakdown);
  }, [formData]); // ✅ Now formData updates correctly

  return (
    <>
      <div data-name="request-tour-page" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Right side - Form */}
          <div className="w-full">
            <h1 className="text-4xl font-bold text-center mb-12">
              Request a Tour
            </h1>
            <p className="text-center mb-6">
              Fill in the details below to request a personalized tour. Provide
              your contact information, tour preferences, and select your
              desired locations to create a tailored tour experience. Once the
              request is submitted, you will receive a confirmation email.
            </p>
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Email</label>
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
                      <p className="text-red-500 text-sm">{errors.email}</p>
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
                      value={formData.tourType.label} // Set the selected label
                    >
                      {tourTypes.map((type) => (
                        <option key={type.label} value={type.label}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.tourType && (
                      <p className="text-red-500 text-sm">{errors.tourType}</p>
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

                <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Cost Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-700">
                        Accommodation Cost
                      </p>
                      <p className="text-lg text-blue-600">
                        ${accommodationCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-700">
                        Travel Cost Breakdown
                      </p>
                      <div className="mt-2 space-y-2">
                        {costBreakdown.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm text-gray-700"
                          >
                            <span>{item.locationName}</span>
                            <span>${item.cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-700">
                        Total Estimated Budget
                      </p>
                      <p className="text-lg text-blue-600">
                        ${estimatedBudget}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Note</label>
                    <textarea
                      name="note"
                      placeholder="Enter your note..."
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                      onChange={handleChange}
                      value={formData.note}
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                >
                  Submit Request
                </button>
              </form>
            ) : (
              <>
                {successData && (
                  <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mx-auto mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Tour Request Summary
                    </h2>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {successData.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {successData.email}
                      </p>
                      <p>
                        <span className="font-medium">
                          Tour Start Location:
                        </span>{" "}
                        {successData.tourStartLocation}
                      </p>
                      <p>
                        <span className="font-medium">Tour Start Date:</span>{" "}
                        {new Date(
                          successData.tourStartDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {successData.tourDuration} days
                      </p>
                      <p>
                        <span className="font-medium">Estimated Budget:</span> $
                        {successData.estimatedBudget}
                      </p>
                      <p>
                        <span className="font-medium">Additional Note:</span>{" "}
                        {successData.note}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">
                      Locations
                    </h3>
                    <ul className="mt-2 space-y-2 text-gray-700">
                      {successData.selectedLocations.map((location) => (
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
                      {successData.summary}
                    </p>

                    <p className="mt-4 text-sm text-gray-600">
                      <strong>Process:</strong> This request will be reviewed by
                      the admin. You will receive an email with the status
                      within 2 business days.
                    </p>

                    <button
                      onClick={handleNewRequest}
                      className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      Make Another Request for a Tour
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* alert  */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}
