const Doctor = require("../models/addDoctor");
const Appointment = require("../models/Appointments");

const getDoctorsCount = async (req, res) => {
  try {
    const { email } = req.params;
    const count = await Doctor.countDocuments({ organizationEmail: email });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in getDoctorsCount:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors count",
    });
  }
};

const getDoctorStats = async (req, res) => {
  try {
    const { email } = req.params;

    // Get pending appointments count
    const pendingCount = await Appointment.countDocuments({
      organizationEmail: email,
      status: "Pending",
    });

    // Get completed appointments
    const completedAppointments = await Appointment.find({
      organizationEmail: email,
      status: "Completed",
    });

    // Calculate completed count and revenue
    const completedCount = completedAppointments.length;
    const completedRevenue = completedAppointments.reduce(
      (total, appointment) => total + (Number(appointment.fees) || 0),
      0
    );

    // Get weekly stats and other data
    const weeklyStats = await getWeeklyStats(email);
    const statusStats = await getStatusDistribution(email);
    const recentActivities = await getRecentActivities(email);

    res.status(200).json({
      success: true,
      pendingCount,
      completedCount,
      completedRevenue,
      weeklyStats,
      statusStats,
      recentActivities,
    });
  } catch (error) {
    console.error("Error in getDoctorStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor statistics",
    });
  }
};

const getWeeklyStats = async (email) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const stats = await Appointment.aggregate([
    {
      $match: {
        organizationEmail: email,
        appointmentDate: { $gte: oneWeekAgo },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$appointmentDate" },
        appointments: { $sum: 1 },
      },
    },
  ]);

  return days.map((day, index) => ({
    name: day,
    appointments: stats.find((s) => s._id === index + 1)?.appointments || 0,
  }));
};

const getStatusDistribution = async (email) => {
  const stats = await Appointment.aggregate([
    {
      $match: { organizationEmail: email },
    },
    {
      $group: {
        _id: "$status",
        value: { $sum: 1 },
      },
    },
  ]);

  const colors = {
    Pending: "#FCD34D",
    Completed: "#34D399",
    Cancelled: "#F87171",
    Confirmed: "#60A5FA",
  };

  return stats.map((stat) => ({
    name: stat._id,
    value: stat.value,
    color: colors[stat._id] || "#9CA3AF",
  }));
};

const getRecentActivities = async (email) => {
  const activities = await Appointment.find({
    organizationEmail: email,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return activities.map((activity) => ({
    title: `Appointment for ${activity.firstName} ${activity.lastName}`,
    description: `Status: ${activity.status}`,
    time: new Date(activity.createdAt).toLocaleDateString(),
  }));
};

module.exports = { getDoctorsCount, getDoctorStats };
