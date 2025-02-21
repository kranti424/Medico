import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaHospital,
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaCheckCircle,
  FaHourglassHalf,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";
import UserNav from "../Navbar/UserNav";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, completed, rejected, accepted
  const [showInfo, setShowInfo] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData) throw new Error("No user data found");

        const response = await axios.get(
          `https://medico-care-theta.vercel.app/api/appointments/user/${userData.email}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaHourglassHalf className="w-4 h-4" />;
      case "completed":
        return <FaCheckCircle className="w-4 h-4" />;
      case "accepted":
        return <FaCheckCircle className="w-4 h-4" />;
      case "rejected":
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.patch(
        `https://medico-care-theta.vercel.app/api/appointments/${appointmentId}/status`,
        { status: newStatus,
          withCredentials: true
         }
      );

      if (response.data.success) {
        setAppointments(
          appointments.map((apt) =>
            apt._id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );
        toast.success(`Appointment ${newStatus} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const filteredAppointments = appointments.filter((apt) =>
    filter === "all" ? true : apt.status.toLowerCase() === filter.toLowerCase()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">
            View and manage your medical appointments
          </p>
        </div>

        <div className="mb-6 flex gap-4 flex-wrap">
          {["all", "pending", "completed", "accepted", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-colors duration-200`}
              >
                {status}
              </button>
            )
          )}
        </div>

        <div className="grid gap-6">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserMd className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Dr. {appointment.doctorName}
                      </h3>
                      <p className="text-gray-500">
                        {appointment.organizationName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaHospital className="w-4 h-4" />
                      <span>{appointment.organizationType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="w-4 h-4" />
                      <span>{`${appointment.timeSlots.start} - ${appointment.timeSlots.end}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="w-4 h-4" />
                      <span>{appointment.organizationEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div
                    className={`px-4 py-2 rounded-full flex items-center gap-2 
                    ${getStatusColor(appointment.status)}`}
                  >
                    {getStatusIcon(appointment.status)}
                    <span className="font-medium">{appointment.status}</span>
                  </div>

                  <div className="flex gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "accepted")
                          }
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 
                                   transition-colors flex items-center gap-2"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "rejected")
                          }
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 
                                   transition-colors flex items-center gap-2"
                        >
                          <FaTimesCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowInfo(true);
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 
                               transition-colors flex items-center gap-2"
                    >
                      <FaInfoCircle className="w-4 h-4" />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No appointments found</p>
            </div>
          )}
        </div>

        {showInfo && selectedAppointment && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Appointment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.firstName} {selectedAppointment.lastName}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Age</label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.age} years
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Phone</label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.phone}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.email}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Doctor</label>
                <p className="text-gray-900 font-semibold">
                  Dr. {selectedAppointment.doctorName}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Doctor Email</label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.doctorEmail}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Date</label>
                <p className="text-gray-900 font-semibold">
                  {new Date(
                    selectedAppointment.appointmentDate
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Time Slot</label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.timeSlots.start} -{" "}
                  {selectedAppointment.timeSlots.end}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Status</label>
                <p
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-1
                  ${getStatusColor(selectedAppointment.status)}`}
                >
                  {getStatusIcon(selectedAppointment.status)}
                  {selectedAppointment.status}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">Created On</label>
                <p className="text-gray-900 font-semibold">
                  {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">
                  Organization Name
                </label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.organizationName}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">
                  Organization Type
                </label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.organizationType}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-500">
                  Organization Email
                </label>
                <p className="text-gray-900 font-semibold">
                  {selectedAppointment.organizationEmail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppointments;
