import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaChartLine,
  FaUserInjured,
  FaPrescription,
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
// import HospitalNavbar from '../Navbar/ClinicNav';
import ClinicNav from "../Navbar/ClinicNav";

const appointmentData = [
  { name: "Mon", count: 24 },
  { name: "Tue", count: 18 },
  { name: "Wed", count: 22 },
  { name: "Thu", count: 26 },
  { name: "Fri", count: 30 },
  { name: "Sat", count: 15 },
  { name: "Sun", count: 10 },
];

const patientStats = [
  { name: "New", value: 45, color: "#10B981" },
  { name: "Regular", value: 35, color: "#3B82F6" },
  { name: "Follow-up", value: 20, color: "#F59E0B" },
];
// const clinicData=JSON.parse(localStorage.getItem('clinicData'));
function ClinicDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalDoctors: 0,
    todayAppointments: 0,
    totalPatients: 0,
    revenue: 0,
    weeklyStats: [],
    statusStats: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const clinicData = JSON.parse(localStorage.getItem("clinicData"));
        if (!clinicData?.email) {
          throw new Error("Clinic data not found");
        }

        // Fetch total doctors
        const doctorsResponse = await axios.get(
          `https://medico-care-theta.vercel.app/api/clinic/doctors/count/${clinicData.email}`,
          { withCredentials: true }
        );

        // Fetch appointments stats
        const appointmentsResponse = await axios.get(
          `https://medico-care-theta.vercel.app/api/clinic/stats/${clinicData.email}`,
          { withCredentials: true }
        );

        if (doctorsResponse.data.success && appointmentsResponse.data.success) {
          setDashboardData({
            totalDoctors: doctorsResponse.data.count,
            todayAppointments: appointmentsResponse.data.pendingCount,
            totalPatients: appointmentsResponse.data.completedCount,
            revenue: appointmentsResponse.data.completedRevenue,
            weeklyStats: appointmentsResponse.data.weeklyStats,
            statusStats: appointmentsResponse.data.statusStats,
            recentActivities: appointmentsResponse.data.recentActivities,
          });
        }
      } catch (error) {
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
    <div className="min-h-screen bg-gray-50">
      <ClinicNav />

      <div className="p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{" "}
            {JSON.parse(localStorage.getItem("clinicData"))?.name || "Doctor"}
          </h1>
          <p className="text-gray-600">Here's your clinic overview for today</p>
        </motion.div>

        {/* Updated Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Doctors"
            value={dashboardData.totalDoctors}
            icon={<FaUserMd />}
            color="blue"
          />
          <StatsCard
            title="Pending Appointments"
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            icon={<FaCalendarCheck className="text-2xl" />}
            title="Schedule Appointment"
            description="Create a new appointment"
          />
          <QuickAction
            icon={<FaUserMd className="text-2xl" />}
            title="Add Patient"
            description="Register new patient"
          />
          <QuickAction
            icon={<FaPrescription className="text-2xl" />}
            title="Write Prescription"
            description="Create new prescription"
          />
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

const QuickAction = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl shadow-sm cursor-pointer"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default ClinicDashboard;
