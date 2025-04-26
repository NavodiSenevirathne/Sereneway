import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tours');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch packages');
        }
        
        setPackages(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError(err.message || "Something went wrong. Please try again later.");
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tours/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete package');
      }
      
      // Remove the deleted package from state
      setPackages(packages.filter(pkg => pkg._id !== id));
      
    } catch (err) {
      console.error("Error deleting package:", err);
      alert(err.message || "Failed to delete package. Please try again.");
    }
  };

  const handleEdit = (packageId) => {
    // Set the editing ID to show loading state for this specific package
    setEditingId(packageId);
    
    // Check if package data exists before navigating
    const packageToEdit = packages.find(pkg => pkg._id === packageId);
    
    if (packageToEdit) {
      // Store the package data in sessionStorage for quick access on the edit page
      sessionStorage.setItem('editPackageData', JSON.stringify(packageToEdit));
      
      // Navigate to the edit page
      navigate(`/admin/edit-package/${packageId}`);
    } else {
      alert("Package data not found. Please refresh and try again.");
      setEditingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tour Packages</h1>
            <p className="text-gray-500 mt-1">Manage your tour packages</p>
          </div>
          <Link 
            to="/admin/create-package"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Package
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No packages yet</h2>
            <p className="text-gray-500 mb-6">Start by creating your first tour package</p>
            <Link 
              to="admin/create-package"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Package
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {packages.map((pkg) => (
                <div key={pkg._id} className="flex flex-col md:flex-row md:items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center flex-1">
                    <div className="h-16 w-24 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                      {pkg.imageUrls && pkg.imageUrls[0] ? (
                        <img 
                          src={pkg.imageUrls[0]} 
                          alt={pkg.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="md:ml-4 mt-2 md:mt-0">
                      <Link to={`/tour_packages/${pkg._id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {pkg.title}
                      </Link>
                      
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {pkg.address}
                        </span>
                        
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {pkg.days} days
                        </span>
                        
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Max {pkg.maxGroupSize} people
                        </span>
                        
                        {pkg.discountedPrice > 0 ? (
  <>
    <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5 line-through">
      Rs. {pkg.regularPrice.toLocaleString()}
    </span>
    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-0.5 ml-2">
      Rs. {pkg.discountedPrice.toLocaleString()}
    </span>
  </>
) : (
  <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-0.5">
    Rs. {pkg.regularPrice.toLocaleString()}
  </span>
)}


                        
                        {pkg.featured && (
                          <span className="inline-flex items-center text-xs font-medium text-yellow-700 bg-yellow-50 rounded-full px-2.5 py-0.5">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
                      disabled={editingId === pkg._id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      DELETE
                    </button>
                    <button
                      onClick={() => handleEdit(pkg._id)}
                      className={`inline-flex items-center ${editingId === pkg._id ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-800'} text-sm font-medium focus:outline-none`}
                      disabled={editingId === pkg._id}
                    >
                      {editingId === pkg._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500 mr-1"></div>
                          EDITING...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          EDIT
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}