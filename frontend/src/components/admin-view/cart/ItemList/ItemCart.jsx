import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemCard = ({
  item,
  selectedSize,
  onSizeChange,
  onEdit,
  onDelete,
  onImageClick,
  getPriceForSize,
}) => {
  const [clickedItem, setClickedItem] = useState(null);

  const hasValidSizes =
    item.sizes && item.sizes.some((size) => size.size.trim() !== "");

  const addToCart = () => {
  setClickedItem(item.id);

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const newItem = {
    id: item.id,  
    name: item.name,
    image: item.image,
    price: getPriceForSize(item, selectedSize),
    
    ...(hasValidSizes && { 
      selectedSize: selectedSize || "" 
    })
  };

  cartItems.push(newItem);
  localStorage.setItem("cart", JSON.stringify(cartItems));

  toast.success(
    `Added ${item.name}${
      hasValidSizes ? (selectedSize ? ` (Size: ${selectedSize})` : "") : ""
    } to cart!`
  );

  window.dispatchEvent(new Event("storage"));
  setTimeout(() => setClickedItem(null), 1500);
};

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50 shadow-2xl rounded-xl overflow-hidden p-4 md:p-6 hover:shadow-3xl transition-shadow duration-300">
      {/* Image Section */}
      {item.image && (
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <img
            src={item.image}
            alt={item.name}
            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={onImageClick}
          />
        </div>
      )}

      {/* Content Section */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          {item.name}
        </h3>

        {/* Size Selector */}
        {hasValidSizes && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes
            </label>
            <select
              className="w-full bg-white border-2 border-blue-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-600 transition-colors duration-300"
              onChange={(e) => onSizeChange(e.target.value)}
              value={selectedSize}
            >
              {item.sizes.map(
                (size) =>
                  size.size.trim() !== "" && (
                    <option key={size.size} value={size.size}>
                      {size.size}
                    </option>
                  )
              )}
            </select>
          </div>
        )}

        {/* Price */}
        <p className="text-lg md:text-xl font-bold text-gray-800 mt-4">
          Price:{" "}
          <span className="text-blue-600">
            {getPriceForSize(item, selectedSize)} Rs/-
          </span>
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          {!location.pathname.includes('/admin/product-list') &&
            <button
                onClick={addToCart}
                className="bg-blue-500 text-white py-6 rounded-lg mt-4 flex items-center justify-center relative overflow-hidden w-full text-lg font-medium"
            >
                
                {clickedItem !== item.id && (
                <span className="absolute">Add to Cart</span>
                )}

            
                <motion.div
                className="absolute left-0 flex items-center"
                initial={{ x: "-100%" }} // Start from the left
                animate={{ x: clickedItem === item.id ? "100%" : "-100%" }} // Move to the right if clicked
                transition={{ duration: 1.5, ease: "easeInOut" }} // Smooth animation
                >
                <div className="relative">
                    <FiShoppingCart className="w-8 h-8 text-white mx-32" />
                    <AiOutlineCheckCircle className="absolute top-0 left-2 w-4 h-4 text-green-400 mx-32" />
                </div>
                </motion.div>
            </button>
          }

          {/* Edit and Delete Buttons */}
          { location.pathname.includes('/admin/product-list') &&
            <div className="flex gap-2 md:gap-4">
                <button
                onClick={onEdit}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold hover:bg-green-600"
                >
                <AiOutlineEdit className="text-lg" />
                EDIT
                </button>
                <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold hover:bg-red-600"
                >
                <AiOutlineDelete className="text-lg" />
                DELETE
                </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ItemCard;