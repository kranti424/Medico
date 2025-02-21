const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/hospitalDashController');
// const { protect } = require('../middleware/authMiddleware');

router.get('/count/:email', dashboardController.getDoctorsCount);//
router.get('/stats/:email',dashboardController.getDoctorStats);//

module.exports = router;