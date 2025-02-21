import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhone, FaBook, 
  FaAmbulance, FaSearch, FaChevronDown, FaComments,
  FaUserCircle, FaHospital, FaCalendarAlt 
} from 'react-icons/fa';
import UserNav from '../../Navbar/UserNav';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "Navigate to the Doctors section, select your preferred doctor, and click on 'Book Appointment'. Choose your preferred time slot and confirm the booking.",
      icon: <FaCalendarAlt />
    },
    {
      question: "How can I find nearby hospitals?",
      answer: "Use the Hospitals section in the navigation bar. Enable location services to find hospitals near you, or search by city/area.",
      icon: <FaHospital />
    },
    {
      question: "How do I create/update my profile?",
      answer: "Click on your profile icon in the top right corner. You can edit your personal information, medical history, and preferences.",
      icon: <FaUserCircle />
    }
  ];

  const quickGuides = [
    {
      title: "Finding a Doctor",
      steps: [
        "Click on 'Doctors' in the navigation bar",
        "Use filters to narrow your search",
        "View doctor profiles and ratings",
        "Book an appointment with your chosen doctor"
      ]
    },
    {
      title: "Emergency Services",
      steps: [
        "Click on 'Emergency Care' under Services",
        "Enable location services",
        "View nearest emergency facilities",
        "Get instant directions"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-20 px-4">
      <UserNav />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">How Can We Help You?</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-blue-100 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 outline-none text-lg pl-12"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Connect with our support team instantly</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Start Chat
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Support</h3>
            <p className="text-gray-600 mb-4">24/7 helpline available</p>
            <a href="tel:1800-123-4567" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block">
              1800-123-4567
            </a>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
          >
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaAmbulance className="text-2xl text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Emergency</h3>
            <p className="text-gray-600 mb-4">Get immediate medical assistance</p>
            <a href="tel:108" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-block">
              Call 108
            </a>
          </motion.div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border rounded-lg"
                initial={false}
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setActiveSection(activeSection === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    {faq.icon}
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: activeSection === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeSection === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickGuides.map((guide, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaBook className="text-blue-600" />
                {guide.title}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;