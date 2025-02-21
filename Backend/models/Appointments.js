const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Patient Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  image: {
    type: String,
    default: ''
  },

  // Organization Information
  organizationType: {
    type: String,
    required: [true, 'Organization type is required'],
    enum: ['Hospital', 'Clinic'],
    trim: true
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  organizationEmail: {
    type: String,
    required: [true, 'Organization email is required'],
    trim: true,
    lowercase: true
  },

  // Doctor Information
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  doctorEmail: {
    type: String,
    required: [true, 'Doctor email is required'],
    trim: true,
    lowercase: true
  },
  fees: {
    type: Number,
    required: [true, 'Fees is required']
  },

  // Appointment Date
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },

  // Time Slot
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
  // Appointment Status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);