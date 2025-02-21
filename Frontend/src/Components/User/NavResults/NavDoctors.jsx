import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AppointmentCard from '../../common/AppointmentCard';
import {
  FaUserMd,
  FaMapMarkerAlt,
  FaHospital,
  FaClinicMedical,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNav from '../../Navbar/UserNav'

import DoctorProfile from "./DoctorProfile";

const NavDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "https://medico-care-theta.vercel.app/api/user/v2/doctors/all"
      );
      setDoctors(response.data.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch doctors");
      setLoading(false);
      toast.error("Failed to load doctors");
    }
  };

  

  // Calculate distance using Haversine formula
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const sortedDoctors = [...doctors]
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          if (!userLocation) return 0;
          const distanceA = calculateDistance(a.latitude, a.longitude);
          const distanceB = calculateDistance(b.latitude, b.longitude);
          return distanceA - distanceB;
        case "fees":
          return a.consultationFees - b.consultationFees;
        case "experience":
          return b.experience - a.experience;
        default:
          return 0;
      }
    })
    .filter((doctor) => {
      if (selectedDay) {
        return doctor.availableDays.includes(selectedDay);
      }
      return true;
    });

  

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
        (error) => {
          toast.error("Please enable location services");
        }
      );
    }
  };

  

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBookAppointment = async (doctor) => {
    const userData = await JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
      toast.error('Please login to book appointment');
      return;
    }

    const appointmentInfo = {
      // Patient Info
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      age: calculateAge(userData.dateOfBirth),
      image: userData.image,

      // Organization Info
      organizationType: doctor.organizationType,
      organizationName: doctor.organizationName,
      organizationEmail: doctor.organizationEmail,

      // Doctor Info
      doctorName: doctor.name,
      doctorEmail: doctor.email
    };

    setAppointmentData(appointmentInfo);
    setShowBooking(true);
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfile(true);
  };

  

  return (
    <>
      <UserNav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 mt-16">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Doctor
            </h1>
            <p className="text-blue-100">
              Connect with the best healthcare professionals
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="sticky top-0 z-30 bg-white border-b shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 text-xs md:text-sm rounded border border-gray-300 focus:border-blue-500 outline-none"
              >
                <option value="">Sort By</option>
                <option value="experience">Experience</option>
                <option value="fees">Consultation Fees</option>
                <option value="distance">Distance</option>
              </select>

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-2 py-1 text-xs md:text-sm rounded border border-gray-300 focus:border-blue-500 outline-none"
              >
                <option value="">Available Days</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNearMe}
              className="px-3 py-1 text-xs md:text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 
                 transition-all flex items-center shadow-md hover:shadow-lg"
            >
              <FaMapMarkerAlt size={14} className="text-white" />
              <span className="ml-1">Near Me</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {sortedDoctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DoctorCard
                      doctor={doctor}
                      distance={calculateDistance(
                        doctor.latitude,
                        doctor.longitude
                      )}
                      onViewProfile={() => handleViewProfile(doctor)}
                      onBooking={() => handleBookAppointment(doctor)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Profile Modal */}
        <AnimatePresence>
          {showProfile && selectedDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
            >
              <DoctorProfile
                doctor={selectedDoctor}
                distance={calculateDistance(
                  selectedDoctor.latitude,
                  selectedDoctor.longitude
                )}
                onClose={() => setShowProfile(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Appointment Modal */}
        <AnimatePresence>
          {showBooking && selectedDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
            >
              <AppointmentCard
                doctor={selectedDoctor}
                onClose={() => setShowBooking(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer />
      </div>
    </>
  );
};

// Update DoctorCard component with enhanced styling
const DoctorCard = ({ doctor, distance, onViewProfile, onBooking }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                 transition-all duration-300 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/64?text=Dr";
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <FaUserMd className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {doctor.degrees.join(", ")}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {doctor.organizationType === "Hospital" ? (
              <FaHospital className="text-blue-600" />
            ) : (
              <FaClinicMedical className="text-green-600" />
            )}
            <span>{doctor.organizationName}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>
              {doctor.city}, {doctor.state}
            </span>
            {distance && (
              <span className="text-blue-600 font-medium">({distance} km)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-gray-400" />
            <span>₹{doctor.consultationFees} Consultation Fee</span>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="text-gray-400" />
            <span>
              {doctor.timeSlots.start} - {doctor.timeSlots.end}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onViewProfile}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 
             rounded hover:bg-blue-100 transition-all duration-200
             flex items-center justify-center gap-2"
          >
            <FaUserMd className="w-4 h-4" />
            View Profile
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-50 text-green-600 py-2 px-4 
             rounded hover:bg-green-100 transition-all duration-200
             flex items-center justify-center gap-2"
          >
            <FaMapMarkerAlt className="w-4 h-4" />
            Get Directions
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NavDoctors;