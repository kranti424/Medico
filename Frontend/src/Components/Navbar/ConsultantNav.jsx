import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUserMd, FaCalendarCheck, FaChartLine, FaBars, 
    FaTimes, FaSignOutAlt, FaUser 
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const ConsultantNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [doctorData, setDoctorData] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('doctorData');
        if (storedData) {
            setDoctorData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('doctorData');
        navigate('/consultantlogin');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/consultant/home" className="flex items-center space-x-2">
                        <FaUserMd className="text-blue-600 h-8 w-8" />
                        <span className="font-bold text-xl text-gray-800">Consultant Dashboard</span>
                    </Link>

                    {/* Menu Button for Mobile */}
                    <button
                        className="md:hidden text-gray-600 hover:text-blue-600"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    {/* Navigation Links */}
                    <ul className={`md:flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0`} ref={menuRef}>
                        <li>
                            <Link to="/consultant/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/consultant/home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                                <FaUserMd className="mr-2" /> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/consultant/appointments" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/consultant/appointments' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                                <FaCalendarCheck className="mr-2" /> Appointments
                            </Link>
                        </li>
                        <li>
                            <Link to="/consultant/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/consultant/reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                                <FaChartLine className="mr-2" /> Reports
                            </Link>
                        </li>
                        {/* <li>
                            <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800">
                                <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </li> */}
                    </ul>

                    {/* Profile Menu */}
                    <div className="relative ml-4">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 h-10 px-3 hover:bg-gray-100 
                                     transition-colors rounded-md"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                                          flex items-center justify-center text-white font-semibold">
                                {doctorData?.name?.charAt(0)}
                            </div>
                            <span className="text-gray-700 font-medium">{doctorData?.name}</span>
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl 
                                             border border-gray-100 overflow-hidden"
                                >
                                    {/* User Info Section */}
                                    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 
                                                    flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-white p-1 shadow-md">
                                            <div className="w-full h-full rounded-full bg-gradient-to-r 
                                                          from-blue-500 to-blue-600 flex items-center 
                                                          justify-center text-white font-bold text-xl">
                                                {doctorData?.name?.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {doctorData?.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {doctorData?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Menu Options */}
                                    <div className="p-2">
                                        <Link
                                            to="/consultantprofile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 
                                                     rounded-xl transition-colors"
                                        >
                                            <FaUser className="text-blue-600 w-5 h-5" />
                                            <span className="text-gray-700 font-medium">My Profile</span>
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
            </div>
        </nav>
    );
};

export default ConsultantNav;
