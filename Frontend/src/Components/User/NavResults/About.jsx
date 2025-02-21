import React from 'react';
import { motion } from 'framer-motion';
import {
  FaHospital,
  FaUserMd,
  FaUsers,
  FaAward,
  FaBullseye,
  FaHandHoldingMedical,
  FaHeartbeat,
  FaStethoscope,
  FaRegClock,
  FaShieldAlt,
} from "react-icons/fa";
import UserNav from "../../Navbar/UserNav";

const About = () => {
  const stats = [
    {
      number: "1000+",
      label: "Doctors",
      icon: <FaUserMd />,
      color: "from-blue-400 to-blue-600",
    },
    {
      number: "500+",
      label: "Hospitals",
      icon: <FaHospital />,
      color: "from-purple-400 to-purple-600",
    },
    {
      number: "50000+",
      label: "Patients Served",
      icon: <FaUsers />,
      color: "from-green-400 to-green-600",
    },
    {
      number: "4.8/5",
      label: "User Rating",
      icon: <FaAward />,
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  const values = [
    {
      icon: <FaHandHoldingMedical />,
      title: "Patient-Centric Care",
      description:
        "Your health and comfort are our top priorities. We ensure personalized care for every patient.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <FaStethoscope />,
      title: "Expert Healthcare",
      description:
        "Access to qualified medical professionals and state-of-the-art facilities.",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <FaRegClock />,
      title: "24/7 Availability",
      description:
        "Round-the-clock medical assistance and support when you need it most.",
      color: "from-green-400 to-green-600",
    },
  ];

  const features = [
    {
      title: "Smart Appointments",
      description: "Book appointments instantly with real-time availability",
      icon: <FaRegClock className="text-4xl text-blue-500" />,
    },
    {
      title: "Secure Platform",
      description: "Your medical data is protected with top-tier security",
      icon: <FaShieldAlt className="text-4xl text-purple-500" />,
    },
    {
      title: "Quality Healthcare",
      description: "Access to the best healthcare professionals",
      icon: <FaStethoscope className="text-4xl text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <UserNav />

      {/* Hero Section with Animation */}
      <div className="relative overflow-hidden py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Revolutionizing Healthcare
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Empowering healthcare through innovation and technology. Making
            quality healthcare accessible to everyone, everywhere.
          </motion.p>
        </motion.div>
      </div>

      {/* Stats Section with Hover Effects */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg p-8 text-white transform transition-all duration-300`}
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section with Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Why Choose Medico?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section with Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied patients and healthcare providers
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Contact Us Today
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;