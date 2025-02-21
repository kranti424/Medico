import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Building2, Phone, MapPin, Navigation, Info, X, Mail, Globe, Calendar, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserNav from '../../Navbar/UserNav';

const HospitalResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hospitalReviews, setHospitalReviews] = useState([]);

  const calculateDistance = (hospitalLat, hospitalLng) => {
    if (!userLocation || !hospitalLat || !hospitalLng) return null;
    const R = 6371;
    const lat1 = parseFloat(userLocation.lat);
    const lon1 = parseFloat(userLocation.lng);
    const lat2 = parseFloat(hospitalLat);
    const lon2 = parseFloat(hospitalLng);
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setSortBy("distance");
          toast.success("Location updated successfully");
        },
        () => toast.error("Please enable location services")
      );
    }
  };

  const fetchHospitalDetails = async (hospitalId) => {
    try {
      setLoading(true);
      // Find the hospital from existing results instead of making API call
      const hospital = results.find(h => h._id === hospitalId);
      if (hospital) {
        setSelectedHospital(hospital);
        setShowModal(true);
      }
    } catch (error) {
      toast.error("Failed to fetch hospital details");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHospital(null);
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
        entityType: "Hospital",
        entityEmail: selectedHospital.email,
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

  const fetchHospitalReviews = async (hospital) => {
    try {
      setSelectedHospital(hospital);
      const response = await axios.get(
        `https://medico-care-theta.vercel.app/api/v1/reviews/hospital/${hospital.email}`
      );
      setHospitalReviews(response.data.data);
      setShowReviews(true);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    }
  };

  const sortedHospitals = [...results].sort((a, b) => {
    if (sortBy === "distance" && userLocation) {
      const distanceA = calculateDistance(a.latitude, a.longitude);
      const distanceB = calculateDistance(b.latitude, b.longitude);
      return distanceA - distanceB;
    }
    return 0;
  });

  const renderHospitalCard = (hospital) => {
    const distance = calculateDistance(hospital.latitude, hospital.longitude);
    return (
      <motion.div
        key={hospital._id}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 
                   border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* Hospital Image/Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
            {hospital.image ? (
              <img
                src={hospital.image}
                alt={hospital.hospitalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 
                           flex items-center justify-center"
              >
                <Building2 className="w-12 h-12 text-white" />
              </div>
            )}
            {distance && (
              <span
                className="absolute -bottom-2 -right-2 px-3 py-1 bg-blue-600 text-white 
                             text-sm font-semibold rounded-full shadow-lg"
              >
                {distance} km
              </span>
            )}
          </div>
        </div>

        {/* Hospital Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h3 className="text-xl font-bold text-gray-900">
            {hospital.hospitalName}
          </h3>
          <div className="space-y-2 text-gray-600">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              {hospital.phone || "N/A"}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {hospital.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3 justify-center md:justify-start">
            <button
              onClick={() => fetchHospitalDetails(hospital._id)}
              className="w-auto bg-blue-50 text-blue-600 py-1.5 px-3 
              rounded hover:bg-blue-100 transition-all duration-200
              flex items-center justify-center gap-2 text-sm"
            >
              <Info className="w-4 h-4" />
              Details
            </button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
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
                setSelectedHospital(hospital);
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
              onClick={() => fetchHospitalReviews(hospital)}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <UserNav />
      <div className="container mx-auto px-4 mt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hospitals matching "{searchTerm}"
          </h1>
          <p className="text-gray-600">Found {results.length} results</p>
        </div>

        {/* Near Me Button */}
        <div className="mb-6">
          <button
            onClick={handleNearMe}
            className="px-6 py-2 bg-blue-600 text-white rounded-full 
                     hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <FaMapMarkerAlt />
            Find Near Me
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-6">
          {sortedHospitals.map((hospital) => renderHospitalCard(hospital))}
        </div>
      </div>
      {showModal && selectedHospital && (
        <HospitalDetailModal
          selectedHospital={selectedHospital}
          setShowModal={setShowModal}
          loading={loading}
        />
      )}
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
              <h2 className="text-2xl font-bold">Hospital Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {hospitalReviews.map((review) => (
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
              {hospitalReviews.length === 0 && (
                <p className="text-center text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HospitalDetailModal = ({ selectedHospital, setShowModal, loading }) => {
  if (!selectedHospital) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <>
            <div className="relative h-64 bg-gradient-to-r from-blue-500 to-blue-600">
              {selectedHospital.image ? (
                <img
                  src={selectedHospital.image}
                  alt={selectedHospital.hospitalName}
                  className="w-full h-full object-cover opacity-50"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-white/50" />
                </div>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                }}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50">
                <h2 className="text-3xl font-bold text-white">
                  {selectedHospital.hospitalName}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Established Year</span>
                  </div>
                  <p className="text-lg font-medium">
                    {selectedHospital.establishedYear || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-5 h-5" />
                    <span>Website</span>
                  </div>
                  <a
                    href={selectedHospital.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-blue-500 hover:underline"
                  >
                    {selectedHospital.website || "Not available"}
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>Contact</span>
                  </div>
                  <p className="text-lg font-medium">
                    {selectedHospital.phone}
                  </p>
                  {selectedHospital.alternatePhone && (
                    <p className="text-gray-600">
                      Alt: {selectedHospital.alternatePhone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </div>
                  <p className="text-lg font-medium">
                    {selectedHospital.email}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <p>
                    <span className="text-gray-600">Address:</span>{" "}
                    {selectedHospital.address}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p>
                      <span className="text-gray-600">City:</span>{" "}
                      {selectedHospital.city}
                    </p>
                    <p>
                      <span className="text-gray-600">State:</span>{" "}
                      {selectedHospital.state}
                    </p>
                    <p>
                      <span className="text-gray-600">Pincode:</span>{" "}
                      {selectedHospital.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Hospital
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedHospital.description ||
                    "No description available for this hospital."}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Close
                </button>
                <a
                  href={`https://www.google.com/maps?q=${selectedHospital.latitude},${selectedHospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  View on Map
                </a>
              </div>
            </div>
          </>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HospitalResults;