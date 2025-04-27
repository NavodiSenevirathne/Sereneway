import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow-sm px-6 py-3">
      <div className="flex justify-between items-center">
        
        
      <div className="hidden md:flex space-x-6 justify-end">
          <Link to="/admin" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link to="/admin/users" className="text-gray-600 hover:text-blue-600">Users</Link>
          <Link to="/admin/create-package" className="text-gray-600 hover:text-blue-600">Create Tour Package</Link>
          <Link to="/admin/tour_packages" className="text-gray-600 hover:text-blue-600">Tour Packages</Link>
          <Link to="/admin/reports/tour-performance" className="text-gray-600 hover:text-blue-600">Package Performance</Link>
          <Link to="/admin/feedback" className="text-gray-600 hover:text-blue-600">Feedback</Link>
          <Link to="/admin/bookings" className="text-gray-600 hover:text-blue-600">Bookings</Link>
        </div>
        
        
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden mt-3">
        <button className="text-gray-500 hover:text-gray-900 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
