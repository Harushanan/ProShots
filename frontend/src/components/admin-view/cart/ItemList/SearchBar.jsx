import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlineCamera } from "react-icons/ai";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const SearchBar = ({
  searchQuery = "",
  setSearchQuery,
  darkMode = false,
  setFilteredItems,
  items = [],
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
          .trim()
          .replace(/\./g, "");
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast.error("Speech recognition error");
      };

      recognitionRef.current = recognition;
    } else {
      toast.error("Speech recognition not supported in this browser");
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [setSearchQuery]);

  const toggleVoiceSearch = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting recognition:", err);
        toast.error("Failed to start voice recognition");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const findSimilarImages = async (base64Image) => {
  try {
    const response = await fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Image }),
    });


    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorData = contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      throw new Error(typeof errorData === "string" ? errorData : errorData.error || "Image search failed");
    }

    return contentType && contentType.includes("application/json")
      ? await response.json()
      : {};
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
};

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size must be less than 5MB");
      return;
    }

    const toastId = toast.loading("Searching for similar items...");

    try {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => {
          toast.update(toastId, {
            render: "Failed to read image",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          reject(new Error("Failed to read image"));
        };
        reader.readAsDataURL(file);
      });

      const { success, concepts, error } = await findSimilarImages(base64Image);

      if (!success || !concepts?.length) {
        throw new Error("No similar items found" || error);
      }

      console.log("API Response Concepts:", concepts);

      // Improved matching with fuzzy matching
      const filtered = items.filter((item) => {
        const itemName = item.name.toLowerCase();
        const itemTags = item.tags?.map((tag) => tag.toLowerCase()) || [];

        return concepts.some((concept) => {
          // Basic contains check
          if (itemName.includes(concept.name)) return true;

          // Check tags
          if (itemTags.some((tag) => tag.includes(concept.name))) return true;

          // Split into words and check partial matches
          const conceptWords = concept.name.split(/\s+/);
          return conceptWords.some(
            (word) =>
              itemName.includes(word) ||
              itemTags.some((tag) => tag.includes(word))
          );
        });
      });

      if (filtered.length === 0) {
        console.log("Available items:", items);
        throw new Error("No matcheing images found ");
      }

      setFilteredItems(filtered);
      setSearchQuery("");
      toast.update(toastId, {
        render: `Found ${filtered.length} similar items`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Image search error:", error);
      toast.update(toastId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Color schemes
  const colors = {
    light: {
      background: "bg-gradient-to-r from-purple-50 to-indigo-50",
      searchIcon: "from-purple-500 to-indigo-600",
      voiceButton: "from-blue-400 to-indigo-500",
      voiceButtonActive: "from-red-400 to-pink-500",
      cameraButton: "from-green-400 to-teal-500",
      text: "text-gray-700",
      placeholder: "placeholder-gray-400",
      ring: "ring-indigo-400",
      listeningBg: "bg-white",
      listeningText: "text-gray-800",
      listeningSubtext: "text-gray-500",
    },
    dark: {
      background: "bg-gradient-to-r from-gray-800 to-gray-900",
      searchIcon: "from-purple-600 to-indigo-700",
      voiceButton: "from-blue-600 to-indigo-700",
      voiceButtonActive: "from-red-500 to-pink-600",
      cameraButton: "from-green-500 to-teal-600",
      text: "text-white",
      placeholder: "placeholder-gray-400",
      ring: "ring-indigo-500",
      listeningBg: "bg-gray-800",
      listeningText: "text-white",
      listeningSubtext: "text-gray-300",
    },
  };

  const mode = darkMode ? "dark" : "light";

  return (
    <div className="flex justify-center items-center mb-8 px-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
        capture="environment"
      />

      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`relative flex items-center rounded-full transition-all duration-300 ${
            isFocused ? `ring-2 ${colors[mode].ring} shadow-lg` : "shadow-md"
          } ${colors[mode].background}`}
        >
          {/* Search icon */}
          <div className="absolute left-0 h-full flex items-center pl-3">
            <div
              className={`p-2 rounded-full bg-gradient-to-r ${colors[mode].searchIcon} text-white`}
            >
              <AiOutlineSearch className="text-xl" />
            </div>
          </div>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search by product name or upload image..."
            className={`w-full px-16 py-4 border-0 rounded-full ${colors[mode].text} focus:outline-none ${colors[mode].placeholder} font-medium transition-all duration-300`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Camera button */}
          <motion.button
            onClick={triggerFileInput}
            className={`absolute right-24 h-full flex items-center justify-center rounded-full px-3 text-white bg-gradient-to-r ${colors[mode].cameraButton} transition-all duration-300`}
            whileTap={{ scale: 0.95 }}
            aria-label="Search by image"
            title="Search by image"
          >
            <AiOutlineCamera className="w-5 h-5" />
          </motion.button>

          {/* Voice search button */}
          <motion.button
            onClick={toggleVoiceSearch}
            className={`absolute right-0 h-full flex items-center justify-center pr-3 rounded-r-full px-4 text-white transition-all duration-300 ${
              isListening
                ? `bg-gradient-to-r ${colors[mode].voiceButtonActive}`
                : `bg-gradient-to-r ${colors[mode].voiceButton}`
            }`}
            whileTap={{ scale: 0.95 }}
            aria-label={isListening ? "Stop listening" : "Start voice search"}
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="stop"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <FaStop className="w-5 h-5" />
                  <span className="text-sm font-medium">Stop</span>
                </motion.div>
              ) : (
                <motion.div
                  key="mic"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <FaMicrophone className="w-5 h-5" />
                  <span className="text-sm font-medium">Voice</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Listening indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-full left-0 right-0 mt-3 p-4 rounded-xl shadow-xl z-10 border ${
                colors[mode].listeningBg
              } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div
                    className={`w-4 h-4 rounded-full absolute animate-ping bg-gradient-to-r ${colors[mode].voiceButtonActive}`}
                  ></div>
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[mode].voiceButtonActive}`}
                  ></div>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${colors[mode].listeningText}`}
                  >
                    Listening...
                  </p>
                  <p className={`text-xs ${colors[mode].listeningSubtext}`}>
                    Speak clearly into your microphone
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;