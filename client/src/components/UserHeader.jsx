// components/UserHeader.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function UserHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  
  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              SereneWay
            </Link>
          </div>
          
          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center">
          
            
            
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link 
                  to="/user/tours" 
                  className={`text-sm font-medium ${
                    isActive('/user/tours') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link 
                  to="/user/my-bookings" 
                  className={`text-sm font-medium ${
                    isActive('/user/my-bookings') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Home
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          <nav className="flex flex-col space-y-2 pb-3 pt-2">
            <Link 
              to="/user/tours" 
              className={`px-3 py-2 rounded-md text-base font-medium ${
                isActive('/user/tours') ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tour Packages
            </Link>
            <Link 
              to="/user/my-bookings" 
              className={`px-3 py-2 rounded-md text-base font-medium ${
                isActive('/user/my-bookings') ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
              
          </nav>
        </div>
      </div>
    </header>
  );
}
