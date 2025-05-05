import { useState, useEffect, useRef } from "react";

const TextToSpeechButton = ({ contentRef }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceOptions, setShowVoiceOptions] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState(null);

  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const optionsRef = useRef();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const englishVoice =
          availableVoices.find((v) => v.lang.includes("en")) ||
          availableVoices[0];
        setSelectedVoice(englishVoice);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, [synth, selectedVoice]);

  // Close voice options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowVoiceOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const speakContent = () => {
    if (!contentRef.current) return;

    const text = contentRef.current.innerText || contentRef.current.textContent;
    if (!text.trim()) return;

    // Get all text nodes and their positions
    const lines = getTextLines(contentRef.current);
    if (lines.length === 0) return;

    setIsPlaying(true);
    setIsPaused(false);
    setHighlightedLine(0);
    speakLine(lines, 0);
  };

  // Function to extract all text lines with their positions
  const getTextLines = (element) => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const lines = [];
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim() !== "") {
        const parentElement = node.parentElement;
        if (parentElement) {
          lines.push({
            text: node.nodeValue.trim(),
            element: parentElement,
          });
        }
      }
    }

    return lines;
  };

  const speakLine = (lines, index) => {
    if (index >= lines.length || isPaused) {
      setIsPlaying(false);
      setCurrentChunkIndex(0);
      setHighlightedLine(null);
      return;
    }

    setCurrentChunkIndex(index);
    setHighlightedLine(index);

    // Scroll to the highlighted line
    lines[index].element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Highlight the current line
    lines[index].element.classList.add(
      "bg-yellow-100",
      "transition-colors",
      "duration-200"
    );

    // Remove highlight from previous line
    if (index > 0) {
      lines[index - 1].element.classList.remove("bg-yellow-100");
    }

    const utterance = new SpeechSynthesisUtterance(lines[index].text);
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      // Remove highlight when moving to next line
      lines[index].element.classList.remove("bg-yellow-100");
      speakLine(lines, index + 1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentChunkIndex(0);
      setHighlightedLine(null);
      lines[index].element.classList.remove("bg-yellow-100");
    };

    synth.speak(utterance);
    utteranceRef.current = utterance;
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      speakContent();
    } else if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
    setHighlightedLine(null);

    // Remove all highlights when stopping
    if (contentRef.current) {
      const highlighted = contentRef.current.querySelectorAll(".bg-yellow-100");
      highlighted.forEach((el) => el.classList.remove("bg-yellow-100"));
    }
  };

  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
    setShowVoiceOptions(false);
    if (isPlaying) {
      handleStop();
      setTimeout(speakContent, 100);
    }
  };

  return (
    <div className="relative inline-block" ref={optionsRef}>
      <div className="flex gap-2">
        <button
          onClick={handlePlayPause}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isPlaying && !isPaused
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          } transition-colors`}
          aria-label={
            isPlaying ? (isPaused ? "Resume" : "Pause") : "Listen to Report"
          }
        >
          {isPlaying && !isPaused ? (
            <PauseIcon />
          ) : isPaused ? (
            <PlayIcon />
          ) : (
            <PlayIcon />
          )}
          <span>{isPlaying ? (isPaused ? "Resume" : "Pause") : "Listen"}</span>
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            aria-label="Stop"
          >
            <StopIcon />
            <span>Stop</span>
          </button>
        )}

        <button
          onClick={() => setShowVoiceOptions(!showVoiceOptions)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          aria-label="Voice options"
        >
          <VoiceIcon />
          <span>Voice</span>
        </button>
      </div>

      {showVoiceOptions && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {voices.map((voice) => (
              <button
                key={voice.name}
                onClick={() => handleVoiceChange(voice)}
                className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                  voice.name === selectedVoice?.name
                    ? "bg-blue-100 font-medium"
                    : ""
                }`}
              >
                <div className="flex justify-between">
                  <span>{voice.name}</span>
                  <span className="text-xs text-gray-500">{voice.lang}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Icon components remain the same
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
      clipRule="evenodd"
    />
  </svg>
);

const VoiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859H12z"
      clipRule="evenodd"
    />
  </svg>
);

export default TextToSpeechButton;





{
  /*import { useState, useEffect, useRef } from "react";

const TextToSpeechButton = ({ contentRef }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceOptions, setShowVoiceOptions] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);

  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const optionsRef = useRef();
  const languageOptionsRef = useRef();

  // Supported languages (you can expand this list)
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ar", name: "Arabic" },
  ];

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Try to find a voice matching the target language
        const matchingVoice =
          availableVoices.find((v) => v.lang.includes(targetLanguage)) ||
          availableVoices.find((v) => v.lang.includes("en")) ||
          availableVoices[0];
        setSelectedVoice(matchingVoice);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, [synth, selectedVoice, targetLanguage]);

  // Close voice/language options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowVoiceOptions(false);
      }
      if (
        languageOptionsRef.current &&
        !languageOptionsRef.current.contains(event.target)
      ) {
        setShowLanguageOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Translate text using a translation API (mock implementation)
  const translateText = async (text, targetLang) => {
    // In a real app, replace this with an actual API call to:
    // Google Translate API, DeepL, Microsoft Translator, etc.
    
    // Mock implementation for demonstration
    setIsTranslating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would call your translation API here
      // const response = await fetch(`your-translation-api-endpoint?text=${encodeURIComponent(text)}&target=${targetLang}`);
      // const data = await response.json();
      // return data.translatedText;
      
      // Mock translations for demonstration
      const mockTranslations = {
        en: text, // English (original)
        es: `${text} (translated to Spanish)`,
        fr: `${text} (translated to French)`,
        de: `${text} (translated to German)`,
        it: `${text} (translated to Italian)`,
        pt: `${text} (translated to Portuguese)`,
        ru: `${text} (translated to Russian)`,
        zh: `${text} (translated to Chinese)`,
        ja: `${text} (translated to Japanese)`,
        ar: `${text} (translated to Arabic)`,
      };
      
      return mockTranslations[targetLang] || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  };

  const speakContent = async () => {
    if (!contentRef.current) return;

    const text = contentRef.current.innerText || contentRef.current.textContent;
    if (!text.trim()) return;

    // Get all text nodes and their positions
    const lines = getTextLines(contentRef.current);
    if (lines.length === 0) return;

    setIsPlaying(true);
    setIsPaused(false);
    setHighlightedLine(0);

    // Translate all lines first
    const translatedLines = [];
    for (const line of lines) {
      const translatedText = await translateText(line.text, targetLanguage);
      translatedLines.push({
        ...line,
        translatedText
      });
    }

    speakLine(translatedLines, 0);
  };

  const getTextLines = (element) => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const lines = [];
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim() !== "") {
        const parentElement = node.parentElement;
        if (parentElement) {
          lines.push({
            text: node.nodeValue.trim(),
            element: parentElement,
          });
        }
      }
    }

    return lines;
  };

  const speakLine = (lines, index) => {
    if (index >= lines.length || isPaused) {
      setIsPlaying(false);
      setCurrentChunkIndex(0);
      setHighlightedLine(null);
      return;
    }

    setCurrentChunkIndex(index);
    setHighlightedLine(index);

    // Scroll to the highlighted line
    lines[index].element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Highlight the current line
    lines[index].element.classList.add(
      "bg-yellow-100",
      "transition-colors",
      "duration-200"
    );

    // Remove highlight from previous line
    if (index > 0) {
      lines[index - 1].element.classList.remove("bg-yellow-100");
    }

    // Use translated text if available, otherwise original text
    const textToSpeak = lines[index].translatedText || lines[index].text;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      // Remove highlight when moving to next line
      lines[index].element.classList.remove("bg-yellow-100");
      speakLine(lines, index + 1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentChunkIndex(0);
      setHighlightedLine(null);
      lines[index].element.classList.remove("bg-yellow-100");
    };

    synth.speak(utterance);
    utteranceRef.current = utterance;
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      speakContent();
    } else if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
    setHighlightedLine(null);

    // Remove all highlights when stopping
    if (contentRef.current) {
      const highlighted = contentRef.current.querySelectorAll(".bg-yellow-100");
      highlighted.forEach((el) => el.classList.remove("bg-yellow-100"));
    }
  };

  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
    setShowVoiceOptions(false);
    if (isPlaying) {
      handleStop();
      setTimeout(speakContent, 100);
    }
  };

  const handleLanguageChange = async (langCode) => {
    setTargetLanguage(langCode);
    setShowLanguageOptions(false);
    
    // Update voice to match the new language if possible
    const availableVoices = synth.getVoices();
    const matchingVoice = availableVoices.find(v => v.lang.includes(langCode));
    if (matchingVoice) {
      setSelectedVoice(matchingVoice);
    }
    
    if (isPlaying) {
      handleStop();
      setTimeout(speakContent, 100);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={handlePlayPause}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isPlaying && !isPaused
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          } transition-colors`}
          disabled={isTranslating}
          aria-label={
            isPlaying ? (isPaused ? "Resume" : "Pause") : "Listen to Report"
          }
        >
          {isTranslating ? (
            <LoadingSpinner />
          ) : isPlaying && !isPaused ? (
            <PauseIcon />
          ) : isPaused ? (
            <PlayIcon />
          ) : (
            <PlayIcon />
          )}
          <span>
            {isTranslating
              ? "Translating..."
              : isPlaying
              ? isPaused
                ? "Resume"
                : "Pause"
              : "Listen"}
          </span>
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
            aria-label="Stop"
          >
            <StopIcon />
            <span>Stop</span>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative inline-block" ref={optionsRef}>
          <button
            onClick={() => setShowVoiceOptions(!showVoiceOptions)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            aria-label="Voice options"
          >
            <VoiceIcon />
            <span>Voice: {selectedVoice?.name || "Default"}</span>
          </button>

          {showVoiceOptions && (
            <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {voices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => handleVoiceChange(voice)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                      voice.name === selectedVoice?.name
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>{voice.name}</span>
                      <span className="text-xs text-gray-500">{voice.lang}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative inline-block" ref={languageOptionsRef}>
          <button
            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            aria-label="Language options"
          >
            <LanguageIcon />
            <span>
              Language: {languages.find(l => l.code === targetLanguage)?.name || "English"}
            </span>
          </button>

          {showLanguageOptions && (
            <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                      language.code === targetLanguage
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add these new icon components
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const LanguageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.914-1.026 18.588 18.588 0 01-2.487-3.953A1 1 0 015 8V7a1 1 0 112 0v1h1a1 1 0 110 2H7.422a18.87 18.87 0 011.724 4.78 20.979 20.979 0 01-1.44 1.389 1 1 0 01-1.44-1.389 20.981 20.981 0 01.914-1.026A18.588 18.588 0 018.49 8h-2.96a1 1 0 010-2h3a1 1 0 011-1V3a1 1 0 011-1zm6 8a1 1 0 100-2h-1a1 1 0 100 2h1z"
      clipRule="evenodd"
    />
    <path d="M12 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
  </svg>
);

// Keep the existing icon components (PlayIcon, PauseIcon, StopIcon, VoiceIcon)

export default TextToSpeechButton; */
}
