import React, { useState } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaSpinner,
  FaInfoCircle,
  FaFire,
  FaClock,
  FaRunning,
} from "react-icons/fa";

const API_URL = "https://medico-care-theta.vercel.app/api/health/v2/exercise/calories";

const ExerciseCalories = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateExerciseCalories = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, { query });
      setResult(response.data);
    } catch (error) {
      setError("Failed to calculate exercise calories. Please try again.");
      // console.error("Exercise calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Calculate Exercise Calories
        </h1>

        {/* Search Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Input Tips:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Include duration: "ran for 30 minutes" or "1 hour swimming"
                </li>
                <li>
                  • Specify intensity: "light jogging" or "intense cycling"
                </li>
                <li>
                  • Be specific: "played basketball" instead of just "played"
                </li>
                <li>• Add distance: "walked 2 miles" or "ran 5km"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={calculateExerciseCalories} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Example: 'ran for 30 minutes' or '1 hour swimming'"
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-yellow-500 
                        py-3 px-4 text-lg"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600
                       disabled:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Calculate
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {result && result.exercises && result.exercises.length > 0 && (
            <div className="mt-8 space-y-6">
              {result.exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 
                                        rounded-xl p-6 shadow-sm border border-yellow-100"
                >
                  <div className="flex gap-6">
                    {/* Exercise Image */}
                    {exercise.photo && (
                      <div className="shrink-0">
                        <img
                          src={exercise.photo.thumb}
                          alt={exercise.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </div>
                    )}

                    {/* Exercise Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 capitalize mb-4">
                        {exercise.name}
                      </h3>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Calories */}
                        <div className="flex items-center gap-2">
                          <FaFire className="text-orange-500" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Calories Burned
                            </p>
                            <p className="font-bold text-orange-600">
                              {Math.round(exercise.nf_calories)} kcal
                            </p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-bold text-blue-600">
                              {exercise.duration_min} min
                            </p>
                          </div>
                        </div>

                        {/* Intensity (MET) */}
                        <div className="flex items-center gap-2">
                          <FaRunning className="text-green-500" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Intensity (MET)
                            </p>
                            <p className="font-bold text-green-600">
                              {exercise.met}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCalories;