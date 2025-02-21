const Hospital = require("../models/hospitalReg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");

exports.register = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.hospitalName || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if hospital exists
    const existingHospital = await Hospital.findOne({ email: req.body.email });
    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital already registered",
      });
    }

    // Handle coordinates
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    // Process image if exists
    let imageUrl = null;
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: "hospitals",
          width: 300,
          crop: "scale",
        }
      );
      imageUrl = result.secure_url;
    }

    // Create hospital
    const hospital = new Hospital({
      ...req.body,
      image: imageUrl,
      latitude,
      longitude,
      password: await bcrypt.hash(req.body.password, 12),
    });

    await hospital.save();

    const token = jwt.sign(
      { hospitalId: hospital._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Hospital registered successfully",
      token,
      hospital: {
        id: hospital._id,
        name: hospital.hospitalName,
        email: hospital.email,
        image: imageUrl,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("📩 Received login request:", email);

    // Find hospital by email
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      // console.warn("⚠️ Hospital not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      console.warn("⚠️ Password does not match for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { hospitalId: hospital._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 24 hours
    );

    // console.log("🔐 Generated token:", token);

    // Set HTTP-only cookie for token storage
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access for security
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "None", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("✅ Cookie set successfully!");

    // Return response with token & hospital details
    res.json({
      success: true,
      message: "Login successful",
      token, // Include token in response
      hospital: {
        id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        phone: hospital.phone,
        alternatePhone: hospital.alternatePhone,
        state: hospital.state,
        city: hospital.city,
        pincode: hospital.pincode,
        address: hospital.address,
        establishedYear: hospital.establishedYear,
        website: hospital.website,
        description: hospital.description,
        image: hospital.image,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
        createdAt: hospital.createdAt,
        updatedAt: hospital.updatedAt,
        role: "Hospital",
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
