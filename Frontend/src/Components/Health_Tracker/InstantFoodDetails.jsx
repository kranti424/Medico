import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import {
  FaSearch,
  FaSpinner,
  FaUtensils,
  FaInfoCircle,
  FaStore,
} from "react-icons/fa";

const API_URL = "https://medico-care-theta.vercel.app/api/health/v2/food/search";

const InstantFoodDetails = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchSuggestions = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: { query: searchQuery },
      });
      // Extract the branded and common arrays from response
      const { common = [], branded = [] } = response.data;
      setSuggestions([...common, ...branded]);
    } catch (error) {
      setError("Failed to fetch suggestions. Please try again.");
      // console.error("Autocomplete error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Quick Food Search
          </h1>
          {/* Search Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">
                  Search Tips:
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use specific quantities: "2 eggs" or "1 cup rice"</li>
                  <li>• Include preparation: "grilled chicken breast"</li>
                  <li>• Brand names work too: "Subway sandwich"</li>
                  <li>• Common foods: "apple" or "banana"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods (e.g., '1 hamburger' or 'subway sandwich')"
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500 
                       py-3 px-4 text-lg"
            />
            <button
              type="button"
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                       disabled:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Search
            </button>
          </div>

          {/* Results Section */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-purple-500 text-2xl" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-6">
                {/* Common Foods Section */}
                {suggestions.filter((food) => !food.brand_name).length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaUtensils className="text-purple-500" />
                      Common Foods
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {suggestions
                        .filter((food) => !food.brand_name)
                        .map((food, idx) => (
                          <FoodCard
                            key={idx}
                            food={food}
                            onClick={() => handleFoodSelect(food)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Branded Foods Section */}
                {suggestions.filter((food) => food.brand_name).length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaStore className="text-purple-500" />
                      Branded Foods
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {suggestions
                        .filter((food) => food.brand_name)
                        .map((food, idx) => (
                          <FoodCard
                            key={idx}
                            food={food}
                            onClick={() => handleFoodSelect(food)}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              query &&
              !loading && (
                <div className="text-center py-8 text-gray-500">
                  No foods found matching your search
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// New FoodCard component
const FoodCard = ({ food, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 border rounded-lg hover:shadow-md transition-all
             hover:bg-purple-50 cursor-pointer"
  >
    <div className="flex gap-4">
      {/* Food Image */}
      <div className="shrink-0">
        {food.photo?.thumb ? (
          <img
            src={food.photo.thumb}
            alt={food.food_name}
            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-purple-50 flex items-center justify-center">
            <FaUtensils className="text-2xl text-purple-400" />
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 capitalize">
              {food.food_name}
            </h3>
            {food.brand_name && (
              <p className="text-sm text-gray-600">{food.brand_name}</p>
            )}
          </div>
          {food.nf_calories && (
            <div className="bg-purple-50 px-3 py-1 rounded-full">
              <span className="font-semibold text-purple-600">
                {Math.round(food.nf_calories)} cal
              </span>
            </div>
          )}
        </div>

        {/* Serving Information */}
        <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {food.serving_qty} {food.serving_unit}
          </span>
          {food.serving_weight_grams && (
            <span className="text-gray-500">
              ({food.serving_weight_grams}g)
            </span>
          )}
        </div>

        {/* Nutrition Highlights */}
        {(food.nf_protein ||
          food.nf_total_carbohydrate ||
          food.nf_total_fat) && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {food.nf_protein && (
              <div className="text-center bg-blue-50 rounded p-1">
                <div className="text-xs text-gray-600">Protein</div>
                <div className="font-medium text-blue-600">
                  {Math.round(food.nf_protein)}g
                </div>
              </div>
            )}
            {food.nf_total_carbohydrate && (
              <div className="text-center bg-green-50 rounded p-1">
                <div className="text-xs text-gray-600">Carbs</div>
                <div className="font-medium text-green-600">
                  {Math.round(food.nf_total_carbohydrate)}g
                </div>
              </div>
            )}
            {food.nf_total_fat && (
              <div className="text-center bg-yellow-50 rounded p-1">
                <div className="text-xs text-gray-600">Fat</div>
                <div className="font-medium text-yellow-600">
                  {Math.round(food.nf_total_fat)}g
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-2 flex flex-wrap gap-2">
          {food.nf_dietary_fiber && (
            <span className="text-xs bg-gray-50 px-2 py-1 rounded">
              Fiber: {Math.round(food.nf_dietary_fiber)}g
            </span>
          )}
          {food.nf_sugars && (
            <span className="text-xs bg-gray-50 px-2 py-1 rounded">
              Sugars: {Math.round(food.nf_sugars)}g
            </span>
          )}
          {food.nf_sodium && (
            <span className="text-xs bg-gray-50 px-2 py-1 rounded">
              Sodium: {Math.round(food.nf_sodium)}mg
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default InstantFoodDetails;