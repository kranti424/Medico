const express = require('express');
const router = express.Router();
const webReviewController = require('../controllers/webReviewController');

router.post('/create', webReviewController.createReview);//
router.get('/all', webReviewController.getReviews);
// router.delete('/delete/:id', webReviewController.deleteReview);

module.exports = router;