const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
// const Consultant = require("../models/consultantReg");
const Doctor = require("../models/addDoctor");

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    let user;
    if (userId) {
      user = await Doctor.findOne({ userId });
      isConsultant = false;
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User ID not found!",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide email or user ID",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: isConsultant ? "Consultant" : "Doctor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare response based on user type
    let userResponse;

    if (isConsultant) {
      // Consultant response structure
      userResponse = {
        id: user._id,
        doctorName: user.doctorName,
        email: user.email,
        phone: user.phone,
        state: user.state,
        city: user.city,
        address: user.address,
        specialization: user.specialization,
        experience: user.experience,
        userId: user.userId,
        role: "Consultant",
        profileImage: user.profileImage,
      };
    } else {
      // Doctor response structure
      userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        organizationEmail: user.organizationEmail,
        organizationName: user.organizationName,
        organizationType: user.organizationType,
        state: user.state,
        city: user.city,
        address: user.address,
        degrees: user.degrees,
        specialties: user.specialties,
        experience: user.experience,
        consultationFees: user.consultationFees,
        availableDays: user.availableDays,
        timeSlots: user.timeSlots,
        userId: user.userId,
        profileImage: user.profileImage,
        role: "Doctor",
      };
    }

    res.status(200).json({
      success: true,
      token,
      data: { user: userResponse },
    });
    // console.log('Login successful:', user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
