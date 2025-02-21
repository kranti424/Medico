import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DetectButton = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setShowWarning(true);
  };

  const handleAgree = () => {
    setShowWarning(false);
    navigate("/detect");
  };

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed top-20 right-4 md:top-24 md:right-8 z-[9998]">
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 
                       bg-black/75 text-white text-sm rounded-lg whitespace-nowrap"
            >
              Check Disease
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-red-600 to-red-700 
                   text-white rounded-full shadow-lg flex items-center gap-2 
                   hover:from-red-700 hover:to-red-800 transition-all duration-300
                   min-w-[110px] md:min-w-[160px] justify-center"
        >
          <Bot className="h-5 w-5 animate-pulse" />
          <span className="text-xs md:text-sm font-medium whitespace-nowrap">
            AI Disease Detector
          </span>
        </motion.button>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ⚠️ AI Feature Testing
              </h2>
              <p className="text-gray-600">
                This AI disease detection is in testing phase. Results may not
                be 100% accurate.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAgree}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg
                           hover:bg-red-700 transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowWarning(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg
                           hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DetectButton;
