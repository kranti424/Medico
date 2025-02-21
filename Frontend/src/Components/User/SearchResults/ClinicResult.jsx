import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClinicMedical, FaMapMarkerAlt, FaPhone, 
  FaDirections, FaInfo, FaGlobe,  
} from 'react-icons/fa';
import { Star, MessageSquare,Navigation,Info } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import UserNav from '../../Navbar/UserNav';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  const R = 6371;
  const lat1Rad = deg2rad(lat1);
  const lat2Rad = deg2rad(lat2);
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

const deg2rad = (deg) => deg * (Math.PI / 180);

const ClinicResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [clinicReviews, setClinicReviews] = useState([]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
      );
    }
  };

  const handleReviewSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    if (!userData) {
      toast.error("Please login to submit review");
      return;
    }
  
    try {
      const reviewData = {
        reviewerEmail: userData.email,
        userType: "User",
        entityType: "Clinic",
        entityEmail: selectedClinic.email,
        rating,
        text: reviewText,
      };
  
      const response = await axios.post(  
        "https://medico-care-theta.vercel.app/api/v1/reviews/create",
        reviewData
      );
  
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setShowReviewModal(false);
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const fetchClinicReviews = async (clinic) => {
    try {
      setSelectedClinic(clinic);
      const response = await axios.get(
        `https://medico-care-theta.vercel.app/api/v1/reviews/clinic/${clinic.email}`
      );
      setClinicReviews(response.data.data);
      setShowReviews(true);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    }
  };

  const renderClinicCard = (clinic) => {
    const distance = userLocation 
      ? calculateDistance(
          parseFloat(clinic.latitude),
          parseFloat(clinic.longitude),
          parseFloat(userLocation.lat),
          parseFloat(userLocation.lng)
        )
      : null;

    return (
      <motion.div
        key={clinic._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-5 flex flex-col md:flex-row items-center gap-5 
                 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Clinic Image */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 shadow">
            {clinic.image ? (
              <img
                src={clinic.image}
                alt={clinic.clinicName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FaClinicMedical className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>
          {distance && (
            <span className="absolute -bottom-2 -right-2 px-2 py-1 bg-green-500 text-white 
                           text-xs font-medium rounded-full shadow-md">
              {distance} km
            </span>
          )}
        </div>

        {/* Clinic Info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-800">{clinic.clinicName}</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p className="flex items-center justify-center md:justify-start">
              <FaPhone className="w-4 h-4 mr-2 text-green-500" />
              {clinic.phone}
            </p>
            <p className="flex items-center justify-center md:justify-start">
              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-green-500" />
              {clinic.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3 justify-center md:justify-start">
            <button
              onClick={() => {
                setSelectedClinic(clinic);
                setShowProfile(true);
              }}
              className="w-auto bg-blue-50 text-blue-600 py-1.5 px-3 
              rounded hover:bg-blue-100 transition-all duration-200
              flex items-center justify-center gap-2 text-sm"
            >
              <Info className="w-4 h-4" />
              Details
            </button>
            <a
              href={`https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-auto flex items-center gap-2 px-3 py-1.5 border border-gray-300 
            text-gray-700 text-sm font-medium rounded hover:bg-gray-100 
            transition-all"
            >
              <Navigation className="w-4 h-4" />
              Directions
            </a>
            <button
              onClick={() => {
                setSelectedClinic(clinic);
                setShowReviewModal(true);
              }}
              className="w-auto bg-green-50 text-green-600 py-1.5 px-3 
            rounded hover:bg-green-100 transition-all duration-200
            flex items-center justify-center gap-2 text-sm"
            >
              <Star className="w-4 h-4" />
              Add Review
            </button>
            
            <button
              onClick={() => fetchClinicReviews(clinic)}
              className="w-auto bg-blue-50 text-blue-600 py-1.5 px-3 
              rounded hover:bg-blue-100 transition-all duration-200
              flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Show Reviews
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <UserNav />
      <ToastContainer />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Clinics matching "{searchTerm}"
          </h1>
          <p className="text-emerald-100">
            Found {results.length} results
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={getUserLocation}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
        >
          <FaMapMarkerAlt />
          Near Me
        </button>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="space-y-4">
          {results.map((clinic) => renderClinicCard(clinic))}
        </div>
      </div>

      {/* Clinic Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedClinic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="border-b p-6 flex justify-between items-start bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <FaClinicMedical className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedClinic.clinicName}</h2>
                    <p>Established {selectedClinic.establishedYear}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProfile(false)} 
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div className="bg-green-50 rounded-lg p-4 shadow-md">
                  <h3 className="font-semibold mb-2 text-green-700">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <FaPhone className="text-green-600" />
                      {selectedClinic.phone}
                    </p>
                    {selectedClinic.alternatePhone && (
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-green-600" />
                        {selectedClinic.alternatePhone}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <FaGlobe className="text-green-600" />
                      {selectedClinic.website || "Not available"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold mb-2 text-green-700">Location</h3>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-600" />
                      {selectedClinic.address}, {selectedClinic.city}, {selectedClinic.state}, {selectedClinic.pincode}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2 text-green-700">About Clinic</h3>
                  <p className="text-gray-600">{selectedClinic.description}</p>
                </div>

                {/* Image */}
                {selectedClinic.image && (
                  <div>
                    <h3 className="font-semibold mb-2 text-green-700">Clinic Image</h3>
                    <img
                      src={selectedClinic.image}
                      alt={selectedClinic.clinicName}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-b-lg">
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowProfile(false)}
                    className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50"
                  >
                    Close
                  </button>
                  <a
                    href={`https://www.google.com/maps?q=${selectedClinic.latitude},${selectedClinic.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  placeholder="Write your review here..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setRating(0);
                    setReviewText('');
                  }}
                  className="flex-1 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!rating || !reviewText}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Display Modal */}
      {showReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Clinic Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {clinicReviews.map((review) => (
                <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    By: {review.reviewerEmail}
                  </p>
                </div>
              ))}
              {clinicReviews.length === 0 && (
                <p className="text-center text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicResults;