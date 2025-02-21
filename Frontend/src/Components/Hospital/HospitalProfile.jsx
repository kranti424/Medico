import React, { useEffect, useState } from 'react';
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaHistory, FaPen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HospitalNavbar from "../Navbar/HospitalNav";

// Import marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const HospitalProfile = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("hospitalData");
    if (storedData) {
      setHospitalData(JSON.parse(storedData));
    }
  }, []);

  if (!hospitalData) return <div>Loading...</div>;

  return (
    <>
      <HospitalNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800">
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Profile Image */}
              <div className="absolute -top-16 left-8">
                <div className="relative w-32 h-32">
                  <div className="w-full h-full rounded-full bg-blue-100 border-4 border-white shadow-xl overflow-hidden mt-44">
                    {hospitalData.image ? (
                      <img
                        src={hospitalData.image}
                        alt={hospitalData.hospitalName}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-full bg-blue-100 border-4 border-white shadow-xl 
                                flex items-center justify-center"
                      >
                        <FaHospital className="w-12 h-12 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hospital Info */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pl-44 bg-gradient-to-t from-black/60">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {hospitalData.hospitalName}
                </h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <FaMapMarkerAlt className="flex-shrink-0" />
                  <span className="truncate">
                    {hospitalData.address}, {hospitalData.city},{" "}
                    {hospitalData.state}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-white px-8 py-4 flex flex-wrap items-center gap-6 mt-16">
              <div className="flex items-center gap-2 text-gray-600">
                <FaHistory className="w-5 h-5 text-blue-600" />
                <span>Est. {hospitalData.establishedYear}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaPhone className="w-5 h-5 text-blue-600" />
                <span>{hospitalData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope className="w-5 h-5 text-blue-600" />
                <span>{hospitalData.email}</span>
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
                  <FaHistory className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Established</p>
                  <p className="text-xl font-bold text-gray-900">
                    {hospitalData.establishedYear}
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
                  <FaPhone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="text-xl font-bold text-gray-900">
                    {hospitalData.phone}
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
                  <FaGlobe className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <a
                    href={hospitalData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hospital Details
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
                      <p className="text-sm text-gray-600 mb-1">
                        Primary Contact
                      </p>
                      <p className="text-lg font-medium">
                        {hospitalData.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Alternate Contact
                      </p>
                      <p className="text-lg font-medium">
                        {hospitalData.alternatePhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Email Address
                      </p>
                      <p className="text-lg font-medium">
                        {hospitalData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pincode</p>
                      <p className="text-lg font-medium">
                        {hospitalData.pincode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">About</p>
                    <p className="text-gray-700">{hospitalData.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Location
                </h2>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[hospitalData.latitude, hospitalData.longitude]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[hospitalData.latitude, hospitalData.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">
                            {hospitalData.hospitalName}
                          </h3>
                          <p className="text-sm">{hospitalData.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <a
                  href={`https://www.openstreetmap.org/directions?from=&to=${hospitalData.latitude},${hospitalData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center 
                         justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <FaMapMarkerAlt />
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalProfile;