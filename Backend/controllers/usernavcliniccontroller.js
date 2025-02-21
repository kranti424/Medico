const Clinic = require('../models/clinicReg');

// Get all clinics
const getAllClinics =  async (req, res) => {
    try {
      // console.log("Get all clinics");
      const clinic = await Clinic.find({});
      res.status(200).json({ success: true, data: clinic });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Get nearest clinics
  const getNearestClinics = async (req, res) => {
    try {
      const { latitude, longitude, maxDistance = 10000 } = req.query;
  
      const clinics = await Clinic.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(maxDistance)
          }
        }
      }).select('-password');
  
      res.status(200).json({
        success: true,
        data: clinics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching nearest clinics',
        error: error.message
      });
    }
  };
 module.exports = { getAllClinics, getNearestClinics };