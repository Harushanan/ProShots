import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="bg-blue-500 p-4 shadow-lg mt-10 w-10/12 mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Blog Management</h1>
        <div className="space-x-6 flex items-center">
          <Link to="/admin/oldEventUpload" className="text-white hover:text-gray-200">
            Upload Old Events
          </Link>
          <Link to="/admin/oldEventDelete" className="text-white hover:text-gray-200">
            View Old Events
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
