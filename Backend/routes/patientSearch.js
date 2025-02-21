const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchcontroller');

router.get('/', searchController.search);
router.get('/specialty', searchController.searchBySpecialty);
router.get('/doctors', searchController.searchDoctors);
router.get('/hospitals', searchController.searchHospitals);
router.get('/clinics', searchController.searchClinics);

module.exports = router;