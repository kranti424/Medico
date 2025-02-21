import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, Info, Scale } from "lucide-react";

const BMITracker = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBMICategory] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBMI(parseFloat(bmiValue));
      determineCategory(bmiValue);
    }
  };

  const determineCategory = (bmiValue) => {
    if (bmiValue < 18.5) setBMICategory('Underweight');
    else if (bmiValue >= 18.5 && bmiValue < 25) setBMICategory('Normal');
    else if (bmiValue >= 25 && bmiValue < 30) setBMICategory('Overweight');
    else setBMICategory('Obese');
  };

  const getCategoryColor = () => {
    switch (bmiCategory) {
      case 'Underweight': return 'text-blue-500';
      case 'Normal': return 'text-green-500';
      case 'Overweight': return 'text-orange-500';
      case 'Obese': return 'text-red-500';
      default: return 'text-gray-700';
    }
  };

  const getBMIScale = () => {
    const categories = [
      { range: '< 18.5', label: 'Underweight', color: 'bg-blue-500' },
      { range: '18.5 - 24.9', label: 'Normal', color: 'bg-green-500' },
      { range: '25 - 29.9', label: 'Overweight', color: 'bg-orange-500' },
      { range: '≥ 30', label: 'Obese', color: 'bg-red-500' }
    ];

    return (
      <div className="flex justify-between w-full mt-6">
        {categories.map((category, index) => (
          <div key={index} className="text-center flex-1">
            <div className={`h-2 ${category.color}`} />
            <p className="text-xs mt-1 text-gray-600">{category.range}</p>
            <p className="text-xs font-medium">{category.label}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BMI Calculator</h1>
          <p className="text-gray-600">Track your Body Mass Index (BMI)</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Scale className="text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">Calculate Your BMI</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your height"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your weight"
                />
              </div>

              <button
                onClick={calculateBMI}
                className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                         transition-colors flex items-center justify-center gap-2"
              >
                Calculate BMI
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-800">Your Results</h2>
              </div>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>

            {bmi ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-4">
                  <p className="text-gray-600 mb-1">Your BMI is</p>
                  <h3 className="text-4xl font-bold text-purple-500">{bmi}</h3>
                </div>

                <p className="text-lg mb-4">
                  You are{' '}
                  <span className={`font-semibold ${getCategoryColor()}`}>
                    {bmiCategory}
                  </span>
                </p>

                {getBMIScale()}
              </motion.div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Enter your height and weight to see your BMI results
              </div>
            )}
          </motion.div>
        </div>

        {/* BMI Information Modal */}
        <AnimatePresence>
          {showInfo && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowInfo(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Understanding BMI
                </h3>
                <div className="space-y-3 text-gray-600 text-sm">
                  <p>BMI Categories:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Underweight: less than 18.5</li>
                    <li>Normal weight: 18.5 to 24.9</li>
                    <li>Overweight: 25 to 29.9</li>
                    <li>Obese: 30 or greater</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4">
                    Note: BMI is a general indicator and may not be accurate for athletes,
                    pregnant women, or the elderly.
                  </p>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-lg 
                           hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BMITracker;