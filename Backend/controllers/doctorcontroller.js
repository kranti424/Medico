const Doctor = require('../models/addDoctor');
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");

const addDoctor = async (req, res) => {
  try {
    const { password, confirmPassword, ...doctorData } = req.body;

    // Parse JSON strings back to objects/arrays
    ["degrees", "specialties", "availableDays", "timeSlots"].forEach(
      (field) => {
        if (doctorData[field] && typeof doctorData[field] === "string") {
          try {
            doctorData[field] = JSON.parse(doctorData[field]);
          } catch (error) {
            console.error(`Error parsing ${field}:`, error);
          }
        }
      }
    );

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "organizationId",
      "organizationType",
      "organizationName",
      "organizationEmail",
      "state",
      "city",
      "address",
      "latitude",
      "longitude",
      "degrees",
      "experience",
      "specialties",
      "consultationFees",
      "availableDays",
      "timeSlots",
      "userId",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !doctorData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Handle image upload to Cloudinary
    if (!req.files || !req.files.profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.files.profileImage.tempFilePath,
      {
        folder: "doctors",
        width: 300,
        crop: "scale",
      }
    );

    // Validate password
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create doctor with Cloudinary image URL
    const doctor = await Doctor.create({
      ...doctorData,
      password: hashedPassword,
      profileImage: result.secure_url,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        organizationName: doctor.organizationName,
        specialties: doctor.specialties,
        consultationFees: doctor.consultationFees,
        profileImage: doctor.profileImage,
      },
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add doctor",
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ organizationId: req.params.organizationId });
    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // First check if the doctor exists
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // If doctor has a profile image, delete it from Cloudinary
    if (doctor.profileImage) {
      try {
        // Get the public_id from the Cloudinary URL
        const urlParts = doctor.profileImage.split("/");
        const imageName = urlParts[urlParts.length - 1];
        const publicId = `doctors/${imageName.split(".")[0]}`;

        // Delete image from Cloudinary
        const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

        if (cloudinaryResult.result !== "ok") {
          console.error("Cloudinary deletion failed:", cloudinaryResult);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    // Delete the doctor from database
    await Doctor.findByIdAndDelete(doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteDoctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor",
    });
  }
};

module.exports = {
  addDoctor,
  getAllDoctors,
  deleteDoctor,
};