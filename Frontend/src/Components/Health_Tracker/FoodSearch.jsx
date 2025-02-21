import React, { useState } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaSpinner,
  FaWeight,
  FaFire,
  FaAppleAlt,
} from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";

const API_URL = "https://medico-care-theta.vercel.app/api/health/v2/food/nutrition";

const FoodSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, { query });
      setResults(response.data.foods);
    } catch (error) {
      setError("Failed to search foods. Please try again.");
      // console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  const NutritionCard = ({ food }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        {food.photo && (
          <img
            src={food.photo.thumb}
            alt={food.food_name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 capitalize">
            {food.food_name}
          </h3>
          {food.brand_name && (
            <p className="text-gray-600 text-sm">{food.brand_name}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaFire className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="font-semibold">{Math.round(food.nf_calories)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GiKnifeFork className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Serving</p>
                <p className="font-semibold">
                  {food.serving_qty} {food.serving_unit}
                  {food.serving_weight_grams &&
                    ` (${food.serving_weight_grams}g)`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <MacroNutrient
              label="Protein"
              value={food.nf_protein}
              color="blue"
            />
            <MacroNutrient
              label="Carbs"
              value={food.nf_total_carbohydrate}
              color="green"
            />
            <MacroNutrient
              label="Fat"
              value={food.nf_total_fat}
              color="yellow"
            />
          </div>

          {/* Additional Nutrients */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <NutrientItem label="Fiber" value={food.nf_dietary_fiber} />
            <NutrientItem label="Sugars" value={food.nf_sugars} />
            <NutrientItem label="Sodium" value={food.nf_sodium} unit="mg" />
            <NutrientItem
              label="Potassium"
              value={food.nf_potassium}
              unit="mg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const MacroNutrient = ({ label, value, color }) => (
    <div className="text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-semibold text-${color}-600`}>{Math.round(value)}g</p>
    </div>
  );

  const NutrientItem = ({ label, value, unit = "g" }) => (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">
        {Math.round(value)}
        {unit}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Nutrition Search
        </h1>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a food item (e.g., '1 apple' or '200g chicken breast')"
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
                       disabled:bg-gray-300 flex items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Search
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">
            {results.map((food, idx) => (
              <NutritionCard key={idx} food={food} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;