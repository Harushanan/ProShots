import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check for saved preference or system preference
        const isDark = localStorage.getItem('darkMode') === 'true' || 
                      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.documentElement.classList.toggle('dark', newMode);
    };

    return (
        <button 
            onClick={toggleDarkMode}
            className="bg-black p-2 rounded-full text-gray-100 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {darkMode ? <FaSun className="w-9 h-9" /> : <FaMoon className="w-9 h-9" />}
        </button>
    );
};

export default DarkModeToggle;