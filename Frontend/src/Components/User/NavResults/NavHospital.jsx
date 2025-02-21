import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Navigation,
  Info,
  X,
  Globe,
  Mail,
  Calendar,
  Star,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNav from "../../Navbar/UserNav";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hospitalReviews, setHospitalReviews] = useState([]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        "https://medico-care-theta.vercel.app/api/user/hospitals/all"
      );
      const validatedData = response.data.data.map((hospital) => ({
        ...hospital,
        name: hospital.hospitalName, // Map hospitalName to name
        coordinates: [hospital.longitude, hospital.latitude], // Create coordinates array
      }));
      setHospitals(validatedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        fetchNearestHospitals(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    }
  };

  const fetchNearestHospitals = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://medico-care-theta.vercel.app/api/user/hospitals/nearest?latitude=${lat}&longitude=${lng}`
      );
      setHospitals(response.data.data);
    } catch (error) {}
  };

  const calculateDistance = (hospitalLat, hospitalLng, userLoc) => {
    if (!userLoc || !hospitalLat || !hospitalLng) return null;

    const R = 6371;
    const dLat = deg2rad(hospitalLat - userLoc.lat);
    const dLon = deg2rad(hospitalLng - userLoc.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLoc.lat)) *
        Math.cos(deg2rad(hospitalLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const fetchHospitalDetails = async (hospitalId) => {
    try {
      const response = await axios.get(
        `https://medico-care-theta.vercel.app/api/user/hospitals/${hospitalId}`
      );
      setSelectedHospital(response.data.data);
      setShowModal(true);
    } catch (error) {}
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

  if (loading) return <div>Loading hospitals...</div>;
  if (error) return <div>Error: {error}</div>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-lg text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchHospitals}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const HospitalCard = ({ hospital, distance }) => (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl p-5 flex flex-col md:flex-row items-center gap-5 
                 border border-gray-200 shadow-sm transition-all duration-300"
    >
      {/* Hospital Image */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 shadow">
          {hospital.image ? (
            <img
              src={hospital.image}
              alt={hospital.hospitalName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>
        {distance && (
          <span
            className="absolute -bottom-2 -right-2 px-2 py-1 bg-blue-500 text-white 
                          text-xs font-medium rounded-full shadow-md"
          >
            {distance} km
          </span>
        )}
      </div>

      {/* Hospital Info */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-lg font-semibold text-gray-800">
          {hospital.hospitalName}
        </h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p className="flex items-center justify-center md:justify-start">
            <Phone className="w-4 h-4 mr-2 text-blue-500" />
            {hospital.phone || "N/A"}
          </p>
          <p className="flex items-center justify-center md:justify-start">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
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
            href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
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

  const sortHospitals = (hospitals, sortBy, userLocation) => {
    return [...hospitals].sort((a, b) => {
      switch (sortBy) {
        case "distance":
          const distA = calculateDistance(
            a.latitude,
            a.longitude,
            userLocation
          );
          const distB = calculateDistance(
            b.latitude,
            b.longitude,
            userLocation
          );
          return distA - distB;
        case "name":
          return a.hospitalName.localeCompare(b.hospitalName);
        case "year":
          return (b.establishedYear || 0) - (a.establishedYear || 0);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <UserNav />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Medical-themed background overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url('/api/placeholder/1920/1080')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] opacity-10 mix-blend-overlay" />
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Nearby Hospitals
              </h1>
              <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                Discover and connect with healthcare facilities in your area.
                Get instant access to hospital information, directions, and
                contact details.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-emerald-50/90" />
        </div>

        {/* Compact Sort Section */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex justify-end items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       bg-white shadow-sm appearance-none cursor-pointer text-sm"
              >
                <option value="distance">Distance</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
              <button
                onClick={getLocation}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 
                       text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 
                       transition-all shadow-sm hover:shadow flex items-center 
                       justify-center gap-2 text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Near Me
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {sortHospitals(hospitals, sortBy, userLocation).map((hospital) => {
              const distance = calculateDistance(
                hospital.latitude,
                hospital.longitude,
                userLocation // Pass the entire userLocation object
              );

              return (
                <HospitalCard
                  key={hospital._id}
                  hospital={hospital}
                  distance={distance} // Pass the calculated distance
                />
              );
            })}
          </motion.div>

          {/* Load More Button */}
          {hospitals.length > 50 && (
            <button
              onClick={loadMoreHospitals}
              className="mt-8 mx-auto block px-6 py-2.5 bg-gradient-to-r from-emerald-500 
                       to-teal-500 text-white rounded-full hover:from-emerald-600 
                       hover:to-teal-600 transition-all shadow hover:shadow-md text-sm"
            >
              Load More Hospitals
            </button>
          )}
        </div>

        {/* Hospital Details Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                {selectedHospital && (
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
                          setSelectedHospital(null);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 
                             rounded-full backdrop-blur-sm transition-colors"
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
                            {selectedHospital.establishedYear ||
                              "Not specified"}
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

                      {/* Services & Facilities */}
                      {selectedHospital.services && (
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Services & Facilities
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedHospital.services.map((service, index) => (
                              <div
                                key={index}
                                className="bg-blue-50 rounded-lg p-4 flex items-center gap-3"
                              >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Star className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="text-gray-700">{service}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <button
                          onClick={() => {
                            setShowModal(false);
                            setSelectedHospital(null);
                          }}
                          className="px-6 py-3 border border-gray-300 rounded-xl 
                                 hover:bg-gray-50 transition-colors text-gray-700 
                                 font-medium flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Close
                        </button>
                        <a
                          href={`https://www.google.com/maps?q=${selectedHospital.latitude},${selectedHospital.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                                 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 
                                 transition-all shadow-sm hover:shadow-md font-medium 
                                 flex items-center justify-center gap-2"
                        >
                          <Navigation className="w-5 h-5" />
                          View on Map
                        </a>
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="px-6 py-3 bg-green-600 text-white rounded-xl 
                                   hover:bg-green-700 transition-all shadow-sm 
                                   hover:shadow-md font-medium flex items-center 
                                   justify-center gap-2"
                        >
                          <Star className="w-5 h-5" />
                          Add Review
                        </button>
                        <button
                          onClick={fetchHospitalReviews}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl 
                                   hover:bg-blue-700 transition-all shadow-sm 
                                   hover:shadow-md font-medium flex items-center 
                                   justify-center gap-2"
                        >
                          <MessageSquare className="w-5 h-5" />
                          Show Reviews
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 
                      flex items-center justify-center"
        >
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
                      className={`text-2xl ${
                        rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
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
                    setReviewText("");
                  }}
                  className="flex-1 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!rating || !reviewText}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg 
                           disabled:bg-gray-300"
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 
                      flex items-center justify-center"
        >
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
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
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
            {/* <ToastContainer /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
