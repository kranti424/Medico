import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const Detection = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const userMessage = symptoms.trim();
    setSymptoms("");
    setLoading(true);

    // Add user message immediately
    const newUserMessage = { type: "user", content: userMessage };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const response = await axios.post("http://localhost:8080/predict", {
        description: userMessage,
      });

      // Add AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", content: response.data.referral },
      ]);
    } catch (err) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "error",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const Message = ({ type, content }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 mb-4 ${
        type === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
        ${type === "user" ? "bg-blue-50" : "bg-gray-50"}`}
      >
        {type === "user" ? (
          <FaUser className="text-blue-500" />
        ) : (
          <FaRobot className="text-gray-700" />
        )}
      </div>
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          type === "user"
            ? "bg-blue-500 text-white ml-auto"
            : type === "error"
            ? "bg-red-50 text-red-600"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Warning Banner */}
      <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-amber-800">
            <FaExclamationTriangle className="text-amber-600" />
            <p className="text-sm">
              <span className="font-semibold">Beta Testing:</span> Results are
              for reference only.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 h-[calc(100vh-40px)] flex flex-col">
        {/* Header */}
        <div className="mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaRobot className="text-blue-500 text-2xl" />
            </div>
            AI Symptom Analyzer
          </h1>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-center p-6 bg-white/50 rounded-lg border border-gray-100">
                <FaRobot className="text-blue-500 text-3xl mx-auto mb-2" />
                <p className="text-gray-600">
                  Describe your symptoms in detail for specialist
                  recommendations
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <Message key={idx} {...msg} />
            ))}
            {loading && (
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 rounded-lg">
                <FaSpinner className="animate-spin text-blue-500" />
                <span className="text-gray-600">Analyzing...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t p-3 bg-white/90">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 
                         focus:ring-1 focus:ring-blue-500 resize-none bg-white
                         transition-all duration-200 text-sm"
                placeholder="Describe your symptoms here..."
                rows={1}
              />
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         flex items-center gap-2 transition-all duration-200
                         hover:shadow-md active:scale-95 h-[38px]"
              >
                <FaPaperPlane className="text-sm" />
                <span className="hidden sm:inline text-sm">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detection;
