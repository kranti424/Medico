const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewerEmail: {
      type: String,
      default: 'guest@guest.com',
      trim: true,
      lowercase: true
    },
    userType: {
      type: String,
      enum: ['User', 'Guest'],
      default: 'Guest'
    },
    entityType: {
      type: String,
      required: true,
      enum: ["Hospital", "Clinic", "Doctor"]
    },
    entityEmail: {
      type: String,
      required: [true, "Entity email is required"],
      trim: true,
      lowercase: true
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxLength: 500
    },
    recommended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Review", reviewSchema);