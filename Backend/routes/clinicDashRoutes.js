const express = require("express");
const router = express.Router();
const { getDoctorsCount, getClinicStats } = require("../controllers/clinicDashController");

// Dashboard routes
router.get('/doctors/count/:email', getDoctorsCount);
router.get('/stats/:email', getClinicStats);

module.exports = router;