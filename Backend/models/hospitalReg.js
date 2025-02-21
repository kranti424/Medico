const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
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
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// // Hash password before saving
// hospitalSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

module.exports = mongoose.model("Hospital", hospitalSchema);
