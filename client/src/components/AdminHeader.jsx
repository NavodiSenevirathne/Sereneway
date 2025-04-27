// components/AdminHeader.jsx
import React, { useState, useEffect } from 'react';

function AdminHeader() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [unreadAlerts, setUnreadAlerts] = useState(3);
  
  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format date: Sunday, April 27, 2025
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            All systems are running smoothly! 
            {unreadAlerts > 0 && (
              <span className="text-blue-500 font-medium"> You have {unreadAlerts} unread alerts!</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-gray-600">{formattedDate}</p>
          </div>
          
          <div className="relative">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadAlerts > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
          
          <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
