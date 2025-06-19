import React from "react";

const Sort = ({ sortBy, setSortBy }) => {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="p-2 border border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-r from-[#93C5FD] via-[#D8B4FE] to-[#e478b3] hover:from-[#A5B4FC] hover:via-[#E0A7F9] hover:to-[#FBCFE8] transition-all duration-300 shadow-md text-indigo-900 font-semibold"
    >
      <option
        value="name"
        className="bg-white text-gray-800 hover:bg-indigo-200"
      >
        🔤 Sort by Name
      </option>
      <option
        value="price"
        className="bg-white text-gray-800 hover:bg-yellow-200"
      >
        💰 Sort by Price
      </option>
      <option
        value="quantity"
        className="bg-white text-gray-800 hover:bg-green-200"
      >
        📦 Sort by Quantity
      </option>
    </select>
  );
};

export default Sort;
