import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHospital,
  FaUserMd,
  FaUser,
  FaSearch,
  FaQuestionCircle,
  FaHome,
  FaChevronRight,
  FaChevronDown,
  FaStethoscope,
  FaHeartbeat,
} from "react-icons/fa";
import UserNav from "../../Navbar/UserNav";

const TreeNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const indent = level * 24;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ marginLeft: `${indent}px` }}
    >
      <motion.div
        className="flex items-center py-2 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {node.items && (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="mr-2 text-blue-500"
          >
            <FaChevronRight />
          </motion.span>
        )}
        <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span className="text-xl">{node.icon}</span>
          <span className="font-medium">{node.title}</span>
          {node.description && (
            <span className="text-sm text-gray-500 hidden md:inline">
              - {node.description}
            </span>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && node.items && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-l-2 border-gray-200 ml-2 pl-4">
              {node.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-1"
                >
                  <Link
                    to={item.path}
                    className="flex items-center group hover:bg-blue-50 rounded-lg p-2 transition-all"
                  >
                    <FaStethoscope className="text-gray-400 group-hover:text-blue-500 mr-2" />
                    <span className="text-gray-700 group-hover:text-blue-600">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SiteMap = () => {
  const platformOverview = {
    title: "Medico Platform Overview",
    description:
      "A comprehensive healthcare management system connecting patients, hospitals, clinics, and consultants.",
    features: [
      "Centralized Healthcare Management",
      "Easy Appointment Booking",
      "Real-time Doctor Search",
      "Digital Medical Records",
      "Review & Rating System",
    ],
  };

  const navigationTree = [
    {
      title: "Main Portal",
      icon: <FaHome className="text-blue-600" />,
      description: "Start your healthcare journey",
      items: [
        { name: "Landing Page", path: "/", badge: "Start Here" },
        { name: "Healthcare Search", path: "/patientpage", badge: "Popular" },
        { name: "Doctor Registration", path: "/doctorpage" },
        { name: "Reviews", path: "/reviewpage" },
      ],
    },
    {
      title: "Patient Services",
      icon: <FaUser className="text-green-600" />,
      description: "Access healthcare services",
      items: [
        { name: "User Login", path: "/userlogin", badge: "Required" },
        { name: "User Dashboard", path: "/patientpage" },
        { name: "My Appointments", path: "/user/appointments" },
        { name: "My Profile", path: "/userprofile" },
        { name: "Search Doctors", path: "/patientpage" },
      ],
    },
    {
      title: "Hospital Hub",
      icon: <FaHospital className="text-red-600" />,
      description: "Hospital management portal",
      items: [
        { name: "Hospital Registration", path: "/hospitalregistration" },
        { name: "Hospital Login", path: "/hospitallogin" },
        { name: "Dashboard", path: "/hospitallogin" },
        { name: "Manage Doctors", path: "/hospital/alldoctors" },
        { name: "Add Doctor", path: "/hospital/adddoctor" },
        { name: "Hospital Profile", path: "/hospital/profile" },
        { name: "Appointments", path: "/hospital/appointments" },
      ],
    },
    {
      title: "Clinic Center",
      icon: <FaHospital className="text-purple-600" />,
      description: "Clinic management system",
      items: [
        { name: "Clinic Registration", path: "/clinicregistration" },
        { name: "Clinic Login", path: "/cliniclogin" },
        { name: "Dashboard", path: "/clinic/dashboard" },
        { name: "Add Doctor", path: "/clinicadddoctor" },
        { name: "All Doctors", path: "/clinicalldoctors" },
        { name: "Profile", path: "/clinicprofile" },
        { name: "Appointments", path: "/clinic/appointments" },
      ],
    },
    {
      title: "Consultant Portal",
      icon: <FaUserMd className="text-yellow-600" />,
      description: "For medical consultants",
      items: [
        { name: "Registration", path: "/consultantregistration" },
        { name: "Login", path: "/consultantlogin" },
        { name: "Dashboard", path: "/consultant/dashboard" },
        { name: "Appointments", path: "/consultant/appointments" },
        { name: "Profile", path: "/consultantprofile" },
      ],
    },
    {
      title: "Search & Discovery",
      icon: <FaSearch className="text-indigo-600" />,
      description: "Find healthcare services",
      items: [
        { name: "Specialty Search", path: "/specialtyresults" },
        { name: "Find Doctors", path: "/doctorresults" },
        { name: "Find Hospitals", path: "/hospitalresults" },
        { name: "Find Clinics", path: "/clinicresults" },
      ],
    },
    {
      title: "Help & Support",
      icon: <FaQuestionCircle className="text-teal-600" />,
      description: "Get assistance",
      items: [
        { name: "About Us", path: "/usernavabout" },
        { name: "Help Center", path: "/usernavhelp" },
        { name: "Navigation Guide", path: "/sitemap" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserNav />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-12 px-4 mt-10"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            Medico Navigation Tree
          </motion.h1>

          {/* Feature Pills */}
          <motion.div className="flex flex-wrap justify-center gap-3 mb-12 ">
            {platformOverview.features.map((feature, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full 
                         shadow-sm hover:shadow-md transition-all duration-300
                         text-sm text-gray-600 flex items-center gap-2"
              >
                <FaHeartbeat className="text-blue-500" />
                {feature}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Tree Structure */}
      <div className="max-w-6xl mx-auto px-4 pb-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-12">
        <div className="p-8">
          {navigationTree.map((section, index) => (
            <TreeNode key={index} node={section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
