import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, 
  FaUser, FaCalendar, FaPhone, FaMars, FaHome, FaImage 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [profilePicture, setProfilePicture] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      
      // Add image file if exists
      if (profilePicture) {
        formData.append('image', profilePicture); // Changed from 'profilePicture' to 'image'
      }
      const response = await axios.post(`https://medico-care-theta.vercel.app${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.status === 'success') {
        Cookies.set("token", response.data.token, {
          expires: 7, // 7 days
          secure: true,
          sameSite: "None",
        });
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/patientpage'); // Updated navigation path
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Toggle Buttons */}
          <div className="flex border-b">
            <button
              type="button"
              onClick={toggleForm}
              className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2
                ${isLogin ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <FaSignInAlt />
              Login
            </button>
            <button
              type="button"
              onClick={toggleForm}
              className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2
                ${!isLogin ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <FaUserPlus />
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <div className="mt-1 relative">
                          <FaUser className="absolute top-3 left-3 text-gray-400" />
                          <input
                            {...register('firstName', { required: 'First name is required' })}
                            className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="First name"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <div className="mt-1 relative">
                          <FaUser className="absolute top-3 left-3 text-gray-400" />
                          <input
                            {...register('lastName', { required: 'Last name is required' })}
                            className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Last name"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <div className="mt-1 relative">
                        <FaPhone className="absolute top-3 left-3 text-gray-400" />
                        <input
                          {...register('phone', { 
                            required: 'Phone is required',
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Invalid phone number'
                            }
                          })}
                          className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <div className="mt-1 relative">
                        <FaCalendar className="absolute top-3 left-3 text-gray-400" />
                        <input
                          type="date"
                          {...register('dateOfBirth', { required: 'Date of birth is required' })}
                          className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <div className="mt-1 relative">
                        <FaMars className="absolute top-3 left-3 text-gray-400" />
                        <select
                          {...register('gender', { required: 'Gender is required' })}
                          className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <div className="mt-1 relative">
                        <FaHome className="absolute top-3 left-3 text-gray-400" />
                        <input
                          {...register('address', { required: 'Address is required' })}
                          className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Address"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                      <div className="mt-1 relative">
                        <FaImage className="absolute top-3 left-3 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProfilePicture(e.target.files[0])}
                          className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 relative">
                    <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative">
                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                      className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {isLogin ? 'Logging in...' : 'Signing up...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? <FaSignInAlt className="mr-2" /> : <FaUserPlus className="mr-2" />}
                      {isLogin ? 'Login' : 'Sign Up'}
                    </div>
                  )}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />

      {/* Success Animation */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Login Successful!</h2>
            <p className="text-gray-700">Redirecting to the main page...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Auth;