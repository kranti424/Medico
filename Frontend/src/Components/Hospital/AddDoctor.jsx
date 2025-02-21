import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserMd,
  FaGraduationCap,
  FaClock,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaMoneyBill,
  FaFileAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HospitalNavbar from '../Navbar/HospitalNav';

const InputField = React.memo(({ icon, label, error, required, ...props }) => (
  <div className="space-y-2">
    <div className="flex items-center text-gray-600 mb-1">
      {icon && React.cloneElement(icon, { className: "mr-2 text-blue-500" })}
      <label>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg border 
        ${error ? "border-red-500" : "border-gray-300"} 
        focus:outline-none focus:ring-2 focus:ring-blue-500
        bg-white/50 backdrop-blur-sm`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

const AddDoctor = () => {
  const navigate = useNavigate();
  const hospitalData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("hospitalData"));
    } catch (error) {
      // console.error("Error parsing hospital data:", error);
      return null;
    }
  }, []);

  // Protect against null hospitalData

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({}); // Add error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Organization data from localStorage
    organizationId: hospitalData?.id || "",
    organizationType: hospitalData?.role || "", // Add role from localStorage
    organizationName: hospitalData?.hospitalName || "",
    organizationEmail: hospitalData?.email || "",
    state: hospitalData?.state || "",
    city: hospitalData?.city || "",
    address: hospitalData?.address || "",
    latitude: hospitalData?.latitude || "",
    longitude: hospitalData?.longitude || "",

    // User input data
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    degrees: [],
    experience: "",
    specialties: [],
    consultationFees: "",
    availableDays: [],
    timeSlots: {
      start: "",
      end: "",
    },
    userId: "",
    password: "",
    confirmPassword: "",
    description: "",
    profileImage: null,
  });

  const degrees = [
    "MBBS",
    "MD",
    "MS",
    "DNB",
    "DM",
    "MCh",
    "BDS",
    "MDS",
    "BHMS",
    "BAMS",
    "BUMS",
    "DHMS",
    "PhD",
  ];

  const specialties = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "ENT",
    "Ophthalmology",
    "Psychiatry",
    "Dental",
    "General Medicine",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user types
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleDaySelect = (e) => {
    const day = e.target.value;
    setFormData((prev) => ({
      ...prev,
      availableDays: e.target.checked
        ? [...prev.availableDays, day]
        : prev.availableDays.filter((d) => d !== day),
    }));
  };

  const handleTimeChange = (e, timeType) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [timeType]: e.target.value,
      },
    }));
  };

  // Update validateFields function with more specific error messages
  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    // Basic Information validation
    if (!formData.name?.trim()) {
      newErrors.name = "Doctor's name is required";
      isValid = false;
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Doctor's email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!formData.phone?.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number is required";
      isValid = false;
    }

    // Education & Experience validation
    if (!formData.degrees?.length) {
      newErrors.degrees = "Select at least one degree";
      isValid = false;
    }
    if (!formData.specialties?.length) {
      newErrors.specialties = "Select at least one specialty";
      isValid = false;
    }
    if (!formData.experience) {
      newErrors.experience = "Years of experience is required";
      isValid = false;
    }
    if (!formData.consultationFees) {
      newErrors.consultationFees = "Consultation fees is required";
      isValid = false;
    }

    // Availability validation
    if (!formData.availableDays?.length) {
      newErrors.availableDays = "Select available days";
      isValid = false;
    }
    if (!formData.timeSlots.start || !formData.timeSlots.end) {
      newErrors.timeSlots = "Time slots are required";
      isValid = false;
    }

    // Account validation
    if (!formData.userId?.trim()) {
      newErrors.userId = "User ID is required";
      isValid = false;
    }
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      toast.error("Please fill all required fields correctly");
    }

    return isValid;
  };

  // Update the handleSubmit function with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields first
    if (!validateFields()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Validate image
      if (!formData.profileImage) {
        toast.error("Profile image is required");
        setIsSubmitting(false);
        return;
      }

      // Handle arrays and objects properly
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData[key] instanceof File) {
          formDataToSend.append("profileImage", formData[key]);
        } else if (Array.isArray(formData[key])) {
          // Convert arrays to strings
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (
          formData[key] !== null &&
          typeof formData[key] === "object" &&
          !(formData[key] instanceof File)
        ) {
          // Convert objects to strings
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          // Handle primitive values
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("https://medico-care-theta.vercel.app/api/doctors/add", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Doctor added successfully!");
        setTimeout(() => {
          navigate("/hospital/dashboard");
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("duplicate")) {
          toast.error("This user ID or email is already in use");
        } else if (error.response.data.message.includes("validation")) {
          toast.error("Please check all required fields");
        } else {
          toast.error(error.response.data.message || "Failed to add doctor");
        }
      } else if (error.message.includes("Network Error")) {
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("Something went wrong. Please try again");
      }
    }
  };

  const FormSteps = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <motion.div
          key={step}
          className={`flex items-center ${step !== 4 ? "w-32" : ""}`}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${
                currentStep >= step ? "bg-blue-600" : "bg-gray-300"
              } text-white`}
          >
            {step === 1 && <FaUserMd />}
            {step === 2 && <FaGraduationCap />}
            {step === 3 && <FaClock />}
            {step === 4 && <FaKey />}
          </motion.div>
          {step !== 4 && (
            <div
              className={`h-1 w-full ${
                currentStep > step ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          )}
        </motion.div>
      ))}
    </div>
  );

  const BasicInfo = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            icon={<FaUserMd />}
            label="Doctor's Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />

          <InputField
            icon={<FaPhone />}
            label="Phone Number"
            name="phone"
            type="tel"
            pattern="[0-9]{10}"
            maxLength="10"
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
            pattern="[0-9]{10}"
            maxLength="10"
            value={formData.alternatePhone}
            onChange={handleInputChange}
            error={errors.alternatePhone}
          />

          <InputField
            icon={<FaEnvelope />}
            label="Doctor's Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
          />
        </div>
      </motion.div>
    ),
    [
      formData.name,
      formData.email,
      formData.phone,
      formData.alternatePhone,
      handleInputChange,
      errors,
    ]
  );

  const MultiSelect = ({ options, selected, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        {/* <HospitalNavbar /> */}
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white/50 border border-gray-300 rounded-lg px-4 py-2 text-left 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span className="block truncate">
              {selected.length > 0
                ? `${selected.length} selected`
                : "Select options"}
            </span>
          </button>

          {/* Selected items tags */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selected.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                >
                  {item}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(selected.filter((i) => i !== item));
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
              <div className="p-2 space-y-1">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? [...selected, option]
                          : selected.filter((i) => i !== option);
                        onChange(newSelected);
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Update EducationExperience component
  const EducationExperience = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MultiSelect
            label="Select Degrees"
            options={degrees}
            selected={formData.degrees}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, degrees: selected }))
            }
          />
          <MultiSelect
            label="Select Specialties"
            options={specialties}
            selected={formData.specialties}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, specialties: selected }))
            }
          />
          <InputField
            icon={<FaGraduationCap />}
            label="Years of Experience"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleInputChange}
            error={errors.experience}
            required
          />
          <InputField
            icon={<FaMoneyBill />}
            label="Consultation Fees (₹)"
            name="consultationFees"
            type="number"
            value={formData.consultationFees}
            onChange={handleInputChange}
            error={errors.consultationFees}
            required
          />
        </div>
      </motion.div>
    ),
    [
      formData.degrees,
      formData.specialties,
      formData.experience,
      formData.consultationFees,
      handleInputChange,
      errors,
    ]
  );

  const Availability = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Available Days
          </label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={day}
                  checked={formData.availableDays.includes(day)}
                  onChange={(e) => handleDaySelect(e)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Time Slots
          </label>
          <div className="flex space-x-4">
            <input
              type="time"
              name="start"
              className="input-field"
              value={formData.timeSlots.start}
              onChange={(e) => handleTimeChange(e, "start")}
            />
            <input
              type="time"
              name="end"
              className="input-field"
              value={formData.timeSlots.end}
              onChange={(e) => handleTimeChange(e, "end")}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const AccountSetup = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleInputChange}
          placeholder="Enter user ID (alphanumeric)"
          label="User ID"
        />

        <InputField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter password"
          label="Password"
        />

        <InputField
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm password"
          label="Confirm Password"
        />
      </div>
    ),
    [
      formData.userId,
      formData.password,
      formData.confirmPassword,
      handleInputChange,
    ]
  );

  const DescriptionAndImage = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 mb-1">
            <FaFileAlt className="mr-2 text-blue-500" />
            <label>
              Doctor's Description <span className="text-red-500">*</span>
            </label>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border 
              ${errors.description ? "border-red-500" : "border-gray-300"} 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              bg-white/50 backdrop-blur-sm`}
            rows="4"
            placeholder="Enter detailed description about doctor's experience, expertise, and achievements..."
            required
            minLength={50}
            maxLength={1000}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600 mb-1">
            <FaUserMd className="mr-2 text-blue-500" />
            <label>
              Profile Image <span className="text-red-500">*</span>
            </label>
          </div>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                profileImage: e.target.files[0],
              }));
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     bg-white/50 backdrop-blur-sm"
            required
          />
          {formData.profileImage && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    ),
    [formData.description, formData.profileImage, handleInputChange, errors]
  );

  return (
    <>
    <HospitalNavbar />
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-vector/healthcare-blue-color-medical-concept-background_1055-10291.jpghttps://img.freepik.com/free-vector/medical-background-bright-blue-color_1017-11127.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-blue-600/40" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/30 rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Add New Doctor
          </h2>

          <FormSteps />

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Basic Information
                </h3>
                {BasicInfo}
                <div className="mt-6">{DescriptionAndImage}</div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Education & Experience
                </h3>
                {EducationExperience}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Availability
                </h3>
                <Availability />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/40 backdrop-blur-md rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Account Setup
                </h3>
                {AccountSetup}
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentStep((curr) => curr - 1)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                           transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Previous
                </motion.button>
              )}

              {currentStep < 4 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentStep((curr) => curr + 1)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 
                           text-white rounded-lg hover:from-blue-700 hover:to-blue-500 
                           transition-all duration-200 shadow-lg hover:shadow-xl ml-auto"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 
                           text-white rounded-lg hover:from-blue-700 hover:to-blue-500 
                           transition-all duration-200 shadow-lg hover:shadow-xl ml-auto
                           ${
                             isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                           }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
    </>
  );
};

// Export with memo
export default memo(AddDoctor);