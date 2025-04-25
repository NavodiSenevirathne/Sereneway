import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function PackageDetails() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tours/get/${id}`);
        
        // Check response type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`API returned non-JSON response: ${contentType}`);
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `Failed to fetch package details: ${response.status}`);
        }
        
        setPackageData(data.data || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError(`${err.message || "Something went wrong. Please try again later."} (Status: ${err.status || "unknown"})`);
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tours/${id}`, {
        method: 'DELETE'
      });
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`API returned non-JSON response: ${contentType}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete package');
      }
      
      // Redirect to package list after successful deletion
      navigate('/admin/tour_packages');
      
    } catch (err) {
      console.error("Error deleting package:", err);
      alert(err.message || "Failed to delete package. Please try again.");
    }
  };

  const handleEdit = () => {
    // Store the package data in sessionStorage for quick access on the edit page
    sessionStorage.setItem('editPackageData', JSON.stringify(packageData));
    
    // Navigate to the edit page
    navigate(`/admin/edit-package/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error Loading Package</h2>
            <p>{error}</p>
            <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-4 rounded border border-gray-200 mb-4">
              <p className="font-medium mb-1">Troubleshooting Tips:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check if the API endpoint is correct (/api/tours/{id})</li>
                <li>Verify that backend server is running</li>
                <li>Ensure the package ID in the URL is valid</li>
                <li>Check if the API returns JSON format</li>
              </ul>
            </div>
            <Link 
              to="/admin/tour_packages"
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Return to Package List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Package Not Found</h2>
          <p className="text-gray-500 mb-6">The tour package you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/admin/tour_packages"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Return to Package List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Admin controls and header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <Link to="/tour_packages" className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Packages
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{packageData.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Package
            </button>
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Package
            </button>
          </div>
        </div>
        
        {/* Main content container */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          {/* Image gallery */}
          <div className="p-4 md:p-6">
            {packageData.imageUrls && packageData.imageUrls.length > 0 ? (
              <div>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                <img 
  src={packageData.imageUrls[activeImage]} 
  alt={`${packageData.title} - Image ${activeImage + 1}`} 
  className="w-96 h-64 object-cover rounded-sm mx-auto" 
/>

                </div>
                
                {packageData.imageUrls.length > 1 && (
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {packageData.imageUrls.map((url, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 ${index === activeImage ? 'border-blue-500' : 'border-transparent'}`}
                      >
                        <img 
                          src={url} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Package details */}
          <div className="p-4 md:p-6 pt-0">
            {/* Status and basic info */}
            <div className="flex flex-wrap gap-2 mb-4">
              {packageData.featured && (
                <span className="inline-flex items-center text-sm font-medium text-yellow-700 bg-yellow-50 rounded-full px-3 py-1">
                  Featured
                </span>
              )}
              
              <span className="inline-flex items-center text-sm font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1">
                {packageData.days} days
              </span>
              
              <span className="inline-flex items-center text-sm font-medium text-purple-700 bg-purple-50 rounded-full px-3 py-1">
                Max {packageData.maxGroupSize} people
              </span>
            </div>
            
            {/* Price section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Pricing</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div>
                  <span className="text-sm text-gray-500">Regular Price:</span>
                  <span className={`ml-2 font-medium ${packageData.discountedPrice > 0 ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    Rs. {packageData.regularPrice.toLocaleString()}
                  </span>
                </div>
                
                {packageData.discountedPrice > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Discounted Price:</span>
                    <span className="ml-2 font-medium text-green-600">
                      Rs. {packageData.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {packageData.discountedPrice > 0 && (
                  <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    Save {Math.round(((packageData.regularPrice - packageData.discountedPrice) / packageData.regularPrice) * 100)}%
                  </div>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <div className="whitespace-pre-wrap prose prose-sm max-w-none text-gray-700">
                <p>{packageData.description}</p>
              </div>
            </div>
            
            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Location */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Location</h2>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-gray-900">{packageData.address}</div>
                    {packageData.area && (
                      <div className="text-gray-600 text-sm mt-1">{packageData.area}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Start Dates */}
              {packageData.startDates && packageData.startDates.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Start Dates</h2>
                  <div className="flex flex-wrap gap-2">
                    {packageData.startDates.map((date, index) => (
                      <div key={index} className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Itinerary */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Itinerary</h2>
                <div className="border rounded-lg overflow-hidden">
                  {packageData.itinerary.map((day, index) => (
                    <div key={index} className={`p-4 ${index !== packageData.itinerary.length - 1 ? 'border-b' : ''}`}>
                      <h3 className="font-medium text-gray-900 mb-2">Day {index + 1}: {day.title}</h3>
                      <p className="text-gray-700 text-sm">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Includes/Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Includes */}
              {packageData.includes && packageData.includes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">What's Included</h2>
                  <ul className="space-y-2">
                    {packageData.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Excludes */}
              {packageData.excludes && packageData.excludes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">What's Excluded</h2>
                  <ul className="space-y-2">
                    {packageData.excludes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Additional information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Additional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium text-gray-900">{packageData.days} days</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Group Size</div>
                    <div className="font-medium text-gray-900">Max {packageData.maxGroupSize} people</div>
                  </div>
                </div>
                
                {packageData.difficulty && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-500">Difficulty</div>
                      <div className="font-medium text-gray-900 capitalize">{packageData.difficulty}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Created On</div>
                    <div className="font-medium text-gray-900">
                      {new Date(packageData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
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