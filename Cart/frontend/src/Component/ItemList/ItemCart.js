import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";

const ItemCard = ({
  item,
  selectedSize,
  onSizeChange,
  onEdit,
  onDelete,
  onImageClick,
  getPriceForSize,
}) => {
  // Check if there are any valid sizes (not empty strings)
  const hasValidSizes =
    item.sizes && item.sizes.some((size) => size.size !== "");

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
        {/* Product Name */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          {item.name}
        </h3>

        {/* Size Selector (only if valid sizes exist) */}
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
                  size.size !== " " && (
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
          {/* Add to Cart Button */}
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-transform duration-300">
            <FiShoppingCart className="text-lg" />
            ADD TO CART
          </button>

          {/* Edit and Delete Buttons */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold hover:bg-yellow-600"
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
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
