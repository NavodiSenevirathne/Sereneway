import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import axios from "axios";
const CustomerDashboard = () => {
  return (
    <div className="flex flex-col sm:flex-row h-screen  bg-gray-100">
    <Sidebar />
    <div className="flex-1">
      <Topbar />
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Booking Management</h2>
      <h2>Customer Dashboard</h2>
      <p>Welcome to your dashboard!</p>
    </div>
    </div>
    </div>
  );
};

export default CustomerDashboard;
