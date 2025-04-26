// components/CartModal.jsx
import React, { useState } from "react";
import axios from "axios";

export default function CartModal({ isOpen, onClose, tourId, tourTitle, packagePrice, maxGroupSize }) {
  
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomCategory, setRoomCategory] = useState("normal");
  const [roomType, setRoomType] = useState("single");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Room prices and capacities
  const roomPrices = {
    normal: { single: 5000, double: 8000, family: 12000 },
    luxury: { single: 8000, double: 12000, family: 18000 }
  };
  const roomCapacities = { single: 1, double: 2, family: 4 };

  // Calculate total price
  const calculateTotalPrice = () => {
    const roomCapacity = roomCapacities[roomType];
    const totalMembers = adults + children;
    const neededRooms = Math.ceil(totalMembers / roomCapacity);
    const roomPrice = roomPrices[roomCategory][roomType];
    const packageTotal = adults * packagePrice + children * packagePrice * 0.5;
    const roomTotal = neededRooms * roomPrice;
    return packageTotal + roomTotal;
  };

  const handleNotifyMe = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/cart", {
        tour: tourId,
        adults,
        children,
        roomCategory,
        roomType,
        email,
        totalPrice: calculateTotalPrice()
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto z-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-5 text-white relative">
          <h2 className="text-xl font-bold">Notify about the Tour Package</h2>
          <p className="text-green-100 mt-1 text-sm">Select your preferences</p>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-green-700/30 rounded-full p-1.5 transition-colors duration-200"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-5">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center border border-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium flex items-center border border-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Sent to your email Account.
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  max={maxGroupSize}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <input
                  type="number"
                  min="0"
                  max={Math.max(0, maxGroupSize - adults)}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Category</label>
                <select
                  value={roomCategory}
                  onChange={(e) => setRoomCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="family">Family</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-xs text-gray-500">(Notify me about this tour)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-semibold">Rs. {calculateTotalPrice().toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                Includes package price, accommodation, and all applicable fees.
              </div>
            </div>
            
            <button
              onClick={handleNotifyMe}
              disabled={loading || !email}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
