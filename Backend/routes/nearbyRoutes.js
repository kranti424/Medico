const express = require('express');
const router = express.Router();
const nearbyController = require('../controllers/nearbyController');

// Nearby search routes
router.post('/doctors/nearby', nearbyController.findNearbyDoctors);
router.post('/hospitals/nearby', nearbyController.findNearbyHospitals);
router.post('/clinics/nearby', nearbyController.findNearbyClinics);
router.get('/v1/hospital/nearby', nearbyController.getNearbyHospitals);

module.exports = router;