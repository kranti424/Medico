// Model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  address: {
    city: String,
    state: String,
    country: String
  },
  image: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

module.exports = mongoose.model('User', userSchema);