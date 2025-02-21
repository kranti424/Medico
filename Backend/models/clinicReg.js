const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clinicSchema = new mongoose.Schema({
  clinicName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  alternatePhone: String,
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  establishedYear: Number,
  website: String,
  description: { type: String, required: true },
  image: String,
  latitude: Number,
  longitude: Number,
  password: { type: String, required: true },
}, { timestamps: true });

// clinicSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

module.exports = mongoose.model('Clinic', clinicSchema);