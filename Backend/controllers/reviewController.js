const Review = require('../models/review');

exports.createReview = async (req, res) => {
  try {
    // console.log('Create review:', req.body);
    const { reviewerEmail, userType, entityType, entityEmail, rating, text } = req.body;

    // Validate required fields
    if (!reviewerEmail || !userType || !entityType || !entityEmail || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check for existing review from same user for same entity
    // const existingReview = await Review.findOne({
    //   reviewerEmail,
    //   entityEmail,
    //   entityType
    // });

    // if (existingReview) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'You have already reviewed this hospital'
    //   });
    // }

    // Create review
    const review = await Review.create({
      reviewerEmail,
      userType,
      entityType,
      entityEmail,
      rating,
      text,
    });

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    // console.error('Review creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating review'
    });
  }
};

// Get Reviews for Hospital
exports.getHospitalReviews = async (req, res) => {
  // console.log('Get hospital reviews:', req.params); // Debugging log

  try {
    const { email } = req.params; // Extract email correctly
    // console.log('Received hospitalEmail:', email);

    const reviews = await Review.find({
      entityEmail: email, // Use the correct variable
      entityType: 'Hospital'
    }).sort({ createdAt: -1 });

    // console.log('Fetched Reviews:', reviews); // Check if data is fetched

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for this hospital'
      });
    }

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    // console.error('Fetch reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews'
    });
  }
};

exports.getClinicReviews = async (req, res) => {
  // console.log('Get hospital reviews:', req.params); // Debugging log

  try {
    const { email } = req.params; // Extract email correctly
    // console.log('Received hospitalEmail:', email);

    const reviews = await Review.find({
      entityEmail: email, // Use the correct variable
      entityType: 'Clinic'
    }).sort({ createdAt: -1 });

    // console.log('Fetched Reviews:', reviews); // Check if data is fetched

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for this clinic'
      });
    }

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    // console.error('Fetch reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews'
    });
  }
};


// Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
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

// Get Reviews by Entity
exports.getEntityReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      entityEmail: req.params.email,
      entityType: req.params.type
    }).sort({ createdAt: -1 });

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

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
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

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};