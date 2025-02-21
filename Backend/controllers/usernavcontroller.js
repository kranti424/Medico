const Hospital = require('../models/hospitalReg');
const Doctor = require('../models/addDoctor');

exports.getAllHospitals = async (req, res) => {
  try {
    // console.log('Get all hospitals');
    const hospitals = await Hospital.find({});
    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNearestHospitals = async (req, res) => {
  const { latitude, longitude } = req.query;
  
  try {
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          }
        }
      }
    }).limit(10);
    
    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get nearest doctors
exports.getNearestDoctors = async (req, res) => {
  const { latitude, longitude, maxDistance = 10000 } = req.query;

  try {
    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Filter doctors
exports.filterDoctors = async (req, res) => {
  const { specialty, maxFee, organization, sortBy } = req.query;

  try {
    let query = {};
    if (specialty) query.specialties = specialty;
    if (maxFee) query.consultationFees = { $lte: parseInt(maxFee) };
    if (organization) query.organizationType = organization;

    let sortQuery = {};
    switch(sortBy) {
      case 'fees':
        sortQuery = { consultationFees: 1 };
        break;
      case 'experience':
        sortQuery = { experience: -1 };
        break;
      default:
        sortQuery = { _id: 1 };
    }

    const doctors = await Doctor.find(query).sort(sortQuery);
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};