const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema(
  {
    // Organization Reference
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "organizationType",
    },
    organizationType: {
      type: String,
      required: true,
      enum: ["Hospital", "Clinic"],
    },
    organizationName: {
      type: String,
      required: true,
    },
    organizationEmail: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    // Add location fields
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    // Doctor Personal Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 50 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    profileImage: {
      type: String, // Store the URL/path of the uploaded image
      required: [true, "Profile image is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    alternatePhone: {
      type: String,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    degrees: [
      {
        type: String,
        enum: [
          "MBBS",
          "MD",
          "MS",
          "DNB",
          "DM",
          "MCh",
          "BDS",
          "MDS",
          "BHMS",
          "BAMS",
          "BUMS",
          "DHMS",
          "PhD",
        ],
      },
    ],
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    specialties: [
      {
        type: String,
        enum: [
          "Cardiology",
          "Neurology",
          "Orthopedics",
          "Pediatrics",
          "Gynecology",
          "Dermatology",
          "ENT",
          "Ophthalmology",
          "Psychiatry",
          "Dental",
          "General Medicine",
        ],
      },
    ],
    consultationFees: {
      type: Number,
      required: true,
      min: 0,
    },

    // Availability
    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    timeSlots: {
      start: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"],
      },
      end: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, "End time must be in HH:mm format"],
      },
    },

    // Login Credentials
    userId: {
      type: String,
      required: true,
      unique: true,
      // match: [/^[a-zA-Z0-9]+$/, 'User ID must be alphanumeric'],
      minlength: [4, "User ID must be at least 4 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Add geospatial index
doctorSchema.index({ location: '2dsphere' });

doctorSchema.pre('save', async function (next) {
  const user = this;

  // Check if the userId already exists in the database
  const existingUser = await mongoose.models.Doctor.findOne({ userId: user.userId });

  
  if (existingUser) {
    // If userId already exists, throw an error
    const error = new Error('User ID already exists');
    return next(error);
  }

  // If userId is unique, proceed with the save
  next();
});


module.exports = mongoose.model("Doctor", doctorSchema);
