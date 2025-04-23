import React, { useState, useEffect } from "react";

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Automatically close the alert after 3 seconds
    return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
  }, [message, onClose]);

  let alertStyle = "";
  switch (type) {
    case "success":
      alertStyle = "bg-green-500 text-white";
      break;
    case "error":
      alertStyle = "bg-red-500 text-white";
      break;
    case "info":
      alertStyle = "bg-blue-500 text-white";
      break;
    default:
      alertStyle = "bg-gray-500 text-white";
  }

  return (
    <div
      className={`fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg ${alertStyle} flex items-center justify-between`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
