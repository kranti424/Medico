const Appointment = require("../models/Appointments");

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const appointments = await Appointment.find({ organizationEmail: email });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get appointments for doctors
exports.getDoctorAppointments = async (req, res) => {
  // console.log('getDoctorAppointments');
  try {
    const { email, organizationEmail } = req.query;
    console.log(email, organizationEmail);
    if (!email || !organizationEmail) {
      return res.status(400).json({
        success: false,
        message: "Email and organization email are required",
      });
    }

    const appointments = await Appointment.find({
      $and: [{ doctorEmail: email }, { organizationEmail: organizationEmail }],
    }).sort({ appointmentDate: -1 }); // Sort by date descending

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Get appointments for consultants
exports.getConsultantAppointments = async (req, res) => {
  // console.log('getConsultantAppointments');
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Consultant email is required",
      });
    }

    const appointments = await Appointment.find({
      consultantEmail: email,
    }).sort({ appointmentDate: -1 }); // Sort by date descending

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    // console.error("Error fetching consultant appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    var { status } = req.body;
    status = status.charAt(0).toUpperCase() + status.slice(1);
    // console.log("Updating appointment:", appointmentId, "to status:", status);

    if (!["Confirmed", "Cancelled", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either Confirmed, Cancelled or Completed",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // console.log("Appointment updated successfully:", appointment);
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    // console.error("Error updating appointment status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const { email } = req.params;

    const appointments = await Appointment.find({ email }).sort({
      appointmentDate: -1,
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
