const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/HealthTracker/healthController');

// Food and nutrition routes
router.get('/food/search', healthController.searchInstant);
router.post('/food/nutrition', healthController.getNutritionInfo);
router.get('/food/upc', healthController.getFoodByUPC);

// Exercise and calories routes
router.post('/exercise/calories', healthController.getExerciseCalories);
router.post('/calculate/dailycalories', healthController.calculateDailyCalories);

module.exports = router;