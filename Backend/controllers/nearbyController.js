const Doctor = require('../models/addDoctor');
const Hospital = require('../models/hospitalReg');
const Clinic = require('../models/clinicReg');
const axios = require("axios");
require("dotenv").config();


const nearbyController = {
  // Find nearby doctors
  findNearbyDoctors: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required",
        });
      }

      const doctors = await Doctor.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius * 1000, // Convert km to meters
          },
        },
      }).limit(20);

      res.json({
        success: true,
        results: doctors,
        count: doctors.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Find nearby hospitals
  findNearbyHospitals: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required",
        });
      }

      const hospitals = await Hospital.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius * 1000,
          },
        },
      }).limit(20);

      res.json({
        success: true,
        results: hospitals,
        count: hospitals.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Find nearby clinics
  findNearbyClinics: async (req, res) => {
    try {
      const { latitude, longitude, radius = 10 } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required",
        });
      }

      const clinics = await Clinic.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius * 1000,
          },
        },
      }).limit(20);

      res.json({
        success: true,
        results: clinics,
        count: clinics.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getNearbyHospitals: async (req, res) => {
   console.log("requset come")

    try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required",
        });
      }

      const response = await axios.get(
        `https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d`,
        {
          params: {
            "api-key": process.env.HOSPITAL_API_KEY,
            format: "json",
            limit: 20,
          },
        }
      );

      // Calculate distance and filter nearby hospitals
      const nearbyHospitals = response.data.records
        .filter((hospital) => {
          if (hospital._location_coordinates) {
            const [hospitalLat, hospitalLong] = hospital._location_coordinates
              .split(",")
              .map(Number);
            const distance = calculateDistance(
              parseFloat(latitude),
              parseFloat(longitude),
              hospitalLat,
              hospitalLong
            );
            hospital.distance = distance;
            return distance <= 200; // Within 10km radius
          }
          return false;
        })
        .sort((a, b) => a.distance - b.distance);

      return res.json({
        success: true,
        results: nearbyHospitals,
      });
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

module.exports = nearbyController;