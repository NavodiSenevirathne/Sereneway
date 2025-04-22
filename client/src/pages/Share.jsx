import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaStarHalfAlt, FaRegStar, FaTrash, FaPen, FaReply, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Share() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [starCounts, setStarCounts] = useState([0, 0, 0, 0, 0]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    rating: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Placeholder for admin status

  useEffect(() => {
    fetchFeedbacks();
  }, [sortOption]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/feedback');
      let feedbackData = response.data;
      
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
        default:
          break;
      }
      
      setFeedbacks(feedbackData);
      calculateStats(feedbackData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) return;
    
    const totalRatings = data.length;
    const ratingSum = data.reduce((sum, item) => sum + item.rating, 0);
    const avg = ratingSum / totalRatings;
    
    // Count ratings by star
    const counts = [0, 0, 0, 0, 0]; // For 1-5 stars
    data.forEach(item => {
      counts[item.rating - 1]++;
    });
    
    setTotalRatings(totalRatings);
    setAverageRating(avg);
    setStarCounts(counts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFeedback) {
        await axios.put(`/api/feedback/${editingFeedback._id}`, formData);
      } else {
        // Check for hate speech before submission
        const hateWords = ['hate', 'terrible', 'awful', 'worst', 'garbage', 'trash', 'useless', 'pathetic', 'horrible', 'disappointing'];
        const containsHateWords = hateWords.some(word => 
          formData.description.toLowerCase().includes(word.toLowerCase())
        );
        
        // If it contains hate speech and has a low rating, we'll add a flag
        const shouldFlagForReview = containsHateWords && formData.rating === 1;
        
        // Proceed with submission, including the flag
        await axios.post('/api/feedback/create', {
          ...formData,
          flaggedForReview: shouldFlagForReview
        });
      }
      
      setEditingFeedback(null);
      setFormData({ name: '', email: '', description: '', rating: 0 });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      name: feedback.name,
      email: feedback.email,
      description: feedback.description,
      rating: feedback.rating
    });
    // Scroll to form
    document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleReply = async (feedbackId) => {
    try {
      await axios.post(`/api/feedback/${feedbackId}/reply`, { 
        text: replyText,
        adminName: "Admin" // Replace with actual admin name
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
    feedback.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="bg-white min-h-screen">
      {/* Banner Image with Text */}
      <div className="relative w-full h-96">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/29645367/pexels-photo-29645367/free-photo-of-majestic-mountain-peaks-in-sri-lanka.jpeg')"
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-5xl font-serif mb-4 drop-shadow-lg">Share your stories with us</h1>
            <p className="text-xl font-extralight drop-shadow-md">Crafting journeys, Sharing memories</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-center mb-10">Customer Reviews & Feedbacks</h1>
        
        {/* Search */}
        <div className="flex justify-between items-center mb-8">
          <form className="bg-white p-3 rounded-lg flex items-center shadow-md w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search Reviews..." 
              className="bg-transparent focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-slate-600" />
          </form>
        </div>
        
        {/* Rating Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side - Average rating */}
            <div className="flex flex-col items-center justify-center md:w-1/3 border-r border-gray-200">
              <div className="text-5xl font-bold text-gray-800">
                {averageRating.toFixed(1)}
                <span className="text-2xl text-gray-500">/5</span>
              </div>
              <div className="flex my-2">
                <StarRating rating={averageRating} />
              </div>
              <div className="text-gray-500">{totalRatings} Ratings</div>
            </div>
            
            {/* Right side - Rating breakdown */}
            <div className="md:w-2/3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-2">
                  <div className="flex items-center w-16">
                    <span className="mr-2">{star}</span>
                    <FaStar className="text-yellow-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ 
                          width: totalRatings > 0 
                            ? `${(starCounts[star - 1] / totalRatings) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right">{starCounts[star - 1]}</div>
                </div>
              ))}
            </div>
          </div>
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
              No reviews found. Share your experience below!
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{feedback.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <StarRating rating={feedback.rating} />
                      <span className="text-gray-500 text-sm">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    {(isAdmin || feedback.isOwnedByCurrentUser) && (
                      <>
                        <button 
                          onClick={() => handleEdit(feedback)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaPen />
                        </button>
                        <button 
                          onClick={() => handleDelete(feedback._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <button 
                        onClick={() => setReplyingTo(feedback._id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaReply />
                      </button>
                    )}
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
        
        {/* Always visible Review Form */}
        <div id="review-form" className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingFeedback ? 'Edit Your Review' : 'Share Your Experience'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="focus:outline-none"
                  >
                    {star <= formData.rating ? (
                      <FaStar className="text-yellow-400 text-2xl" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-2xl" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Review
              </label>
              <textarea
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="flex justify-end">
              {editingFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingFeedback(null);
                    setFormData({ name: '', email: '', description: '', rating: 0 });
                  }}
                  className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingFeedback ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}