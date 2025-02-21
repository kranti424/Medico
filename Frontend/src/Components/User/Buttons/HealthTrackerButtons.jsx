import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ActivitySquare, 
  CalendarDays, 
  Dumbbell, 
  Apple,
  Scale,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HealthTrackerButton = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    {
      title: "Daily Calories",
      icon: <CalendarDays className="h-4 w-4" />,
      path: "/dailycalories",
      description: "Calculate your daily calorie needs",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Exercise Calories",
      icon: <Dumbbell className="h-4 w-4" />,
      path: "/exercisecalories",
      description: "Track calories burned during exercise",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Food Search",
      icon: <Apple className="h-4 w-4" />,
      path: "/foodsearch",
      description: "Search detailed food nutrition info",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Quick Food Lookup",
      icon: <Search className="h-4 w-4" />,
      path: "/instantfooddetails",
      description: "Instant food nutrition details",
      color: "from-purple-500 to-purple-600",
    },
    {
        title: "BMI Calculator",
        icon: <Scale className="h-4 w-4" />,
        path: "/bmitracker",
        description: "Calculate and track your BMI",
        color: "from-indigo-500 to-purple-600",
      }
  ];

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed top-36 right-4 md:top-44 md:right-8 z-[9997]">
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && !showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 
                       bg-black/75 text-white text-sm rounded-lg whitespace-nowrap"
            >
              Health Tracker
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setShowMenu(!showMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 
                   text-white rounded-full shadow-lg flex items-center gap-2 
                   hover:from-emerald-600 hover:to-teal-700 transition-all duration-300
                   min-w-[110px] md:min-w-[160px] justify-center"
        >
          <ActivitySquare className="h-5 w-5 animate-pulse" />
          <span className="text-xs md:text-sm font-medium whitespace-nowrap">
            Health Tracker
          </span>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl 
                       shadow-xl border border-gray-100 overflow-hidden"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    transition: { delay: index * 0.1 } 
                  }}
                  onClick={() => {
                    setShowMenu(false);
                    navigate(item.path);
                  }}
                  className="cursor-pointer group"
                >
                  <div className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} 
                                    text-white group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className="fixed inset-0 z-[9996] bg-black/20"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthTrackerButton;