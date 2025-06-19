import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi"; 

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0); 
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(storedCart.length); 
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount); 

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <nav className="bg-blue-500 p-4 shadow-lg mt-20 w-10/12 mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Inventory Management</h1>
        <div className="space-x-6 flex items-center">
          <Link to="/admin/create-product" className="text-white hover:text-gray-200">
            Create Product
          </Link>
          <Link to="/admin/product-list" className="text-white hover:text-gray-200">
            Product List
          </Link>

          { !location.pathname.includes('/admin/product-list') && !location.pathname.includes('/admin/create-product') &&
            <Link to="/admin/cart" className="relative text-white hover:text-gray-200">
              <FiShoppingCart className="text-2xl" />
              {cartCount > 0 && ( 
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          }
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
