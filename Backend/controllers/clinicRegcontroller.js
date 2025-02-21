const Clinic = require('../models/clinicReg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

exports.register = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.clinicName || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if clinic exists
    const existingClinic = await Clinic.findOne({ email: req.body.email });
    if (existingClinic) {
      return res.status(400).json({
        success: false,
        message: 'Clinic already registered'
      });
    }

    // Handle coordinates
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // Process image if exists
    let imageUrl = null;
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'clinics',
        width: 300,
        crop: "scale"
      });
      imageUrl = result.secure_url;
    }

    // Create clinic
    const clinic = new Clinic({
      ...req.body,
      image: imageUrl,
      latitude,
      longitude,
      password: await bcrypt.hash(req.body.password, 12)
    });

    await clinic.save();

    const token = jwt.sign(
      { clinicId: clinic._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );
    
    res.status(201).json({
      success: true,
      message: 'Clinic registered successfully',
      token,
      clinic: {
        id: clinic._id,
        name: clinic.clinicName,
        email: clinic.email,
        image: imageUrl
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find clinic by email
    const clinic = await Clinic.findOne({ email });
    if (!clinic) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, clinic.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: clinic._id, email: clinic.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true, // Prevent JavaScript access for security
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: "None", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return success with all clinic data
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      clinic: {
        id: clinic._id,
        clinicName: clinic.clinicName,
        email: clinic.email,
        phone: clinic.phone,
        alternatePhone: clinic.alternatePhone,
        state: clinic.state,
        city: clinic.city,
        pincode: clinic.pincode,
        address: clinic.address,
        establishedYear: clinic.establishedYear,
        website: clinic.website,
        description: clinic.description,
        image: clinic.image,
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        createdAt: clinic.createdAt,
        updatedAt: clinic.updatedAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};