
import React from 'react';

export default function AdminDashboard() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Stats data
  const stats = [
    { 
      title: "Today's Bookings", 
      value: 4006, 
      change: 10.00, 
      period: '30 days',
      bgColor: 'bg-blue-500'
    },
    { 
      title: "Total Bookings", 
      value: 61344, 
      change: 22.00, 
      period: '30 days',
      bgColor: 'bg-purple-500'
    },
    { 
      title: "Number of Meetings", 
      value: 34040, 
      change: 2.00, 
      period: '30 days',
      bgColor: 'bg-blue-500'
    },
    { 
      title: "Number of Clients", 
      value: 47033, 
      change: 0.22, 
      period: '30 days',
      bgColor: 'bg-red-400'
    }
  ];

  return (
    <div className="p-8">
      
      
      {/* Welcome Message */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Aamir</h2>
        <p className="text-gray-600">All systems are running smoothly! You have 3 unread alerts!</p>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 text-white`}>
            <h3 className="text-lg font-medium mb-4">{stat.title}</h3>
            <div className="text-4xl font-bold mb-2">{stat.value.toLocaleString()}</div>
            <div className="text-sm">
              {stat.change > 0 ? '+' : ''}{stat.change.toFixed(2)}% ({stat.period})
            </div>
          </div>
        ))}
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ratings Report */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ratings Report</h3>
          <p className="text-gray-600 text-sm mb-6">
            The total number of ratings received for tours, showing distribution across rating levels
          </p>
          
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Tour Ratings Distribution Chart</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Details</h3>
          <p className="text-gray-600 text-sm mb-6">
            The total number of sessions within the date range. It is the period time a user is actively engaged with your website, page or app, etc.
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h4 className="text-gray-500 text-sm">Order value</h4>
              <p className="text-2xl font-bold text-gray-800">12.3k</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm">Orders</h4>
              <p className="text-2xl font-bold text-gray-800">14k</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm">Users</h4>
              <p className="text-2xl font-bold text-gray-800">71.56%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
