import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ClientHeader from './Header';

const ColorSetUp = () => {
  const getThemeClasses = () => {
    switch(currentTheme) {
      case "ocean": return "bg-gradient-to-b from-blue-100 to-blue-100";
      case "forest": return "bg-gradient-to-b from-green-50 to-green-200";
      case "royal": return "bg-gradient-to-b from-purple-100 to-purple-300";
      case "blossom": return "bg-gradient-to-b from-pink-50 to-rose-200";
      case "tropical": return "bg-gradient-to-b from-teal-100 to-emerald-200";
      case "golden": return "bg-gradient-to-b from-yellow-100 to-amber-200";
      case "berry": return "bg-gradient-to-b from-fuchsia-100 to-purple-300";
      case "misty": return "bg-gradient-to-b from-gray-100 to-gray-300";
      case "sunset": return "bg-gradient-to-b from-amber-100 to-orange-300";
      case "midnight": return "bg-gradient-to-b from-indigo-300 to-gray-300";
      case "coral": return "bg-gradient-to-b from-rose-100 to-rose-300";
      case "sapphire": return "bg-gradient-to-b from-blue-100 to-blue-400";
      case "emerald": return "bg-gradient-to-b from-emerald-100 to-emerald-400";
      case "lavender": return "bg-gradient-to-b from-purple-50 to-purple-200";
      case "amber": return "bg-gradient-to-b from-amber-50 to-amber-200";
      default: return "bg-gradient-to-b from-blue-50 to-white";
    }
  };

  const [currentTheme, setCurrentTheme] = useState(() => {
      return localStorage.getItem("theme") || "bg-gradient-to-b from-blue-50 to-blue-50";
    });
    
    const handleThemeChange = (theme) => {
      setCurrentTheme(theme);
      localStorage.setItem("theme", theme);
    };

  return (
    <div className={`overflow-x-hidden min-h-screen transition-colors duration-300 ${getThemeClasses()}`}> 
      <div className='hidden'>
        <ClientHeader 
          onThemeChange={handleThemeChange} 
          currentTheme={currentTheme} 
        />
      </div>
      <main className="relative z-1">
        <Outlet />
      </main>
    </div>
  )
}

export default ColorSetUp