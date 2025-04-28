import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="bg-blue-500 p-4 shadow-lg mt-10 w-11/12 mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Order Management</h1>
        <div className="space-x-6 flex items-center">
          <Link to="/admin/placedOrders" className="text-white hover:text-gray-200">
            Placed Orders
          </Link>
          <Link to="/admin/deletedOrders" className="text-white hover:text-gray-200">
            Deleted Orders
          </Link>
          <Link to="/admin/OrderReport" className="text-white hover:text-gray-200">
            Order Report
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
