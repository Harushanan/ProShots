import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMicrophone } from "react-icons/fa";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [isListening, setIsListening] = useState(false);

  // Initialize SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const cleanedTranscript = transcript.replace(/\./g, "").trim();
    setSearchQuery(cleanedTranscript);
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setIsListening(false);
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex justify-center items-center mb-4">
      <div className="relative w-full md:w-1/2">
        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full px-4 py-2 border border-blue-400 rounded-md pl-10 text-blue-700 
                 bg-gradient-to-r from-blue-200 via-purple-250 to-pink-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={toggleVoiceSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
        >
          <FaMicrophone
            className={`w-5 h-5 ${isListening ? "text-red-500" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
