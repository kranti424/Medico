const mongoose = require('mongoose');

const websiteReviewSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'guest@guest.com'
  },
  userType: {
    type: String,
    enum: ['User', 'Guest'],
    default: 'Guest'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxLength: [500, 'Review cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteReview', websiteReviewSchema);