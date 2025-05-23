import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar, FaTrash, FaReply, FaFilter } from 'react-icons/fa';
import axios from 'axios';

export default function ShareAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [adminName, setAdminName] = useState('Admin'); // This should be fetched from the logged-in admin

  useEffect(() => {
    fetchFeedbacks();
  }, [sortOption]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      console.log('Fetching feedbacks from API...');
      const response = await axios.get('/api/feedback/admin');
      console.log('API response:', response);
      let feedbackData = response.data;
      
      if (!Array.isArray(feedbackData)) {
        console.error('Expected an array of feedbacks, but got:', feedbackData);
        feedbackData = [];
      }
      
      // Apply sorting
      switch(sortOption) {
        case 'newest':
          feedbackData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          feedbackData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'highest':
          feedbackData.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          feedbackData.sort((a, b) => a.rating - b.rating);
          break;
        case 'flagged':
          feedbackData.sort((a, b) => (b.flaggedForReview ? 1 : 0) - (a.flaggedForReview ? 1 : 0));
          break;
        default:
          break;
      }
      
      setFeedbacks(feedbackData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`/api/feedback/admin/${id}`);
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleReply = async (feedbackId) => {
    try {
      await axios.post(`/api/feedback/admin/${feedbackId}/reply`, { 
        text: replyText,
        adminName: adminName
      });
      setReplyingTo(null);
      setReplyText('');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error replying to feedback:', error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Star rating display component
  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif text-center mb-10">Admin Feedback Management</h1>
        
        {/* Search */}
        <div className="flex justify-between items-center mb-8">
          <form className="bg-white p-3 rounded-lg flex items-center shadow-md w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search by name, email or content..." 
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
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="flagged">Flagged for Review</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Feedbacks List */}
        <div className="space-y-6 mb-8">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              No feedback found.
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback._id} className={`bg-white rounded-lg shadow-lg p-6 ${feedback.flaggedForReview ? 'border-l-4 border-red-500' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{feedback.name}</h3>
                    <p className="text-sm text-gray-500">{feedback.email}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <StarRating rating={feedback.rating} />
                      <span className="text-gray-500 text-sm">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                      {feedback.flaggedForReview && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Flagged for Review</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDelete(feedback._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      onClick={() => setReplyingTo(feedback._id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaReply />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mt-2">{feedback.description}</p>
                
                {/* Admin replies */}
                {feedback.replies && feedback.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    {feedback.replies.map((reply, index) => (
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
                {replyingTo === feedback._id && (
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
                        onClick={() => handleReply(feedback._id)}
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