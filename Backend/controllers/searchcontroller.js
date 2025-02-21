const Doctor = require("../models/addDoctor");
const HospitalReg = require('../models/hospitalReg');

const createFuzzyPattern = (query) => {
  if (!query) return [];
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const terms = escapedQuery.split(' ').filter(term => term.length > 0);
  return terms.map(term => ({
    $regex: term.split('').join('.*'),
    $options: 'i'
  }));
};

exports.search = async (req, res) => {
  try {
    const { type, query, specialty, lat, lng } = req.query;
    
    // Handle specialty search differently
    if (type === 'specialty') {
      if (!specialty) {
        return res.status(400).json({
          success: false,
          message: "Specialty is required for specialty search"
        });
      }
      const results = await Doctor.find({
        specialties: { $regex: specialty, $options: 'i' }
      }).select('-password');
      return res.json({ success: true, results });
    }

    // Validate query for other search types
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    let searchQuery = {};
    const fuzzyPatterns = createFuzzyPattern(query);

    switch(type) {
      case 'doctor':
        searchQuery = {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            ...fuzzyPatterns.map(pattern => ({ name: pattern }))
          ]
        };
        break;

      case 'hospital':
        searchQuery = {
          organizationType: 'Hospital',
          $or: [
            { organizationName: { $regex: query, $options: 'i' } },
            ...fuzzyPatterns.map(pattern => ({ organizationName: pattern }))
          ]
        };
        break;

      case 'clinic':
        searchQuery = {
          organizationType: 'Clinic',
          $or: [
            { organizationName: { $regex: query, $options: 'i' } },
            ...fuzzyPatterns.map(pattern => ({ organizationName: pattern }))
          ]
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid search type"
        });
    }

    // Add location if provided
    if (lat && lng) {
      searchQuery.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000
        }
      };
    }

    const results = await Doctor.find(searchQuery)
      .select('-password')
      .limit(20);

    res.json({
      success: true,
      results,
      count: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
};
// Specialized search methods
exports.searchBySpecialty = async (req, res) => {
  const { specialty, lat, lng } = req.query;
  try {
    let query = { specialties: { $regex: specialty, $options: "i" } };
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000
        }
      };
    }
    const results = await Doctor.find(query).select("-password");
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchDoctors = async (req, res) => {
  const { query, lat, lng } = req.query;
  try {
    let searchQuery = { name: { $regex: query, $options: "i" } };
    if (lat && lng) {
      searchQuery.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000
        }
      };
    }
    const results = await Doctor.find(searchQuery).select("-password");
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchHospitals = async (req, res) => {
  const { query, lat, lng } = req.query;
  try {
    let searchQuery = { 
      hospitalName: { $regex: query, $options: "i" }
    };

    if (lat && lng) {
      searchQuery.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000
        }
      };
    }

    const results = await HospitalReg.find(searchQuery)
      .select('hospitalName email phone address state city pincode image latitude longitude')
      .lean();

    res.json({ 
      success: true, 
      results,
      count: results.length 
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error searching hospitals",
      error: error.message 
    });
  }
};

exports.searchClinics = async (req, res) => {
  const { query, lat, lng } = req.query;
  try {
    let searchQuery = { 
      organizationType: "Clinic",
      organizationName: { $regex: query, $options: "i" } 
    };
    if (lat && lng) {
      searchQuery.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000
        }
      };
    }
    const results = await Doctor.find(searchQuery).select("-password");
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};