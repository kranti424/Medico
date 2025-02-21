import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendar, 
  FaMars, FaHome, FaEdit, FaBell
} from 'react-icons/fa';
import UserNav from '../Navbar/UserNav';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (typeof parsedData === 'object' && parsedData !== null) {
          setUserData(parsedData);
        } else {
          setError('Invalid user data format');
        }
      } else {
        setError('No user data found');
      }
    } catch (err) {
      setError('Error loading user data');
      // console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderNotificationPreferences = () => {
    if (!userData?.notificationPreferences) return null;
    
    return Object.entries(userData.notificationPreferences).map(([key, value]) => (
      <div key={key} className="flex items-center justify-between">
        <span className="text-gray-600 capitalize">{key}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            readOnly
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 
                         peer-checked:after:translate-x-full after:content-[''] after:absolute 
                         after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                         after:h-5 after:w-5 after:transition-all">
          </div>
        </label>
      </div>
    ));
  };

  if (loading) {
    return (
      <>

      
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <>
      <UserNav />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
      <UserNav />
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">No user data available</div>
      </div>
      </>
    );
  }

  return (
    <>
    <UserNav />
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-64">
        <div className="container mx-auto px-4 h-full flex items-end pb-16">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100">
                {userData?.image ? (
                  <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-blue-400" />
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {`${userData?.firstName || ''} ${userData?.lastName || ''}`}
              </h2>
              <p className="text-gray-500 flex items-center gap-2">
                <FaEnvelope />
                {userData?.email}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Info Card */}
            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData?.phone && (
                  <InfoField icon={<FaPhone className="text-blue-600" />} label="Phone" value={userData.phone} />
                )}
                {userData?.dateOfBirth && (
                  <InfoField 
                    icon={<FaCalendar className="text-blue-600" />} 
                    label="Date of Birth" 
                    value={new Date(userData.dateOfBirth).toLocaleDateString()} 
                  />
                )}
                {userData?.gender && (
                  <InfoField icon={<FaMars className="text-blue-600" />} label="Gender" value={userData.gender} />
                )}
                {Object.keys(userData?.address || {}).length > 0 ? (
                  <InfoField 
                    icon={<FaHome className="text-blue-600" />} 
                    label="Address" 
                    value={userData.address} 
                  />
                ) : (
                  <InfoField 
                    icon={<FaHome className="text-blue-600" />} 
                    label="Address" 
                    value="Not provided" 
                  />
                )}
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaBell className="text-blue-600" />
                Notifications
              </h3>
              <div className="space-y-4">
                {renderNotificationPreferences()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

// InfoField component
const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">
        {typeof value === 'object' ? 
          (Object.keys(value).length === 0 ? 'Not provided' : JSON.stringify(value)) 
          : value}
      </p>
    </div>
  </div>
);

export default ProfilePage;