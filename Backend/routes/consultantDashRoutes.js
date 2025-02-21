const express = require('express');
const router = express.Router();
const { getConsultantDashboard } = require('../controllers/consultantDashController');

// Updated route to include both email and organizationEmail
router.get('/dashboard/:email/:organizationEmail', getConsultantDashboard);//

module.exports = router;