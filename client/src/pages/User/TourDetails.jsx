import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import CartModal from "../../components/CartModal";

export default function TourPackageDetails() {
  const { id } = useParams();
  const [tourPackage, setTourPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const navigate = useNavigate();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tours/get/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch tour details');
        }
        
        setTourPackage(data.data || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tour details:", err);
        setError(err.message || "Something went wrong. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchTourDetails();
    }
  }, [id]);

  const nextSlide = () => {
    if (tourPackage?.imageUrls?.length) {
      setActiveSlide((prev) => (prev === tourPackage.imageUrls.length - 1 ? 0 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (tourPackage?.imageUrls?.length) {
      setActiveSlide((prev) => (prev === 0 ? tourPackage.imageUrls.length - 1 : prev - 1));
    }
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const handleBookNow = () => {
    // Navigate to booking page with the necessary parameters
    navigate(`/user/tours/${id}/booking`, { 
      state: { 
        tourId: id,
        tourTitle: tourPackage.title,
        packagePrice: tourPackage.discountPrice > 0 ? tourPackage.discountPrice : tourPackage.regularPrice,
        maxGroupSize: tourPackage.maxGroupSize
      } 
    });
  };

  const handleNotifyMe = () => {
    setIsCartModalOpen(true);
  };

  const incrementGuests = () => {
    if (guestCount < (tourPackage?.maxGroupSize || 10)) {
      setGuestCount(prev => prev + 1);
    }
  };

  const decrementGuests = () => {
    if (guestCount > 1) {
      setGuestCount(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/tours" className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  // Tour not found
  if (!tourPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tour Not Found</h2>
          <p className="text-gray-500 mb-6">The tour package you're looking for does not exist or has been removed.</p>
          <Link to="/tours" className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb navigation */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/user/tours" className="text-gray-500 hover:text-gray-700 transition-colors">Tours</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-green-600 font-medium">{tourPackage.title}</span>
          </nav>
        </div>
      </div>

      {/* Full-width image slider */}
      <div className="relative h-96 md:h-128 w-full overflow-hidden bg-black">
        {tourPackage.imageUrls && tourPackage.imageUrls.length > 0 ? (
          <>
            <div className="absolute inset-0 flex transition-transform duration-500 ease-out" 
                 style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
              {tourPackage.imageUrls.map((img, index) => (
                <div key={index} className="h-full w-full flex-shrink-0">
                  <img 
                    src={img} 
                    alt={`${tourPackage.title} view ${index + 1}`} 
                    className="h-full w-full object-cover object-center opacity-90"
                  />
                </div>
              ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 backdrop-blur-sm focus:outline-none transition-all duration-200"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 backdrop-blur-sm focus:outline-none transition-all duration-200"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-6 right-6 bg-black/30 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              {activeSlide + 1} / {tourPackage.imageUrls.length}
            </div>
            
            {/* Slide indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {tourPackage.imageUrls.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 w-6 rounded-full focus:outline-none transition-all duration-300 ${
                    activeSlide === index ? 'bg-white w-8' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Featured tag  */}
            {tourPackage.featured && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-bold px-3 py-1.5 rounded-full text-xs tracking-wide shadow-lg">
                FEATURED
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-800 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Tour details section */}
      <div className="max-w-7xl mx-auto px-4 relative -mt-16 z-10 sm:px-6 lg:px-8">
        {/* Tour headline card - floating above */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{tourPackage.title}</h1>
              <div className="flex items-center mb-3 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{tourPackage.address}</span>
              </div>
              
              {/* Rating and reviews */}
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ${star <= 4.5 ? 'text-yellow-400' : 'text-gray-300'}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.5 (128 reviews)</span>
              </div>
            </div>

            <div className="flex flex-col bg-green-50 p-5 rounded-xl md:text-right md:min-w-48">
              <div className="flex items-baseline justify-between md:justify-end md:flex-col">
                <span className="text-sm text-gray-500 font-medium mr-2 md:mb-1">Price per person</span>
                <div className="flex flex-col md:items-end">
                  <span className="text-3xl font-bold text-green-600">Rs. {tourPackage.regularPrice.toLocaleString()}</span>
                  {tourPackage.discountPrice > 0 && (
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-red-500 line-through">Rs. {tourPackage.regularPrice.toLocaleString()}</span>
                      <span className="ml-2 text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5 font-semibold">
                        Save {Math.round(((tourPackage.regularPrice - tourPackage.discountPrice) / tourPackage.regularPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {/* Tour highlights cards */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-b">
                <div className="p-5 text-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">Duration</h3>
                  <p className="font-bold text-gray-900">{tourPackage.days} days</p>
                </div>
                <div className="p-5 text-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">Group Size</h3>
                  <p className="font-bold text-gray-900">Max {tourPackage.maxGroupSize}</p>
                </div>
                <div className="p-5 text-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">Tour Type</h3>
                  <p className="font-bold text-gray-900">{tourPackage.tourType || "Standard"}</p>
                </div>
                <div className="p-5 text-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-sm text-gray-500 font-medium mb-1">Languages</h3>
                  <p className="font-bold text-gray-900">{tourPackage.languages?.join(", ") || "English/Sinhala"}</p>
                </div>
              </div>
              
              {/* Tour description */}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">About This Tour</h2>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-8">{tourPackage.description}</p>
                
                {/* Image gallery - more modern layout */}
                {tourPackage.imageUrls && tourPackage.imageUrls.length > 1 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {tourPackage.imageUrls.map((img, index) => (
                        <button 
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`relative aspect-square overflow-hidden rounded-lg group ${activeSlide === index ? 'ring-2 ring-green-500' : ''}`}
                        >
                          <img 
                            src={img} 
                            alt={`${tourPackage.title} gallery ${index + 1}`} 
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Itinerary section */}
            {tourPackage.itinerary && tourPackage.itinerary.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5">Your Journey</h2>
                  <div className="space-y-8">
                    {tourPackage.itinerary.map((day, index) => (
                      <div key={index} className="relative pl-10 pb-6 border-l-2 border-green-200 last:border-0 last:pb-0 transition-all duration-300 hover:pl-12">
                        <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold transform -translate-x-1/2 shadow-md">
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Day {index + 1}</h3>
                        <p className="text-gray-500 leading-relaxed">{day}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="p-8">
                <h2 className="text-xl text-gray-900 mb-5">CONTACT US FOR MORE DETAILS</h2>
                <h3 className="text-xl text-gray-500 mb-5">+94 3445 234 12</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar for booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Tour</h3>
                
                <div className="space-y-4 mb-6">
                  {/* Base Price */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-700">Base Price</span>
                    <span className="font-medium">Rs. {tourPackage.regularPrice.toLocaleString()}</span>
                  </div>
                  
                  {/* Discount Section (Only Shown if Discount Exists) */}
                  {tourPackage.discountedPrice > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-700">Discounted Price</span>
                      <span className="font-medium text-red-500">
                        Rs. {tourPackage.discountedPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {/* Shows Discounted Price If Available, Else Regular Price */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-700 font-semibold">Total</span>
                    <span className="font-semibold text-green-600">
                      Rs. {(tourPackage.discountedPrice > 0 ? tourPackage.discountedPrice : tourPackage.regularPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleBookNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Book Now
                  </button>

                  <button 
                    onClick={handleNotifyMe}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                    </svg>
                    Notify me
                  </button>

                  <CartModal
                    isOpen={isCartModalOpen}
                    onClose={() => setIsCartModalOpen(false)}
                    tourId={id}
                    tourTitle={tourPackage.title}
                    packagePrice={tourPackage.discountedPrice || tourPackage.regularPrice}
                    maxGroupSize={tourPackage.maxGroupSize}
                  />
                  
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-medium text-gray-700 mb-3">Important Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Booking must be made at least 7 days in advance</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Passport or ID required for verification</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2">Cancellation Policy</h4>
                    <p className="text-sm text-gray-600">
                      Free cancellation up to 48 hours before the start of the tour. 50% refund for cancellations 24-48 hours in advance. No refund for cancellations less than 24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
