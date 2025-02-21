import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaHospital,
  FaUserMd,
  FaClinicMedical,
  FaInfoCircle,
  FaAmbulance,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaChevronDown,
  FaPhoneAlt,
  FaShieldAlt,
  FaFire,
  FaPhoneVolume,
  FaUser,
  FaSignOutAlt,
  FaSitemap,
} from "react-icons/fa";
import Cookies from 'js-cookie';

const UserNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const token = Cookies.get('token');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/patientpage');
  };

  const navItems = [
    { name: "Home", path: "/patientpage", icon: <FaHome className="w-5 h-5" /> },
    {
      name: "Hospitals",
      path: "/usernavhospitals",
      icon: <FaHospital className="w-5 h-5" />,
    },
    {
      name: "Clinics",
      path: "/usernavclinic",
      icon: <FaClinicMedical className="w-5 h-5" />,
    },
    {
      name: "Doctors",
      path: "/usernavdoctors",
      icon: <FaUserMd className="w-5 h-5" />,
    },
   
    {
      name: "About Us",
      path: "/usernavabout",
      icon: <FaInfoCircle className="w-5 h-5" />,
    },
    {
      name: "SiteMap",
      path: "/sitemap",
      icon: <FaSitemap className="w-5 h-5" />,
    },
    {
      name: "Emergency",
      icon: <FaPhoneAlt className="w-5 h-5 text-red-500" />,
      subItems: [
        {
          name: "Ambulance - 102",
          phone: "102",
          icon: <FaAmbulance className="w-5 h-5 text-red-500" />,
        },
        {
          name: "Police - 100",
          phone: "100",
          icon: <FaShieldAlt className="w-5 h-5 text-blue-600" />,
        },
        {
          name: "Fire - 101",
          phone: "101",
          icon: <FaFire className="w-5 h-5 text-orange-500" />,
        },
        {
          name: "Women Helpline - 1091",
          phone: "1091",
          icon: <FaPhoneVolume className="w-5 h-5 text-purple-500" />,
        },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo - Updated with responsive margins */}
          <Link
            to="/"
            className="flex items-center gap-2 lg:-ml-10 ml-[-8px]" // Updated this line
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-white px-3 py-1.5 rounded-lg shadow-lg border border-gray-300 mr-6"
            >
              {/* Logo Text */}
              <span className="text-2xl font-bold text-[#2C3E50] tracking-wide">
                Medico
              </span>
              <span className="ml-2 text-sm text-[#16A085] uppercase font-medium tracking-wider">
                Healthcare
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                className="relative group"
                whileHover={{ scale: 1.02 }}
              >
                {item.subItems ? (
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.name ? null : item.name
                      )
                    }
                    className={`flex items-center px-4 py-2 rounded-xl group relative
                              ${
                                location.pathname === item.path
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                  : "text-gray-700 hover:bg-gray-50"
                              }
                              transition-all duration-300`}
                  >
                    <span
                      className="mr-2 text-blue-600 group-hover:text-indigo-600 
                                   transition-colors duration-300"
                    >
                      {item.icon}
                    </span>
                    {item.name}
                    <motion.span
                      animate={{
                        rotate: activeDropdown === item.name ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="ml-2"
                    >
                      <FaChevronDown className="text-sm" />
                    </motion.span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-xl relative
                              ${
                                location.pathname === item.path
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                  : "text-gray-700 hover:bg-gray-50"
                              }
                              transition-all duration-300`}
                  >
                    <span
                      className="mr-2 text-blue-600 group-hover:text-indigo-600 
                                   transition-colors duration-300"
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.subItems && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 w-56 mt-2 p-1
                               bg-white rounded-xl shadow-lg border border-gray-100"
                    >
                      {item.subItems.map((subItem) => (
                        <motion.div
                          key={subItem.name}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          {subItem.phone ? (
                            <a
                              href={`tel:${subItem.phone}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <span className="p-2 rounded-full bg-gray-100">
                                {subItem.icon}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {subItem.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Click to call
                                </p>
                              </div>
                            </a>
                          ) : (
                            <Link
                              to={subItem.path}
                              className="flex items-center px-4 py-3 rounded-lg text-gray-700 
                                       hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                                       transition-all duration-300"
                            >
                              <span className="mr-2 text-blue-600">
                                {subItem.icon}
                              </span>
                              {subItem.name}
                            </Link>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Login/Logout Button */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 h-10 px-3 hover:bg-gray-100 
                               transition-colors rounded-md"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                                  flex items-center justify-center text-white font-semibold"
                    >
                      {userData?.firstName?.charAt(0)}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {userData?.firstName}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl 
                                  border border-gray-100 overflow-hidden"
                    >
                      {/* User Info Section */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md">
                          <div
                            className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                                      flex items-center justify-center text-white font-bold text-xl"
                          >
                            {userData?.firstName?.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {userData?.firstName} {userData?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {userData?.email}
                          </p>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="p-2">
                        <Link
                          to="/userprofile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 
                                   rounded-xl transition-colors"
                        >
                          <FaUser className="text-blue-600 w-5 h-5" />
                          <span className="text-gray-700 font-medium">
                            My Profile
                          </span>
                        </Link>
                        <Link
                          to="/user/appointments"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 
                                   rounded-xl transition-colors"
                        >
                          <FaUser className="text-blue-600 w-5 h-5" />
                          <span className="text-gray-700 font-medium">
                            My Appointments
                          </span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 
                                   hover:text-red-600 w-full rounded-xl transition-colors"
                        >
                          <FaSignOutAlt className="w-5 h-5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/userlogin"
                  className="h-10 px-4 text-gray-700 hover:bg-gray-100 transition-colors 
                             rounded-md flex items-center gap-2"
                >
                  <FaSignInAlt />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Login/Logout Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {userData?.firstName?.charAt(0)}
                    </div>
                    <span className="font-medium">{userData?.firstName}</span>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                      >
                        <div className="p-4 border-b">
                          <p className="font-medium text-gray-900">{`${userData?.firstName} ${userData?.lastName}`}</p>
                          <p className="text-sm text-gray-500">
                            {userData?.email}
                          </p>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/userprofile"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <FaUser className="text-blue-600" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/user/appointments"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <FaUser className="text-blue-600" />
                            <span>My Appointments</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 w-full rounded-lg transition-colors"
                          >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/userlogin"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                           text-white rounded-xl shadow-md hover:shadow-lg
                           transition-all duration-300 flex items-center font-medium"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
              )}
            </motion.div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-50 
                         transition-all duration-200 hover:shadow-md"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden py-4 bg-white/80 backdrop-blur-md rounded-xl mt-2 shadow-xl"
            >
              <div className="py-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.subItems ? (
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.name ? null : item.name
                          )
                        }
                        className="w-full flex items-center px-4 py-3 text-gray-700 
                                 hover:bg-blue-50 transition-colors"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                        <FaChevronDown
                          className={`ml-auto transform transition-transform duration-200
                          ${activeDropdown === item.name ? "rotate-180" : ""}`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className="w-full flex items-center px-4 py-3 text-gray-700 
                                 hover:bg-blue-50 transition-colors"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                      </Link>
                    )}

                    {/* Mobile Dropdown */}
                    <AnimatePresence>
                      {item.subItems && activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-gray-50 py-2"
                        >
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="flex items-center px-8 py-3 text-gray-700 
                                       hover:bg-blue-50 transition-colors"
                            >
                              <span className="mr-2">{subItem.icon}</span>
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default UserNav;