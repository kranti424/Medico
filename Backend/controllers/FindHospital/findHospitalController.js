const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HOSPITAL_API_KEY;
const BASE_URL = 'https://api.data.gov.in/resource/98fa254e-c5f8-4910-a19b-4828939b477d?api-key';

const hospitalController = {
  searchHospitals: async (req, res) => {
    try {
      const { type, query } = req.query;
      
      // Build filter parameters based on search type
      let filterParams = {};
      switch (type) {
        case 'name':
          filterParams['filters[hospital_name]'] = query;
          break;
        case 'location':
          filterParams['filters[_location]'] = query;
          break;
        case 'pincode':
          filterParams['filters[_pincode]'] = query;
          break;
        default:
          return res.status(400).json({ error: 'Invalid search type' });
      }

      // Make request to the API
      const response = await axios.get(BASE_URL, {
        params: {
          'api-key': API_KEY,
          'format': 'json',
          ...filterParams
        }
      });

      const hospitals = response.data.records || [];
      return res.json(hospitals);

    } catch (error) {
      console.error('Hospital search error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch hospital data',
        details: error.message 
      });
    }
  },

  getHospitalDetails: async (req, res) => {
    try {
      const { id } = req.params;
      
      const response = await axios.get(BASE_URL, {
        params: {
          'api-key': API_KEY,
          'format': 'json',
          'filters[_sr_no]': id
        }
      });

      const hospital = response.data.records?.[0];
      
      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
      }

      return res.json(hospital);

    } catch (error) {
      console.error('Hospital details error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch hospital details',
        details: error.message 
      });
    }
  },

  getNearbyHospitals: async (req, res) => {
    try {
      const { lat, lng, radius = 10 } = req.query;
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({ error: 'Invalid coordinates' });
      }

      const response = await axios.get(BASE_URL, {
        params: {
          'api-key': API_KEY,
          'format': 'json'
        }
      });

      const hospitals = response.data.records || [];
      
      // Filter and sort nearby hospitals
      const nearbyHospitals = hospitals
        .filter(hospital => {
          if (!hospital._location_coordinates) return false;
          
          const [hospitalLat, hospitalLng] = hospital._location_coordinates
            .split(',')
            .map(coord => parseFloat(coord.trim()));

          if (isNaN(hospitalLat) || isNaN(hospitalLng)) return false;

          const distance = calculateDistance(userLat, userLng, hospitalLat, hospitalLng);
          hospital.distance = Math.round(distance * 10) / 10; // Round to 1 decimal
          return distance <= radius;
        })
        .sort((a, b) => a.distance - b.distance);

      return res.json(nearbyHospitals);

    } catch (error) {
      console.error('Nearby hospitals error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch nearby hospitals',
        details: error.message 
      });
    }
  }
};

// Helper function to calculate distance between coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = hospitalController;
