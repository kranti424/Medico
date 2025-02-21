const express = require('express');
const router = express.Router();
const { addDoctor, getAllDoctors,deleteDoctor } = require('../controllers/doctorcontroller');
const { authenticateOrganization } = require('../middleware/authMiddleware');
// const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/add', addDoctor);//
router.get('/organization/:organizationId', getAllDoctors);//
router.delete('/delete/:id', deleteDoctor);//

module.exports = router;