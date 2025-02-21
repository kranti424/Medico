import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaClinicMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from 'js-cookie';

const ClinicLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // const validateToken = async () => {
    //   try {
    //     const response = await axios.get(
    //       "https://medico-care-theta.vercel.app/api/token/validate",
    //       {
    //         withCredentials: true, // Ensures cookies are sent automatically
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
  
    //     const isthere = localStorage.getItem("clinicData");
    //     if (response.data.success && isthere) {
    //       navigate("/clinic/dashboard");
    //     } else {
    //       localStorage.removeItem("clinicData");
    //       navigate("/cliniclogin"); // Redirect if token is invalid
    //     }
    //   } catch (error) {
    //     localStorage.removeItem("clinicData");
    //     navigate("/cliniclogin"); // Redirect if validation fails
    //   }
    // };
  
    // validateToken();
  }, [navigate]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      toast.dismiss();

      try {
        const response = await axios.post(
          "https://medico-care-theta.vercel.app/api/clinics/login",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );


        if (response.data.success) {
          const clinicData = response.data.clinic;
          
          Cookies.set("token", response.data.token, {
            expires: 7,
            // secure: true,
            sameSite: "None",
          });
  
          localStorage.setItem(
            "clinicData",
            JSON.stringify(clinicData)
          );
  
          toast.success("🎉 Login successful!");
          navigate("/clinic/dashboard");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto h-24 w-24 rounded-full bg-teal-100 flex items-center justify-center"
          >
            <FaClinicMedical className="h-12 w-12 text-teal-600" />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Clinic Login
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-gray-600 mb-1"
              >
                <FaEnvelope className="mr-2 text-teal-500" />
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none rounded-lg relative block w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Enter clinic email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center text-gray-600 mb-1"
              >
                <FaLock className="mr-2 text-teal-500" />
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none rounded-lg relative block w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-all duration-150`}
          >
            {loading ? (
              <span className="flex items-center">
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </motion.button>

          <div className="text-center">
            <Link
              to="/clinicregistration"
              className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
            >
              Not registered? Register your clinic
            </Link>
          </div>
        </form>
      </motion.div>
      <Toaster position="top-right" />
    </div>
  );
};

export default ClinicLogin;
