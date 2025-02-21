import { useEffect } from "react";
import { motion } from "framer-motion";
import { IoLanguage } from "react-icons/io5";

const TranslateWidget = () => {
  useEffect(() => {
    const hideGoogleTranslateBanner = () => {
      const banner = document.querySelector(".skiptranslate");
      if (banner) {
        banner.style.display = "none";
        document.body.style.top = "0";
      }
    };

    const addGoogleTranslateScript = () => {
      if (document.getElementById("google-translate-script")) return;
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,mr,gu,bn,ta,te,kn,ml,pa,ur,en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );
      setTimeout(hideGoogleTranslateBanner, 100);
    };

    addGoogleTranslateScript();

    // Observe dynamic changes
    const observer = new MutationObserver(hideGoogleTranslateBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Ensure dropdown opens on click
  const handleWidgetClick = () => {
    const translateContainer = document.querySelector(".goog-te-gadget-simple");
    if (translateContainer) {
      translateContainer.click(); // Simulate a click to open the dropdown
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 right-4 z-[9999] md:top-6 md:right-6 lg:top-8 lg:right-8"
    >
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-menu-frame {
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.12) !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
      <div className="relative group">
        {/* Gradient Background */}
        <div 
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 
                     rounded-lg blur opacity-75 group-hover:opacity-100 
                     transition duration-1000 group-hover:duration-200 animate-tilt"
        />
        
        {/* Main Container */}
        <div
          className="relative flex items-center gap-3 bg-white/95 backdrop-blur-sm 
                     px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl 
                     transition-all duration-300 cursor-pointer"
          onClick={handleWidgetClick} // Open dropdown on click
        >
          <IoLanguage className="text-2xl text-blue-600" />

          {/* Google Translate Element */}
          <div id="google_translate_element" className="min-w-[120px]" />

          {/* Bottom Border Animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-1 left-0 right-0 h-0.5 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     origin-left"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TranslateWidget;
