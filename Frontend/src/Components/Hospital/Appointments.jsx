import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendar,
  FaChevronDown,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaStethoscope,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import HospitalNavbar from "../Navbar/HospitalNav";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
        const response = await axios.get(
          `https://medico-care-theta.vercel.app/api/appointments/all?email=${hospitalData.email}`,
          { withCredentials: true } 
        );

        if (response.data.success) {
          // Group appointments by doctor
          const appointmentsByDoctor = response.data.data.reduce(
            (acc, appointment) => {
              const doctorEmail = appointment.doctorEmail;
              if (!acc[doctorEmail]) {
                acc[doctorEmail] = {
                  _id: doctorEmail,
                  name: appointment.doctorName,
                  appointments: [],
                };
              }
              acc[doctorEmail].appointments.push({
                id: appointment._id,
                patientName: `${appointment.firstName} ${appointment.lastName}`,
                time: `${appointment.timeSlots.start} - ${appointment.timeSlots.end}`,
                status: appointment.status.toLowerCase(),
                phone: appointment.phone,
                email: appointment.email,
                appointmentDate: new Date(
                  appointment.appointmentDate
                ).toLocaleDateString(),
                age: appointment.age,
              });
              return acc;
            },
            {}
          );

          setDoctors(Object.values(appointmentsByDoctor));
        }
      } catch (err) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = (appointments) => {
    return appointments.filter((appointment) => {
      // Convert selected date to match appointment date format
      const formattedSelectedDate =
        selectedDate === "all"
          ? "all"
          : new Date(selectedDate).toLocaleDateString();

      // Compare dates and status
      const dateMatches =
        selectedDate === "all" ||
        appointment.appointmentDate === formattedSelectedDate;
      const statusMatches =
        selectedStatus === "all" || appointment.status === selectedStatus;

      return dateMatches && statusMatches;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HospitalNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HospitalNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-red-500 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HospitalNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value || "all")}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaUserMd className="text-gray-400 text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Doctors Found
            </h2>
            <p className="text-gray-500">
              There are currently no appointments.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedDoctor(
                      expandedDoctor === doctor._id ? null : doctor._id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserMd className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {doctor.appointments.length} appointments
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedDoctor === doctor._id ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown className="text-gray-400" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedDoctor === doctor._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t px-4 py-3">
                        {filteredAppointments(doctor.appointments).length >
                        0 ? (
                          <div className="space-y-3">
                            {filteredAppointments(doctor.appointments).map(
                              (appointment) => (
                                <div
                                  key={appointment.id}
                                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <FaUser className="text-gray-400" />
                                        <span className="font-medium">
                                          {appointment.patientName}
                                        </span>
                                      </div>
                                      <div className="flex items-center mt-1 space-x-2 text-sm text-gray-600">
                                        <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                                        <span className="text-sm text-gray-600">
                                          {appointment.appointmentDate}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        <div className="flex items-center space-x-2">
                                          <FaClock className="text-gray-400" />
                                          <span>{appointment.time}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <FaPhone className="text-gray-400" />
                                          <span>{appointment.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <FaEnvelope className="text-gray-400" />
                                          <span>{appointment.email}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {appointment.status === "completed" && (
                                        <FaCheckCircle className="text-green-500" />
                                      )}
                                      {appointment.status === "cancelled" && (
                                        <FaTimesCircle className="text-red-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            No {selectedStatus} appointments found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
