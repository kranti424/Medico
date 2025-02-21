import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "leaflet/dist/leaflet.css";
import {
  FaHospital,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaGlobe,
  FaLock,
  FaImage,
  FaCheckCircle,
  FaInfoCircle,
  FaSearch,
  FaCrosshairs,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import axios from 'axios';

// Add Indian States and Cities
const INDIA_STATES_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
};

const API_URL = 'https://medico-care-theta.vercel.app/api/hospitals';

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        },
      }}
    />
  ) : null;
};

function HospitalRegistration() {
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');

  const [formData, setFormData] = useState({
    hospitalName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    establishedYear: "",
    website: "",
    description: "",
    image: null,
    latitude: "",
    longitude: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  // Validation Functions
  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.hospitalName)
          newErrors.hospitalName = "Hospital name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        break;
      case 2:
        if (!selectedLocation) newErrors.location = "Please select a location";
        break;
      case 3:
        if (!formData.description)
          newErrors.description = "Description is required";
        break;
      case 4:
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "state") {
      setCities(INDIA_STATES_CITIES[value] || []);
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getCurrentLocation = () => {
    toast.loading("Fetching location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(location);
          setFormData((prev) => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
          }));
          toast.dismiss();
          toast.success("Location fetched successfully!");
        },
        (error) => {
          // console.error("Location Error:", error);
          toast.dismiss();
          toast.error("Unable to fetch location");
        }
      );
    } else {
      toast.dismiss();
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const searchLocation = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchAddress}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (error) {
      // console.error('Error searching location:', error);
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        setIsLoading(true);
        toast.loading('Registering hospital...');

        const hospitalData = new FormData();

        // Required fields validation
        const requiredFields = [
          'hospitalName',
          'email',
          'phone',
          'state',
          'city',
          'address',
          'password'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Append form fields properly
        Object.keys(formData).forEach(key => {
          if (key === 'image' && formData[key]) {
            hospitalData.append('image', formData[key]);
          } else if (formData[key]) {
            hospitalData.append(key, formData[key]);
          }
        });

        // Add location data if available
        if (selectedLocation) {
          hospitalData.append('latitude', selectedLocation.lat.toString());
          hospitalData.append('longitude', selectedLocation.lng.toString());
        }


        const response = await axios.post(
          'https://medico-care-theta.vercel.app/api/hospitals/register',
          hospitalData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );

        toast.dismiss();

        if (response.data.success) {
          toast.success('Registration successful!');
        }

      } catch (error) {
        toast.dismiss();
        // console.log('Full error:', error);
        // console.log('Error response:', error.response?.data);
        
        const errorMessage = error.response?.data?.message 
          || error.message 
          || 'Registration failed';
        
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Render Steps
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<FaHospital />}
                label="Hospital Name"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleInputChange}
                error={errors.hospitalName}
                required
              />
              <InputField
                icon={<FaEnvelope />}
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <InputField
                icon={<FaPhone />}
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
              />
              <InputField
                icon={<FaPhone />}
                label="Alternate Phone"
                name="alternatePhone"
                type="tel"
                value={formData.alternatePhone}
                onChange={handleInputChange}
              />
              <div className="md:col-span-2">
                <SelectField
                  icon={<FaMapMarkerAlt />}
                  label="State"
                  name="state"
                  options={Object.keys(INDIA_STATES_CITIES)}
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <SelectField
                  icon={<FaMapMarkerAlt />}
                  label="City"
                  name="city"
                  options={cities}
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.state}
                  error={errors.city}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  icon={<FaMapMarkerAlt />}
                  label="Complete Address"
                  name="address"
                  as="textarea"
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  required
                />
              </div>
              <InputField
                icon={<FaMapMarkerAlt />}
                label="Pincode"
                name="pincode"
                type="text"
                maxLength="6"
                value={formData.pincode}
                onChange={handleInputChange}
                error={errors.pincode}
                required
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Search location..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={searchLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
              
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCrosshairs className="w-5 h-5" />
                <span>Use Current Location</span>
              </button>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
              <MapContainer
                center={selectedLocation || { lat: 20.5937, lng: 78.9629 }}
                zoom={selectedLocation ? 13 : 5}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={selectedLocation} setPosition={setSelectedLocation} />
              </MapContainer>
              
              {selectedLocation && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                icon={<FaCalendar />}
                label="Established Year"
                name="establishedYear"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.establishedYear}
                onChange={handleInputChange}
                error={errors.establishedYear}
              />
              <InputField
                icon={<FaGlobe />}
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                error={errors.website}
              />
              <div className="md:col-span-2">
                <InputField
                  icon={<FaInfoCircle />}
                  label="Description"
                  name="description"
                  as="textarea"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={errors.description}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FaImage className="mr-2 text-blue-500" />
                    <label>Hospital Image</label>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, image: null }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="hospital-image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="hospital-image"
                          className="cursor-pointer text-blue-600 hover:text-blue-800"
                        >
                          Upload Hospital Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <InputField
                icon={<FaLock />}
                label="Set Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
              />
              <InputField
                icon={<FaLock />}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
              />
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Password strength:</p>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        formData.password.length < 6 
                          ? 'w-1/4 bg-red-500' 
                          : formData.password.length < 8 
                          ? 'w-2/4 bg-yellow-500'
                          : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Progress Steps */}
        <div className="relative mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center z-10">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ 
                    scale: step === num ? 1.1 : 1,
                    backgroundColor: step >= num ? '#2563eb' : '#fff'
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold
                    ${step >= num 
                      ? "text-white shadow-lg shadow-blue-200" 
                      : "text-gray-400 border-2 border-gray-200"
                    } transition-all duration-300`}
                >
                  {num}
                </motion.div>
                <span className="mt-3 text-sm font-medium text-gray-600">
                  {num === 1 && "Basic Info"}
                  {num === 2 && "Location"}
                  {num === 3 && "Details"}
                  {num === 4 && "Security"}
                </span>
              </div>
            ))}
            {/* Progress Line */}
            <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-200 -z-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            Hospital Registration
          </h2>

          <AnimatePresence mode="wait">
            <motion.form
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="group px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl 
                      hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: -3 }}
                      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    >←</motion.span>
                    <span>Previous Step</span>
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                      text-white rounded-xl hover:from-blue-700 hover:to-blue-800 
                      transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <span>Next Step</span>
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: 3 }}
                      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    >→</motion.span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`ml-auto px-6 py-3 bg-gradient-to-r 
                      ${isLoading 
                        ? 'from-gray-400 to-gray-500 cursor-not-allowed' 
                        : 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'} 
                      text-white rounded-xl transform transition-all hover:scale-105 shadow-lg`}
                  >
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

// Utility Components
const InputField = ({ icon, label, error, ...props }) => (
  <div className="space-y-2">
    <div className="flex items-center text-gray-600 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-blue-500" })}
      <label>{label}</label>
    </div>
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg border 
        ${error ? "border-red-500" : "border-gray-300"} 
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ 
  icon, 
  label, 
  options, 
  error,
  name,
  ...props 
}) => (
  <div className="space-y-2">
    <div className="flex items-center text-gray-600 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-blue-500" })}
      <label>{label}</label>
    </div>
    <select 
      {...props}
      name={name}
      className={`w-full px-4 py-3 rounded-lg border 
        ${error ? 'border-red-500' : 'border-gray-300'} 
        focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      <option value="">Select {label}</option>
      {name === "state" 
        ? Object.keys(INDIA_STATES_CITIES).map(state => (
            <option key={state} value={state}>{state}</option>
          ))
        : options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))
      }
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default HospitalRegistration;
