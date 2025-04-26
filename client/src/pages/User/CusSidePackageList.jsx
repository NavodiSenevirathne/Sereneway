import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CustomerPackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    duration: [],
    featured: false
  });

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

  // Filter packages based on search term and filters
  const filteredPackages = packages.filter(pkg => {
    // Search term filter
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pkg.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range filter
    const matchesPrice = pkg.regularPrice >= filters.priceRange[0] && 
                         pkg.regularPrice <= filters.priceRange[1];
    
    // Duration filter
    const matchesDuration = filters.duration.length === 0 || 
                            filters.duration.includes(pkg.days <= 3 ? 'short' : 
                                                     pkg.days <= 7 ? 'medium' : 'long');
    
    // Featured filter
    const matchesFeatured = !filters.featured || pkg.featured;
    
    return matchesSearch && matchesPrice && matchesDuration && matchesFeatured;
  });

  const handleDurationFilter = (duration) => {
    setFilters(prev => {
      const newDuration = [...prev.duration];
      
      if (newDuration.includes(duration)) {
        // Remove the duration if already selected
        return {
          ...prev,
          duration: newDuration.filter(d => d !== duration)
        };
      } else {
        // Add the duration if not selected
        return {
          ...prev,
          duration: [...newDuration, duration]
        };
      }
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      priceRange: [0, 100000],
      duration: [],
      featured: false
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner with Search */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"}}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover Amazing Tour Packages</h1>
            <p className="text-green-100 text-lg max-w-3xl mx-auto">Explore the world's most beautiful destinations with our premium tour packages</p>
          </div>
          
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white p-1 rounded-lg shadow-lg flex flex-col sm:flex-row">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border-0 focus:ring-0 text-gray-900 placeholder-gray-500 rounded-lg"
                  placeholder="Search destinations, attractions, or tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="mt-2 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-2"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Packages
            </h2>
            <button 
              onClick={resetFilters}
              className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Rs.</span>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="ml-2 text-gray-700 font-medium">{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            
            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDurationFilter('short')}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${filters.duration.includes('short') 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                >
                  Short (1-3 days)
                </button>
                <button
                  onClick={() => handleDurationFilter('medium')}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${filters.duration.includes('medium') 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                >
                  Medium (4-7 days)
                </button>
                <button
                  onClick={() => handleDurationFilter('long')}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${filters.duration.includes('long') 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}`}
                >
                  Long (8+ days)
                </button>
              </div>
            </div>
            
            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Filters</label>
              <div className="flex items-center">
                <input
                  id="featured"
                  type="checkbox"
                  checked={filters.featured}
                  onChange={() => setFilters({...filters, featured: !filters.featured})}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured packages only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results section */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No packages found</h2>
            <p className="text-gray-500 mb-6">Try adjusting your filters to find available tour packages</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Tours</h2>
              <p className="text-gray-500">
                <span className="font-semibold text-green-600">{filteredPackages.length}</span> packages found
              </p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <Link to={`/user/tours/${pkg._id}`} key={pkg._id} className="group">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      {pkg.imageUrls && pkg.imageUrls[0] ? (
                        <img 
                          src={pkg.imageUrls[0]} 
                          alt={pkg.title} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {pkg.featured && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-800 text-xs font-bold px-2.5 py-1.5 rounded-md shadow-sm">
                          Featured
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="font-bold text-xl text-white group-hover:text-green-100 transition-colors truncate">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-green-100">{pkg.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center text-xs font-medium bg-green-50 text-green-700 rounded-full px-2.5 py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {pkg.days} days
                          </span>
                          
                          <span className="inline-flex items-center text-xs font-medium bg-green-50 text-green-700 rounded-full px-2.5 py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Max {pkg.maxGroupSize} people
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-500 text-sm">Per Person</span>
                            {pkg.discountedPrice > 0 ? (
                              <div className="flex flex-col">
                                <p className="text-sm text-gray-500 line-through">
                                  Rs. {pkg.regularPrice.toLocaleString()}
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                  Rs. {pkg.discountedPrice.toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xl font-bold text-green-600">
                                Rs. {pkg.regularPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
