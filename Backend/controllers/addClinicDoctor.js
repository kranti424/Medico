const Doctor = require("../models/addDoctor");
const bcrypt = require("bcryptjs");

const addClinicDoctor = async (req, res) => {
  try {
    // Validate and sanitize input
    const {
      name,
      email,
      phone,
      degrees,
      experience,
      specialties,
      consultationFees,
      availableDays,
      timeSlots,
      userId,
      password,
      confirmPassword,
      organizationId,
      organizationType,
      organizationName,
      organizationEmail,
      state,
      city,
      address,
      latitude,
      longitude,
    } = req.body;

    // Check for existing doctor
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // Validate password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      degrees,
      experience: parseInt(experience),
      specialties,
      consultationFees: parseInt(consultationFees),
      availableDays,
      timeSlots,
      userId,
      password: hashedPassword,
      organizationId,
      organizationType,
      organizationName,
      organizationEmail,
      state,
      city,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialties: doctor.specialties,
        organizationName: doctor.organizationName,
      },
    });
  } catch (error) {
    console.error("Error adding doctor:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding doctor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getClinicDoctors = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const doctors = await Doctor.find({
      organizationId: clinicId,
      organizationType: "Clinic",
    });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
    });
  }
};


module.exports = {
  addClinicDoctor,
  getClinicDoctors,
};
