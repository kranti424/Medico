const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token will expire in 7 days
  });
};


exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      address,
      notificationPreferences,
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email or phone",
      });
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    if (req.files && req.files.image) {
      try {
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: 'user_images',
          width: 300,
          crop: "scale"
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to upload image'
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
      gender,
      address,
      notificationPreferences,
      image: imageUrl,
    });

    // Create token
    const token = createToken(user._id);

    // Send complete user data excluding password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      notificationPreferences: user.notificationPreferences,
      image: user.image,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    };

    res.status(201).json({
      status: "success",
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = createToken(user._id);

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      notificationPreferences: user.notificationPreferences,
      image: user.image,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    };

    res.status(200).json({
      status: 'success',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};