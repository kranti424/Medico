import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaChartLine,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
  FaCaretDown,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import Cookies from "js-cookie";

const ClinicNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const clinicData = JSON.parse(localStorage.getItem("clinicData"));

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("clinicData");
    navigate("/cliniclogin");
  };

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const navigation = [
    { name: "Dashboard", path: "/clinic/dashboard", icon: <FaChartLine /> },
    {
      name: "Doctors",
      icon: <FaUserMd />,
      isDropdown: true,
      items: [
        {
          name: "View All Doctors",
          path: "/clinicalldoctors",
          icon: <FaUsers />,
        },
        {
          name: "Add Doctor",
          path: "/clinicadddoctor",
          icon: <FaUserPlus />,
        },
      ],
    },
    {
      name: "Appointments",
      path: "/clinic/appointments",
      icon: <FaCalendarCheck />,
    },
  ];

  const DesktopNavItem = ({ item }) => {
    if (item.isDropdown) {
      return (
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle(item.name)}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600"
          >
            {item.icon}
            <span>{item.name}</span>
            <FaCaretDown
              className={`transition-transform duration-200 ${
                activeDropdown === item.name ? "rotate-180" : ""
              }`}
            />
          </button>
          {activeDropdown === item.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-10 w-48 py-2 mt-1 bg-white rounded-lg shadow-xl"
            >
              {item.items.map((subItem, idx) => (
                <Link
                  key={idx}
                  to={subItem.path}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={() => setActiveDropdown(null)}
                >
                  {subItem.icon}
                  <span>{subItem.name}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.path}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600"
      >
        {item.icon}
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Clinic Name */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-800 md:hidden"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            <Link
              to="/clinic/dashboard"
              className="flex items-center space-x-2"
            >
              <span className="text-xl font-bold text-blue-700">Clinic:
                {clinicData?.clinicName || "Clinic Portal"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item, idx) => (
              <DesktopNavItem key={idx} item={item} />
            ))}
          </div>

          {/* Profile Menu */}
          <div className="relative ml-4">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 h-10 px-3 hover:bg-gray-100 
                       transition-colors rounded-md"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                {clinicData?.image ? (
                  <img
                    src={clinicData.image}
                    alt={clinicData.clinicName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 
                       flex items-center justify-center text-white font-semibold"
                  >
                    {clinicData?.clinicName?.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-gray-700 font-medium">
                {clinicData?.clinicName}
              </span>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white 
                             rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  {/* Clinic Info Section */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md">
                      {clinicData?.image ? (
                        <img
                          src={clinicData.image}
                          alt={clinicData.clinicName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full bg-gradient-to-r 
                                      from-blue-500 to-blue-600 flex items-center justify-center 
                                      text-white font-bold text-xl"
                        >
                          {clinicData?.clinicName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {clinicData?.clinicName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {clinicData?.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="p-2">
                    <Link
                      to="/clinicprofile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 
                                 rounded-xl transition-colors"
                    >
                      <FaUser className="text-blue-600 w-5 h-5" />
                      <span className="text-gray-700 font-medium">
                        My Profile
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 
                                 hover:bg-red-50 hover:text-red-600 w-full rounded-xl 
                                 transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item, idx) => {
                  if (item.isDropdown) {
                    return (
                      <div key={idx}>
                        <button
                          onClick={() => handleDropdownToggle(item.name)}
                          className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.name}</span>
                          </div>
                          <FaCaretDown
                            className={
                              activeDropdown === item.name ? "rotate-180" : ""
                            }
                          />
                        </button>
                        {activeDropdown === item.name && (
                          <div className="pl-4 space-y-1">
                            {item.items.map((subItem, subIdx) => (
                              <Link
                                key={subIdx}
                                to={subItem.path}
                                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.icon}
                                <span>{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default ClinicNav;
