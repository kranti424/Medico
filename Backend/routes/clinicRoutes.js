const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/clinicRegcontroller");
const { addClinicDoctor, getClinicDoctors,} = require("../controllers/addClinicDoctor");
const { getAllClinics,getNearestClinics } = require("../controllers/usernavcliniccontroller");


router.post("/register", register);//
router.post("/login", login);//
router.get('/all', getAllClinics);//
// router.get('/nearest',getNearestClinics);
// router.post('/add', addClinicDoctor);
// router.get('/:clinicId',getClinicDoctors);

// Public routes
// router.get('/:id',getClinicById);

module.exports = router;
