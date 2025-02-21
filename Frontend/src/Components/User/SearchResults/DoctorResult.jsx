import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserMd, FaStar, FaMapMarkerAlt, FaEye, FaDirections, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DoctorProfile from '../NavResults/DoctorProfile';
import UserNav from '../../Navbar/UserNav';

const DoctorResults = () => {
  const { state } = useLocation();
  const { results, searchTerm } = state;
  const [sortBy, setSortBy] = useState('rating');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Distance calculation function
  const calculateDistance = (doctorLat, doctorLng) => {
    if (!userLocation || !doctorLat || !doctorLng) return null;
    
    const R = 6371; // Earth's radius in km
    const lat1 = parseFloat(userLocation.lat);
    const lon1 = parseFloat(userLocation.lng);
    const lat2 = parseFloat(doctorLat);
    const lon2 = parseFloat(doctorLng);
    
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSortBy('distance');
          toast.success('Location updated successfully');
        },
        (error) => {
          toast.error('Please enable location services');
        }
      );
    }
  };

  const sortedDoctors = [...results].sort((a, b) => {
    switch(sortBy) {
      case 'rating': 
        return (b.rating || 0) - (a.rating || 0);
      case 'experience': 
        return b.experience - a.experience;
      case 'fee': 
        return a.consultationFees - b.consultationFees;
      case 'distance':
        if (!userLocation) return 0;
        const distanceA = calculateDistance(a.latitude, a.longitude);
        const distanceB = calculateDistance(b.latitude, b.longitude);
        return distanceA - distanceB;
      default: 
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <UserNav />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Search Results for "{searchTerm}"
          </motion.h1>
          <p className="text-blue-100 text-lg">
            Found {results.length} qualified doctors matching your search
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaFilter />
              <span>Sort by:</span>
            </div>

            <motion.select
              whileTap={{ scale: 0.95 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-blue-200 focus:border-blue-500 
                       outline-none transition-all hover:border-blue-300"
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="fee">Consultation Fee</option>
              <option value="distance">Distance</option>
            </motion.select>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNearMe}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-full 
                       hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md"
            >
              <FaMapMarkerAlt />
              <span>Near Me</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Profile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Expertise & Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <AnimatePresence>
                  {sortedDoctors.map((doctor, index) => (
                    <motion.tr
                      key={doctor._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                            {doctor.profileImage ? (
                              <img
                                src={doctor.profileImage}
                                alt={doctor.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/48?text=Dr";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                <FaUserMd className="w-6 h-6 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {doctor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {doctor.degrees?.join(", ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {doctor.specialties?.join(", ")}
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < (doctor.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {doctor.experience} years exp.
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {doctor.city}, {doctor.state}
                        </div>
                        {userLocation && (
                          <div className="text-sm text-blue-600 mt-1">
                            {calculateDistance(
                              doctor.latitude,
                              doctor.longitude
                            )}{" "}
                            km away
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowProfile(true);
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 
                                     rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <FaEye className="w-4 h-4 mr-1.5" />
                            View Profile
                          </motion.button>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 
                                     rounded-full hover:bg-green-200 transition-colors"
                          >
                            <FaDirections className="w-4 h-4 mr-1.5" />
                            Get Directions
                          </motion.a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      <AnimatePresence>
        {showProfile && selectedDoctor && (
          <DoctorProfile
            doctor={selectedDoctor}
            distance={calculateDistance(
              selectedDoctor.latitude,
              selectedDoctor.longitude
            )}
            onClose={() => {
              setShowProfile(false);
              setSelectedDoctor(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorResults;