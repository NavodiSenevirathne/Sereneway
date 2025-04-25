import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Serene Way</h1>
        <ul className="flex gap-4">
          <li>
            <Link
              to="/"
              className="bg-blue-500 hover:bg-white hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/manage-payments"
              className="bg-blue-500 hover:bg-white hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded"
            >
              Manage Payments
            </Link>
          </li>
          <li>
            <Link
              to="/bookings"
              className="bg-blue-500 hover:bg-white hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded"
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/rooms"
              className="bg-blue-500 hover:bg-white hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded"
            >
              Rooms
            </Link>
          </li>
          <li>
            <Link
              to="/customers"
              className="bg-blue-500 hover:bg-white hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded"
            >
              Customers
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
