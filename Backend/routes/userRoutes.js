// /userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');

router.post('/register', userController.signup);
// router.post('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);
// router.post('/forgot-password', userController.forgotPassword);
// router.patch('/reset-password/:token', userController.resetPassword);

// Protected routes
// router.use(protect);
// router.get('/profile', userController.getProfile);
// router.patch('/update-profile', userController.updateProfile);
// router.patch('/update-password', userController.updatePassword);

module.exports = router;