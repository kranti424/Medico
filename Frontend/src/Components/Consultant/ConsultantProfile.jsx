import React, { useEffect, useState } from 'react';
import { 
  FaUserMd, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaGraduationCap, FaStethoscope, FaClock, FaCalendarAlt, 
  FaHospital, FaPen 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const ConsultantProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('doctorData');
    if (storedData) {
      setDoctorData(JSON.parse(storedData));
    }
  }, []);

  if (!doctorData) return <div>Loading...</div>;
  // console.log(doctorData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Blue Gradient Background */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Doctor Info (Inside the Blue Area) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pl-44 bg-gradient-to-t from-black/60">
              <h1 className="text-4xl font-bold text-white mb-2">
                Dr. {doctorData.name}
              </h1>
              <p className="text-blue-100 flex items-center gap-2">
                <FaStethoscope className="flex-shrink-0" />
                <span>{doctorData.specialties.join(", ")}</span>
              </p>
            </div>
          </div>

          {/* Profile Image Section - Moved above the gradient */}
          <div className="relative z-10">
            <div className="absolute -top-16 left-8">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full bg-blue-100 border-4 border-white shadow-xl overflow-hidden">
                  {doctorData.profileImage ? (
                    <img
                      src={doctorData.profileImage}
                      alt="Doctor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserMd className="w-12 h-12 text-blue-600 m-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-white px-8 py-4 flex flex-wrap items-center gap-6 mt-16">
            <div className="flex items-center gap-2 text-gray-600">
              <FaHospital className="w-5 h-5 text-blue-600" />
              <span>{doctorData.organizationName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaGraduationCap className="w-5 h-5 text-blue-600" />
              <span>{doctorData.degrees.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaEnvelope className="w-5 h-5 text-blue-600" />
              <span>{doctorData.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaStethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-xl font-bold text-gray-900">
                  {doctorData.experience} Years
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaClock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Consultation Hours</p>
                <p className="text-xl font-bold text-gray-900">
                  {doctorData.timeSlots.start} - {doctorData.timeSlots.end}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Days</p>
                <p className="text-xl font-bold text-gray-900">
                  {doctorData.availableDays.join(", ")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professional Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Professional Details
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaPen />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Organization</p>
                    <p className="text-lg font-medium">
                      {doctorData.organizationName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Organization Type
                    </p>
                    <p className="text-lg font-medium">
                      {doctorData.organizationType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Consultation Fees
                    </p>
                    <p className="text-lg font-medium">
                      ₹{doctorData.consultationFees}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Experience</p>
                    <p className="text-lg font-medium">
                      {doctorData.experience} Years
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {doctorData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Degrees</p>
                  <div className="flex flex-wrap gap-2">
                    {doctorData.degrees.map((degree, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      >
                        {degree}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-600" />
                  <span>{doctorData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>
                    {doctorData.address}, {doctorData.city}, {doctorData.state}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaHospital className="text-blue-600" />
                  <span>{doctorData.organizationName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantProfile;