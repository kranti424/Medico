const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/usernavcontroller');
// const clinicController = require('../controllers/usernavcliniccontroller');

// const express = require('express');
// const router = express.Router();
const userNavController = require('../controllers/usernavcontroller');

// Doctor routes
router.get('/doctors/all', userNavController.getAllDoctors);//
// router.get('/doctors/nearest', userNavController.getNearestDoctors);
// router.get('/doctors/filter', userNavController.filterDoctors);
// router.get('/doctors/:id', userNavController.getDoctorById);

// module.exports = router;

router.get('/all', hospitalController.getAllHospitals);//
router.get('/nearest', hospitalController.getNearestHospitals);//
router.get('/:id', hospitalController.getHospitalById);//

module.exports = router;