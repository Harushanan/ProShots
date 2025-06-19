import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by item name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 pl-10 border border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-r from-[#93C5FD] via-[#D8B4FE] to-[#F9A8D4] hover:from-[#D8B4FE] hover:to-[#F9A8D4] transition-all duration-300 placeholder:text-black"
      />
      <AiOutlineSearch
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600"
        style={{ fontSize: "24px" }}
      />
    </div>
  );
};

export default SearchBar;
