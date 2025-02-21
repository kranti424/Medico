const axios = require("axios");
require("dotenv").config();

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

const baseURL = "https://trackapi.nutritionix.com/v2";
const headers = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "Content-Type": "application/json"
};

// Get instant food search results
exports.searchInstant = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const response = await axios.get(`${baseURL}/search/instant`, {
            params: { query },
            headers
        });

        res.json({
            common: response.data.common || [],
            branded: response.data.branded || [],
            message: "Search results retrieved successfully"
        });
    } catch (error) {
        console.error("Instant search error:", error);
        res.status(500).json({
            error: "Failed to fetch food suggestions",
            details: error.response?.data || error.message
        });
    }
};

// Get detailed nutrition information
exports.getNutritionInfo = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Food query is required" });
        }

        const response = await axios.post(
            `${baseURL}/natural/nutrients`,
            { query },
            { headers }
        );

        res.json({
            foods: response.data.foods,
            message: "Nutrition information retrieved successfully"
        });
    } catch (error) {
        console.error("Nutrition info error:", error);
        res.status(500).json({
            error: "Failed to fetch nutrition information",
            details: error.response?.data || error.message
        });
    }
};

// Get exercise calories
exports.getExerciseCalories = async (req, res) => {
    try {
        const { query, gender, weight_kg, height_cm, age } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Exercise description is required" });
        }

        const response = await axios.post(
            `${baseURL}/natural/exercise`,
            {
                query,
                gender,
                weight_kg,
                height_cm,
                age
            },
            { headers }
        );

        res.json({
            exercises: response.data.exercises,
            message: "Exercise calories calculated successfully"
        });
    } catch (error) {
        console.error("Exercise calories error:", error);
        res.status(500).json({
            error: "Failed to calculate exercise calories",
            details: error.response?.data || error.message
        });
    }
};

// Calculate daily calorie needs
exports.calculateDailyCalories = async (req, res) => {
    try {
      const { gender, age, height_cm, weight_kg, activity_level } = req.body;

      // Enhanced validation
      const validationErrors = [];

      if (!gender || !["male", "female"].includes(gender.toLowerCase())) {
        validationErrors.push("Valid gender (male/female) is required");
      }

      if (!age || age < 15 || age > 80) {
        validationErrors.push("Age must be between 15 and 80 years");
      }

      if (!height_cm || height_cm < 130 || height_cm > 230) {
        validationErrors.push("Height must be between 130cm and 230cm");
      }

      if (!weight_kg || weight_kg < 40 || weight_kg > 160) {
        validationErrors.push("Weight must be between 40kg and 160kg");
      }

      const validActivityLevels = [
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ];
      if (
        !activity_level ||
        !validActivityLevels.includes(activity_level.toLowerCase())
      ) {
        validationErrors.push(
          `Activity level must be one of: ${validActivityLevels.join(", ")}`
        );
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationErrors,
        });
      }

      // Calculate BMR using Mifflin-St Jeor Equation
      const normalizedGender = gender.toLowerCase();
      const normalizedActivity = activity_level.toLowerCase();

      // Activity multipliers with descriptions
      const activityMultipliers = {
        sedentary: {
          factor: 1.2,
          description: "Little or no exercise, desk job",
        },
        light: {
          factor: 1.375,
          description: "Light exercise 1-3 days/week",
        },
        moderate: {
          factor: 1.55,
          description: "Moderate exercise 3-5 days/week",
        },
        active: {
          factor: 1.725,
          description: "Heavy exercise 6-7 days/week",
        },
        very_active: {
          factor: 1.9,
          description:
            "Very heavy exercise, physical job or training twice/day",
        },
      };

      // Calculate BMR
      const bmr =
        normalizedGender === "male"
          ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
          : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;

      const dailyCalories = Math.round(
        bmr * activityMultipliers[normalizedActivity].factor
      );

      // Calculate macronutrient recommendations
      const macros = {
        protein: {
          grams: Math.round((dailyCalories * 0.3) / 4), // 30% of calories, 4 calories per gram
          calories: Math.round(dailyCalories * 0.3),
        },
        carbs: {
          grams: Math.round((dailyCalories * 0.45) / 4), // 45% of calories, 4 calories per gram
          calories: Math.round(dailyCalories * 0.45),
        },
        fats: {
          grams: Math.round((dailyCalories * 0.25) / 9), // 25% of calories, 9 calories per gram
          calories: Math.round(dailyCalories * 0.25),
        },
      };

      res.json({
        success: true,
        data: {
          daily_calories: dailyCalories,
          bmr: Math.round(bmr),
          activity_level: normalizedActivity,
          activity_description:
            activityMultipliers[normalizedActivity].description,
          macronutrient_goals: macros,
          weight_goals: {
            weight_loss: Math.round(dailyCalories - 500), // 500 calorie deficit
            weight_gain: Math.round(dailyCalories + 500), // 500 calorie surplus
            maintenance: dailyCalories,
          },
        },
        message: "Daily calorie needs calculated successfully",
      });
    } catch (error) {
      console.error("Daily calories calculation error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to calculate daily calorie needs",
        details: error.message,
      });
    }
};

// Get food item by UPC
exports.getFoodByUPC = async (req, res) => {
    try {
        const { upc } = req.query;
        if (!upc) {
            return res.status(400).json({ error: "UPC code is required" });
        }

        const response = await axios.get(`${baseURL}/search/item`, {
            params: { upc },
            headers
        });

        res.json({
            food: response.data.foods[0],
            message: "Food item retrieved successfully"
        });
    } catch (error) {
        console.error("UPC search error:", error);
        res.status(500).json({
            error: "Failed to fetch food item",
            details: error.response?.data || error.message
        });
    }
};