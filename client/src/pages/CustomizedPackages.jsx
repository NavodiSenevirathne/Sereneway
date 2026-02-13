import React from "react";
import { Link } from "react-router-dom";

export default function CustomizedPackages() {
  const user = localStorage.getItem("user");

  return (
    <div
      data-name="customized-packages-page"
      className="py-16 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Customized Packages
        </h1>
        <p className="text-center text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
          Explore our personalized tour planning features tailored to meet every
          traveler's needs. Whether you're requesting a tour, managing your
          requests, or you're an admin handling approvals — everything is just a
          click away.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {user == "user" && (
            <>
              {/* Request a Tour */}
              <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer text-center">
                <Link to="/request-tour">
                  <h3 className="text-2xl font-semibold mb-2">
                    Request a Tour
                  </h3>
                  <p>
                    Create a custom travel plan by providing your preferences
                    and desired destinations.
                  </p>
                </Link>
              </div>

              {/* My Tours */}
              <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer text-center">
                <Link to="/my-requested-tours">
                  <h3 className="text-2xl font-semibold mb-2">My Tours</h3>
                  <p>
                    Track, edit, or cancel your tour requests in one place with
                    ease and transparency.
                  </p>
                </Link>
              </div>
            </>
          )}

          {user == "admin" && (
            <>
              {/* Manage Tours (Admin) */}
              <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer text-center">
                <Link to="/requested-tours">
                  <h3 className="text-2xl font-semibold mb-2">Manage Tours</h3>
                  <p>
                    Admins can view, approve, reject or delete submitted tour
                    requests.
                  </p>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
