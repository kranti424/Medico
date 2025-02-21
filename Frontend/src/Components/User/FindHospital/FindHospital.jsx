import React, { useState, useEffect } from "react";
import axios from "axios";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const fetchLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      const response = await axios.get("https://medico-care-theta.vercel.app/api/search/v1/hospital/nearby", {
        params: {
          latitude,
          longitude,
        },
      });

      if (response.data.success) {
        setHospitals(response.data.results || []);
      } else {
        setLocationError("Failed to fetch hospitals.");
      }
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
      setLocationError("Failed to fetch nearby hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocationAndFetchHospitals = async () => {
      setLoading(true);
      setLocationError("");

      try {
        const position = await fetchLocation();
        const { latitude, longitude } = position.coords;
        await fetchNearbyHospitals(latitude, longitude);
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError(
          "Unable to get your location. Please enable location services."
        );
        setLoading(false);
      }
    };

    getLocationAndFetchHospitals();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Nearby Hospitals
        </h1>

        {locationError && (
          <div className="text-center text-red-600 mb-4">{locationError}</div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div
                key={hospital._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-2">
                  {hospital.hospital_name}
                </h2>
                <p className="text-gray-600">
                  {hospital._address_original_first_line}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  {hospital.distance.toFixed(2)} km away
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">No hospitals found nearby</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindHospital;