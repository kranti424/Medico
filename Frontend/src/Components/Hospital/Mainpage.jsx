import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaChartLine,
  FaUserInjured,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import HospitalNavbar from "../Navbar/HospitalNav";
// import LoadingSpinner from "../LoadingSpinner";

function HospitalDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalDoctors: 0,
    todayAppointments: 0,
    totalPatients: 0,
    revenue: 0, // Make sure this is initialized to 0
    weeklyStats: [],
    statusStats: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
        if (!hospitalData?.email) {
          throw new Error("Hospital data not found");
        }

        // Fetch total doctors
        const doctorsResponse = await axios.get(
          `https://medico-care-theta.vercel.app/api/v2/doctors/count/${hospitalData.email}`,
          { withCredentials: true }
        );

        // Fetch appointments stats
        const appointmentsResponse = await axios.get(
          `https://medico-care-theta.vercel.app/api/v2/doctors/stats/${hospitalData.email}`,
          { withCredentials: true }
        );

        if (doctorsResponse.data.success && appointmentsResponse.data.success) {
          setDashboardData({
            totalDoctors: doctorsResponse.data.count,
            todayAppointments: appointmentsResponse.data.pendingCount,
            totalPatients: appointmentsResponse.data.completedCount,
            revenue: appointmentsResponse.data.completedRevenue, // Changed to completedRevenue
            weeklyStats: appointmentsResponse.data.weeklyStats,
            statusStats: appointmentsResponse.data.statusStats,
            recentActivities: appointmentsResponse.data.recentActivities,
          });
        }
      } catch (error) {
        // console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return "Loading...";
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HospitalNavbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Doctors"
            value={dashboardData.totalDoctors}
            icon={<FaUserMd />}
            color="blue"
          />
          <StatsCard
            title="Pending Appointments" // Changed from "Today's Appointments"
            value={dashboardData.todayAppointments}
            icon={<FaCalendarCheck />}
            color="green"
          />
          <StatsCard
            title="Total Patients"
            value={dashboardData.totalPatients}
            icon={<FaUserInjured />}
            color="purple"
          />
          <StatsCard
            title="Revenue"
            value={`₹${dashboardData.revenue?.toLocaleString() || "0"}`}
            icon={<FaChartLine />}
            color="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Weekly Appointments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#6366F1"
                  fill="#818CF8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Appointment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.statusStats}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaClock className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-gray-500">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Add New Doctor
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                Schedule Appointment
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const StatsCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-6 rounded-xl shadow-lg border-b-4 border-${color}-500`}
  >
    <div className="flex items-center">
      <div
        className={`flex-shrink-0 h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center`}
      >
        <span className={`text-${color}-600 text-2xl`}>{icon}</span>
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default HospitalDashboard;
