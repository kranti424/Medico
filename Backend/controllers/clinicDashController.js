const Doctor = require("../models/addDoctor");
const Appointment = require("../models/Appointments");

// Get total doctors count
const getDoctorsCount = async (req, res) => {
  try {
    const { email } = req.params;
    const count = await Doctor.countDocuments({ organizationEmail: email });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error("Error in getDoctorsCount:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors count"
    });
  }
};

// Get clinic statistics
const getClinicStats = async (req, res) => {
  try {
    const { email } = req.params;

    // Get pending appointments count
    const pendingCount = await Appointment.countDocuments({
      organizationEmail: email,
      status: "Pending"
    });

    // Get completed appointments for total patients
    const completedCount = await Appointment.countDocuments({
      organizationEmail: email,
      status: "Completed"
    });

    // Calculate revenue from completed appointments
    const completedAppointments = await Appointment.aggregate([
      {
        $match: {
          organizationEmail: email,
          status: "Completed"
        }
      },
      {
        $group: {
          _id: null,
          completedRevenue: { $sum: "$fees" }
        }
      }
    ]);

    // Get weekly statistics
    const weeklyStats = await getWeeklyStats(email);

    // Get appointment status distribution
    const statusStats = await getStatusDistribution(email);

    // Get recent activities
    const recentActivities = await getRecentActivities(email);

    res.status(200).json({
      success: true,
      pendingCount,
      completedCount,
      completedRevenue: completedAppointments[0]?.completedRevenue || 0,
      weeklyStats,
      statusStats,
      recentActivities
    });

  } catch (error) {
    console.error("Error in getClinicStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching clinic statistics"
    });
  }
};

// Helper function to get weekly statistics
const getWeeklyStats = async (email) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const stats = await Appointment.aggregate([
    {
      $match: {
        organizationEmail: email,
        createdAt: { $gte: oneWeekAgo }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        appointments: { $sum: 1 }
      }
    }
  ]);

  return days.map((day, index) => ({
    name: day,
    appointments: stats.find(s => s._id === index + 1)?.appointments || 0
  }));
};

// Helper function to get status distribution
const getStatusDistribution = async (email) => {
  const stats = await Appointment.aggregate([
    {
      $match: { organizationEmail: email }
    },
    {
      $group: {
        _id: '$status',
        value: { $sum: 1 }
      }
    }
  ]);

  const colors = {
    Pending: '#FCD34D',
    Completed: '#34D399',
    Cancelled: '#F87171'
  };

  return stats.map(stat => ({
    name: stat._id,
    value: stat.value,
    color: colors[stat._id] || '#9CA3AF'
  }));
};

// Helper function to get recent activities
const getRecentActivities = async (email) => {
  return await Appointment.find({ organizationEmail: email })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName status createdAt')
    .lean()
    .then(activities => activities.map(activity => ({
      title: `Appointment for ${activity.firstName} ${activity.lastName}`,
      description: `Status: ${activity.status}`,
      time: new Date(activity.createdAt).toLocaleDateString()
    })));
};

module.exports = {
  getDoctorsCount,
  getClinicStats
};