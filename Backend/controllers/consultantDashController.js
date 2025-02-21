const Appointment = require('../models/Appointments');

const getConsultantDashboard = async (req, res) => {
    try {
        const { email, organizationEmail } = req.params;

        // Query conditions for both emails
        const queryCondition = {
            doctorEmail: email,
            organizationEmail: organizationEmail
        };

        // Get completed consultations count
        const completedCount = await Appointment.countDocuments({
            ...queryCondition,
            status: "Completed"
        });

        // Get accepted/upcoming consultations
        const acceptedCount = await Appointment.countDocuments({
            ...queryCondition,
            status: "Accepted"
        });

        // Get pending consultations
        const pendingCount = await Appointment.countDocuments({
            ...queryCondition,
            status: "Pending"
        });

        // Calculate total earnings from completed appointments
        const completedAppointments = await Appointment.find({
            ...queryCondition,
            status: "Completed"
        });

        const totalEarnings = completedAppointments.reduce(
            (sum, appointment) => sum + (appointment.fees || 0),
            0
        );

        // Get weekly stats
        const weeklyStats = await getWeeklyStats(email, organizationEmail);

        // Get status distribution
        const statusStats = await getStatusDistribution(email, organizationEmail);

        // Get recent activities
        const recentActivities = await getRecentActivities(email, organizationEmail);

        res.status(200).json({
            success: true,
            completedCount,
            acceptedCount,
            pendingCount,
            totalEarnings,
            weeklyStats,
            statusStats,
            recentActivities
        });

    } catch (error) {
        console.error('Error in getConsultantDashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
};

// Helper function to get weekly stats
const getWeeklyStats = async (email, organizationEmail) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stats = await Appointment.aggregate([
        {
            $match: {
                doctorEmail: email,
                organizationEmail: organizationEmail,
                createdAt: { $gte: oneWeekAgo }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: '$createdAt' },
                consultations: { $sum: 1 }
            }
        }
    ]);

    return days.map((day, index) => ({
        name: day,
        consultations: stats.find(s => s._id === index + 1)?.consultations || 0
    }));
};

// Helper function to get status distribution
const getStatusDistribution = async (email, organizationEmail) => {
    const stats = await Appointment.aggregate([
        {
            $match: {
                doctorEmail: email,
                organizationEmail: organizationEmail
            }
        },
        {
            $group: {
                _id: '$status',
                value: { $sum: 1 }
            }
        }
    ]);

    const colors = {
        Completed: '#10B981',
        Accepted: '#F59E0B',
        Pending: '#6366F1',
        Cancelled: '#EF4444'
    };

    return stats.map(stat => ({
        name: stat._id,
        value: stat.value,
        color: colors[stat._id] || '#9CA3AF'
    }));
};

// Helper function to get recent activities
const getRecentActivities = async (email, organizationEmail) => {
    const activities = await Appointment.find({
        doctorEmail: email,
        organizationEmail: organizationEmail
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return activities.map(activity => ({
        title: `New consultation ${activity.status.toLowerCase()}`,
        description: `Patient: ${activity.firstName} ${activity.lastName}`,
        time: new Date(activity.createdAt).toLocaleString()
    }));
};

module.exports = {
    getConsultantDashboard
};