import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Product Management</h1>
        <div className="space-x-4">
          <Link to="/create-product" className="text-white hover:text-gray-200">
            Create Product
          </Link>
          <Link to="/product-list" className="text-white hover:text-gray-200">
            Product List
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
