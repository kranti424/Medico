import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner, FaInfoCircle } from "react-icons/fa";

const API_URL = "https://medico-care-theta.vercel.app/api/health/v2/calculate/dailycalories";

const DailyCalories = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight_kg: "",
    height_cm: "",
    activity_level: "sedentary",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateCalories = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.age || !formData.weight_kg || !formData.height_cm) {
      setError("Please fill in all fields");
      return;
    }

    // Convert string values to numbers
    const payload = {
      ...formData,
      age: parseInt(formData.age),
      weight_kg: parseFloat(formData.weight_kg),
      height_cm: parseFloat(formData.height_cm),
    };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, payload);
      setResult(response.data.data); // Access the data property from response
    } catch (error) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.error ||
        "Failed to calculate calories. Please try again.";
      setError(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
      // console.error("Calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Calculate Daily Calories
        </h1>

        {/* Input Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-500 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Guidelines:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Age: Must be between 15-80 years</li>
                <li>• Height: Enter in centimeters (130-230 cm)</li>
                <li>• Weight: Enter in kilograms (40-160 kg)</li>
                <li>• Activity level affects your daily calorie needs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={calculateCalories} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (15-80)
                </label>
                <input
                  type="number"
                  min="15"
                  max="80"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (40-160 kg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="160"
                  value={formData.weight_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, weight_kg: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (130-230 cm)
                </label>
                <input
                  type="number"
                  min="130"
                  max="230"
                  value={formData.height_cm}
                  onChange={(e) =>
                    setFormData({ ...formData, height_cm: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activity_level}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_level: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sedentary">
                    Sedentary (Little or no exercise)
                  </option>
                  <option value="light">Light (Exercise 1-3 days/week)</option>
                  <option value="moderate">
                    Moderate (Exercise 3-5 days/week)
                  </option>
                  <option value="active">
                    Active (Exercise 6-7 days/week)
                  </option>
                  <option value="very_active">
                    Very Active (Hard exercise & physical job)
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                       disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : null}
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              {/* Main Calories Card */}
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Daily Calorie Needs
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Weight Loss</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.weight_goals.weight_loss} kcal
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-blue-500">
                    <p className="text-sm text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.weight_goals.maintenance} kcal
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Weight Gain</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.weight_goals.weight_gain} kcal
                    </p>
                  </div>
                </div>
              </div>

              {/* Macronutrients Card */}
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Recommended Macronutrients
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-xl font-bold text-purple-600">
                      {result.macronutrient_goals.protein.grams}g
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.macronutrient_goals.protein.calories} kcal
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-xl font-bold text-purple-600">
                      {result.macronutrient_goals.carbs.grams}g
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.macronutrient_goals.carbs.calories} kcal
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Fats</p>
                    <p className="text-xl font-bold text-purple-600">
                      {result.macronutrient_goals.fats.grams}g
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.macronutrient_goals.fats.calories} kcal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCalories;