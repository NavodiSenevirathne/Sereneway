import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Room prices and capacities
const roomPrices = {
  normal: { single: 5000, double: 8000, family: 12000 },
  luxury: { single: 8000, double: 12000, family: 18000 }
};
const roomCapacities = { single: 1, double: 2, family: 4 };

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tourId, tourTitle, packagePrice, maxGroupSize } = location.state || {};
  
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      roomCategory: "normal",
      roomType: "single",
      roomCount: 1,
      adults: 1,
      children: 0,
      fullName: "",
      nic: ""
    }
  });

  const [remaining, setRemaining] = useState(maxGroupSize);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
 

  const roomCategory = watch("roomCategory");
  const roomType = watch("roomType");
  const roomCount = Number(watch("roomCount") || 1);
  const adults = Number(watch("adults") || 0);
  const children = Number(watch("children") || 0);

  // Fetch remaining capacity on load
  useEffect(() => {
    if (!tourId) {
      navigate('/user/tours');
      return;
    }
    
    const fetchCapacity = async () => {
      try {
        const res = await axios.get(`/api/bookings/capacity/${tourId}`);
        setRemaining(res.data.remaining);
      } catch {
        setRemaining(maxGroupSize);
      }
    };
    fetchCapacity();
  }, [tourId, maxGroupSize, navigate]);



  // Calculate price whenever inputs change
  useEffect(() => {
    if (!roomCategory || !roomType) return;
    const roomPrice = roomPrices[roomCategory][roomType];
    const packageTotal = adults * packagePrice + children * packagePrice * 0.5;
    const roomTotal = roomCount * roomPrice;
    setTotalPrice(packageTotal + roomTotal);
  }, [roomCategory, roomType, roomCount, adults, children, packagePrice]);

  // Update recommended room count when people count changes
  useEffect(() => {
    const totalMembers = adults + children;
    const roomCapacity = roomCapacities[roomType];
    const recommendedRooms = Math.ceil(totalMembers / roomCapacity);
    
    if (recommendedRooms > roomCount) {
      setValue("roomCount", recommendedRooms);
    }
  }, [adults, children, roomType, setValue, roomCount]);

  const onSubmit = async (data) => {
    // Show confirmation alert
    if (!window.confirm("Are you sure you want to confirm this booking? Click OK to proceed.")) {
      return; // If user clicks Cancel, stop the submission
    }
    
    setLoading(true);
    setSubmitError(null);
    try {
      await axios.post("/api/bookings", {
        tour: tourId,
        roomType: {
          category: data.roomCategory,
          subType: data.roomType
        },
        rooms: Number(data.roomCount),
        adults: Number(data.adults),
        children: Number(data.children),
        fullName: data.fullName,
        nic: data.nic,
        totalPrice
      });
      
      // Show success alert
      alert("Booking confirmed successfully!");
      navigate("/user/my-bookings");
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Booking failed");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Tour Package
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Complete your booking details below
          </p>
        </div>


        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with premium gradient background */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 text-white relative">
            <h2 className="text-2xl font-bold tracking-tight">{tourTitle}</h2>
            
            <p className="text-emerald-50 mt-1.5 text-base opacity-90">Fill in the information to secure your tour</p>
            
            {/* Capacity badge with premium styling */}
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="font-medium">{remaining} slots left</span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Booking Form */}
            <div className="lg:w-3/5 p-6">

              {submitError && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium flex items-center border border-red-100 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {submitError}
                </div>
              )}
              
              {/* Limited availability banner with premium styling */}
              {remaining < 5 && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Limited Availability!</h3>
                      <div className="mt-1 text-sm text-red-700">
                        Only {remaining} spots left for this tour package. Book now to secure your place.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Child pricing notice with premium styling */}
              <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg text-sm flex items-start border border-emerald-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium">Special offer for families!</span> Children (5-12 years) are charged at <span className="font-semibold">half price</span> for the tour package.
                </div>
              </div>
              
              {/* Capacity Indicator with premium styling */}
              <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">Tour Availability</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    remaining < 5 ? 'bg-red-100 text-red-800' : 
                    remaining < 10 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {remaining < 5 ? 'Limited' : remaining < 10 ? 'Filling up' : 'Available'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${
                      remaining < 5 ? 'bg-red-500' : 
                      remaining < 10 ? 'bg-yellow-500' : 
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (remaining / maxGroupSize) * 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{remaining} slots remaining</span>
                  <span>Total capacity: {maxGroupSize}</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Room Selection with premium styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Room Category</label>
                    <div className="relative">
                      <select
                        {...register("roomCategory", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-8 text-base shadow-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="luxury">Luxury</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.roomCategory && (
                      <span className="text-red-500 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Room category is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Room Type</label>
                    <div className="relative">
                      <select
                        {...register("roomType", { required: true })}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-8 text-base shadow-sm"
                      >
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="family">Family</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.roomType && (
                      <span className="text-red-500 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Room type is required
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Number of Rooms - New Addition */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Rooms
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      {...register("roomCount", {
                        required: true,
                        min: 1,
                        valueAsNumber: true
                      })}
                      className="w-full pl-9 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm"
                    />
                  </div>
                  {errors.roomCount && (
                    <span className="text-red-500 text-xs mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      At least 1 room is required
                    </span>
                  )}
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Recommended: {Math.ceil((adults + children) / roomCapacities[roomType])} rooms for {adults + children} people
                  </div>
                </div>
                
                {/* Room Pricing Information with premium styling */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Room Pricing</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg transition-all duration-200 ${roomCategory === 'normal' && roomType === 'single' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                      <div className="font-medium">Normal Single</div>
                      <div className="text-gray-600">Rs. {roomPrices.normal.single.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {roomCapacities.single} person</div>
                    </div>
                    <div className={`p-3 rounded-lg transition-all duration-200 ${roomCategory === 'normal' && roomType === 'double' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                      <div className="font-medium">Normal Double</div>
                      <div className="text-gray-600">Rs. {roomPrices.normal.double.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {roomCapacities.double} people</div>
                    </div>
                    <div className={`p-3 rounded-lg transition-all duration-200 ${roomCategory === 'normal' && roomType === 'family' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                      <div className="font-medium">Normal Family</div>
                      <div className="text-gray-600">Rs. {roomPrices.normal.family.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {roomCapacities.family} people</div>
                    </div>
                    <div className={`p-3 rounded-lg transition-all duration-200 ${roomCategory === 'luxury' && roomType === 'single' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                      <div className="font-medium">Luxury Single</div>
                      <div className="text-gray-600">Rs. {roomPrices.luxury.single.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {roomCapacities.single} person</div>
                    </div>
                    <div className={`p-3 rounded-lg transition-all duration-200 ${roomCategory === 'luxury' && roomType === 'double' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                      <div className="font-medium">Luxury Double</div>
                      <div className="text-gray-600">Rs. {roomPrices.luxury.double.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {roomCapacities.double} people</div>
                    </div>
                    <div className={`p-3 rounded-lg transition-all duration-200 ${roomCategory === 'luxury' && roomType === 'family' ? 'bg-emerald-50 border border-emerald-200 shadow-sm' : 'bg-white border border-gray-100'}`}>
                      <div className="font-medium">Luxury Family</div>
                      <div className="text-gray-600">Rs. {roomPrices.luxury.family.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Capacity: {roomCapacities.family} people</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                    <span className="text-emerald-600 font-medium">Selected room:</span> {roomCategory} {roomType} - Rs. {roomPrices[roomCategory][roomType].toLocaleString()} × {roomCount} = Rs. {(roomPrices[roomCategory][roomType] * roomCount).toLocaleString()}
                  </div>
                </div>
                
                {/* Members with premium styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Adults (12+ years)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        {...register("adults", {
                          required: true,
                          min: 1,
                          max: remaining
                        })}
                        className="w-full pl-9 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm"
                      />
                    </div>
                    {errors.adults && (
                      <span className="text-red-500 text-xs mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        At least 1, max {remaining}
                      </span>
                    )}
                    <div className="text-xs text-gray-600 mt-1">
                      Rs. {packagePrice.toLocaleString()} per adult
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Children (5-12 years)
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
  </svg>
</div>
<input
  type="number"
  {...register("children", {
    required: false,
    min: 0,
    max: remaining - adults
  })}
  className="w-full pl-9 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm"
/>
</div>
{errors.children && (
  <span className="text-red-500 text-xs mt-1 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    Max {remaining - adults} children
  </span>
)}
<div className="text-xs text-gray-600 mt-1">
  Rs. {(packagePrice * 0.5).toLocaleString()} per child (half price)
</div>
</div>
</div>

{/* Personal Information */}
<div className="space-y-4 mt-6">
  <h3 className="font-medium text-gray-800">Personal Information</h3>
  
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      Full Name
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        {...register("fullName", { required: true })}
        className="w-full pl-9 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm"
        placeholder="Enter your full name"
      />
    </div>
    {errors.fullName && (
      <span className="text-red-500 text-xs mt-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Full name is required
      </span>
    )}
  </div>
  
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      NIC Number
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-6H7v2h6V7zm0 4H7v2h6v-2zm0 4H7v2h6v-2zm4-4h-1v2h1v-2zm0 4h-1v2h1v-2zM9 5H7v2h2V5z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        {...register("nic", { 
          required: true,
          pattern: /^[0-9]{12}$|^[0-9]{9}[vV]$/
        })}
        className="w-full pl-9 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm"
        placeholder="Enter your NIC number"
      />
    </div>
    {errors.nic && (
      <span className="text-red-500 text-xs mt-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Valid NIC number is required (12 digits or 9 digits followed by 'v')
      </span>
    )}
  </div>
</div>

{/* Submit buttons */}
<div className="mt-8 flex flex-col sm:flex-row gap-4">
  <button
    type="submit"
    disabled={loading}
    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
  >
    {loading ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </>
    ) : (
      'Confirm Booking'
    )}
  </button>
  <button
    type="button"
    onClick={handleCancel}
    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
  >
    Cancel
  </button>
</div>
</form>
</div>

{/* Right Side - Booking Summary */}
<div className="lg:w-2/5 p-6 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
  
  <div className="space-y-4">
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Tour Package:</span>
        
        <span className="font-medium">Rs. {packagePrice.toLocaleString()} × {adults} adults</span>
      </div>
      {children > 0 && (
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Children (Half Price):</span>
          <span className="font-medium">Rs. {(packagePrice * 0.5).toLocaleString()} × {children} children</span>
        </div>
      )}
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Room Charges:</span>
        <span className="font-medium">Rs. {(roomPrices[roomCategory][roomType] * roomCount).toLocaleString()}</span>
      </div>
      <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
        <span className="font-medium text-gray-700">Total Amount:</span>
        <span className="font-bold text-green-600">Rs. {totalPrice.toLocaleString()}</span>
      </div>
    </div>
    
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h4 className="font-medium text-gray-800 mb-2">Booking Details</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Room Type:</span>
          <span className="font-medium capitalize">{roomCategory} {roomType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Number of Rooms:</span>
          <span className="font-medium">{roomCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Adults:</span>
          <span className="font-medium">{adults}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Children:</span>
          <span className="font-medium">{children}</span>
        </div>
      </div>
    </div>
    
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm">
      <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
      <ul className="space-y-1 text-yellow-700">
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1.5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Payment will be collected at the tour office
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1.5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Please bring your NIC/passport for verification
        </li>
        <li className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1.5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Free cancellation up to 48 hours before the tour
        </li>
      </ul>
    </div>
  </div>
</div>
</div>
</div>
</div>
</div>
  )}
