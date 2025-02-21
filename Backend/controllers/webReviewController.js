const WebReview = require('../models/webReview');

exports.createReview = async (req, res) => {
  try {
    const review = await WebReview.create(req.body);
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await WebReview.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await WebReview.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};