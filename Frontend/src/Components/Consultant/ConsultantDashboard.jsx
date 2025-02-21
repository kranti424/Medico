import React, { useState, useEffect } from "react";
import axios from "axios"; // Add this import
import { toast } from "react-toastify"; // Add this import
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaCalendarCheck,
  FaChartLine,
  FaUserFriends,
  FaClock,
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
import ConsultantNavbar from "../Navbar/ConsultantNav";

function ConsultantDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalConsultations: 0,
    upcomingConsultations: 0,
    totalClients: 0,
    earnings: 0,
    weeklyStats: [],
    statusStats: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const doctorData = JSON.parse(localStorage.getItem("doctorData"));
        if (!doctorData?.email || !doctorData?.organizationEmail) {
          throw new Error("Doctor data incomplete");
        }

        const response = await axios.get(
          `https://medico-care-theta.vercel.app/api/v1/consultant/dashboard/${doctorData.email}/${doctorData.organizationEmail}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setDashboardData({
            totalConsultations: response.data.completedCount,
            upcomingConsultations: response.data.acceptedCount,
            totalClients: response.data.pendingCount,
            earnings: response.data.totalEarnings,
            weeklyStats: response.data.weeklyStats,
            statusStats: response.data.statusStats,
            recentActivities: response.data.recentActivities,
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ConsultantNavbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Consultations"
            value={dashboardData.totalConsultations}
            icon={<FaUserTie />}
            color="blue"
          />
          <StatsCard
            title="Upcoming Consultations"
            value={dashboardData.upcomingConsultations}
            icon={<FaCalendarCheck />}
            color="green"
          />
          <StatsCard
            title="Total Clients"
            value={dashboardData.totalClients}
            icon={<FaUserFriends />}
            color="purple"
          />
          <StatsCard
            title="Earnings"
            value={`₹${dashboardData.earnings?.toLocaleString() || "0"}`}
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
            <h3 className="text-lg font-semibold mb-4">Weekly Consultations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="consultations"
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
            <h3 className="text-lg font-semibold mb-4">Consultation Status</h3>
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

        {/* Recent Activity & Quick Actions */}
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
              <button className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                Add New Client
              </button>
              <button className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md">
                Schedule Consultation
              </button>
              <button className="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md">
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
        className={`h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center`}
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

export default ConsultantDashboard;
