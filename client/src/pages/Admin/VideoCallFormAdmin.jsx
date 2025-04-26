import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaReply, FaFilter, FaCalendarAlt, FaClock, FaGlobe, FaEnvelope, FaUser } from 'react-icons/fa';
import axios from 'axios';

export default function VideoCallFormAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [adminName, setAdminName] = useState('Admin'); // This should be fetched from the logged-in admin

  useEffect(() => {
    fetchRequests();
  }, [sortOption]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/videocall/admin');
      let requestData = response.data;
      
      // Apply sorting
      switch(sortOption) {
        case 'newest':
          requestData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          requestData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'upcoming':
          requestData.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'past':
          requestData.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        default:
          break;
      }
      
      setRequests(requestData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching video call requests:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video call request?')) {
      try {
        await axios.delete(`/api/videocall/admin/${id}`);
        fetchRequests();
      } catch (error) {
        console.error('Error deleting video call request:', error);
      }
    }
  };

  const handleReply = async (requestId) => {
    try {
      await axios.post(`/api/videocall/admin/${requestId}/reply`, { 
        text: replyText,
        adminName: adminName
      });
      setReplyingTo(null);
      setReplyText('');
      fetchRequests();
    } catch (error) {
      console.error('Error replying to video call request:', error);
    }
  };

  const filteredRequests = requests.filter(request => 
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  const isUpcoming = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-center mb-10">Admin Video Call Request Management</h1>
        
        {/* Search */}
        <div className="flex justify-between items-center mb-8">
          <form className="bg-white p-3 rounded-lg flex items-center shadow-md w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search by name, email, country..." 
              className="bg-transparent focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-slate-600" />
          </form>
        </div>
        
        {/* Filter Options */}
        <div className="flex justify-end mb-4">
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2">
              <FaFilter className="text-gray-500 mr-2" />
              <select
                className="bg-transparent focus:outline-none pr-8"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="upcoming">Upcoming Calls</option>
                <option value="past">Past Calls</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Requests List */}
        <div className="space-y-6 mb-8">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              No video call requests found.
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className={`bg-white rounded-lg shadow-lg p-6 ${isUpcoming(request.date) ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{request.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaEnvelope className="mr-1" />
                      <span>{request.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaGlobe className="mr-1" />
                      <span>{request.country}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaCalendarAlt className="mr-1" />
                      <span>{formatDate(request.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaClock className="mr-1" />
                      <span>{formatTime(request.time)}</span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDelete(request._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      onClick={() => setReplyingTo(request._id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaReply />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Message:</h4>
                  <p className="text-gray-700 mt-1">{request.message}</p>
                </div>
                
                {/* Admin replies */}
                {request.replies && request.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    {request.replies.map((reply, index) => (
                      <div key={index} className="mb-2">
                        <div className="font-semibold text-sm text-blue-600">
                          {reply.adminName} <span className="text-gray-500 font-normal">responded:</span>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.text}</p>
                        <span className="text-gray-500 text-xs">
                          {new Date(reply.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reply form */}
                {replyingTo === request._id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      rows="2"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(request._id)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
