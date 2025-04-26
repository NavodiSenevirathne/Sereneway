// components/AdminHeader.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminHeader() {
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/admin/tour_packages" className="text-xl font-bold">
              Admin Dashboard
            </Link>
          </div>
          
          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-1 md:space-x-4">
              <li>
                <Link 
                  to="/admin/tour_packages" 
                  className={`px-3 py-2 rounded-md text-sm font-medium block ${
                    isActive('/admin/tour_packages') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/create-package" 
                  className={`px-3 py-2 rounded-md text-sm font-medium block ${
                    isActive('/admin/create-package') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Create Package
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/bookings" 
                  className={`px-3 py-2 rounded-md text-sm font-medium block ${
                    isActive('/admin/bookings') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Bookings
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/reports/tour-performance" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white block"
                >
                 Reports
                </Link>

              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
