const express = require("express");
const router = express.Router();
const hospitalController = require("../../controllers/FindHospital/findHospitalController");

router.get("/search", hospitalController.searchHospitals);
router.get("/details/:id", hospitalController.getHospitalDetails);
router.get("/nearby", hospitalController.getNearbyHospitals);

module.exports = router;
