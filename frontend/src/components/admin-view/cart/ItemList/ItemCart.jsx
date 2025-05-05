import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ItemCard = ({
  item,
  selectedSize,
  onSizeChange,
  onEdit,
  onDelete,
  onImageClick,
  getPriceForSize,
  darkMode,
}) => {
  const [clickedItem, setClickedItem] = useState(null);
  const [showAR, setShowAR] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasValidSizes =
    item.sizes && item.sizes.some((size) => size.size.trim() !== "");

  const addToCart = () => {
    setClickedItem(item._id);
    setShowConfetti(true);

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cartItems.findIndex((cartItem) => {
      if (cartItem._id !== item._id) return false;
      if (hasValidSizes) {
        const cartItemSize = cartItem.selectedSize || cartItem.size;
        return cartItemSize === selectedSize;
      }
      return true;
    });

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
      cartItems[existingItemIndex].itemTotal =
        cartItems[existingItemIndex].quantity *
        cartItems[existingItemIndex].price;

      toast.info(
        `${cartItems[existingItemIndex].name}${
          hasValidSizes ? (selectedSize ? ` (Size: ${selectedSize})` : "") : ""
        } already exists in cart. Increased quantity to ${
          cartItems[existingItemIndex].quantity
        }`,
        {
          className: darkMode
            ? "bg-gray-800 text-blue-300"
            : "bg-blue-50 text-blue-700",
          progressClassName: "bg-blue-400",
        }
      );
    } else {
      const newItem = {
        _id: item._id,
        id: item._id,
        name: item.name,
        image: item.image,
        price: getPriceForSize(item, selectedSize),
        quantity: 1,
        itemTotal: getPriceForSize(item, selectedSize),
        ...(hasValidSizes && { selectedSize: selectedSize }),
      };
      cartItems.push(newItem);
      toast.success(
        `Added ${item.name}${
          hasValidSizes ? (selectedSize ? ` (Size: ${selectedSize})` : "") : ""
        } to cart!`,
        {
          className: darkMode
            ? "bg-gray-800 text-green-300"
            : "bg-green-50 text-green-700",
          progressClassName: "bg-green-400",
        }
      );
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      setClickedItem(null);
      setShowConfetti(false);
    }, 3000);
  };

  return (
    <>
      {/* {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )} */}

      <Tilt
        tiltEnable={!location.pathname.includes("/admin/product-list")}
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ffffff"
        glarePosition="all"
        scale={1.02}
        transitionSpeed={2000}
        className="rounded-xl"
      >
        <div
          className={`flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden p-4 md:p-6 hover:shadow-3xl transition-shadow duration-300 ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-700"
              : "bg-gradient-to-r from-blue-50 to-purple-50"
          }`}
        >
          {/* Image Section */}
          {item.image && (
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <motion.img
                src={item.image}
                alt={item.name}
                className={`w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg cursor-pointer ${
                  darkMode ? "border-2 border-gray-600" : ""
                }`}
                onClick={() => onImageClick(item)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6">
            <h3
              className={`text-xl md:text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {item.name}
            </h3>

            {/* Size Selector */}
            {hasValidSizes && (
              <div className="mt-3">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Sizes
                </label>
                <select
                  className={`w-full border-2 rounded-lg px-4 py-2 text-sm focus:outline-none transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-400 focus:border-blue-600"
                  }`}
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
            <p
              className={`text-lg md:text-xl font-bold mt-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Price:{" "}
              <span className={darkMode ? "text-blue-300" : "text-blue-600"}>
                {getPriceForSize(item, selectedSize)} Rs/-
              </span>
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              {!location.pathname.includes("/admin/product-list") && (
                <button
                  onClick={addToCart}
                  className={`text-white py-6 rounded-lg mt-4 flex items-center justify-center relative overflow-hidden w-full text-lg font-medium ${
                    darkMode
                      ? "bg-blue-700 hover:bg-blue-800"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {clickedItem !== item._id && (
                    <span className="absolute">Add to Cart</span>
                  )}

                  <motion.div
                    className="absolute left-0 flex items-center"
                    initial={{ x: "-100%" }}
                    animate={{ x: clickedItem === item._id ? "100%" : "-100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    <div className="relative">
                      <FiShoppingCart className="w-8 h-8 text-white mx-32" />
                      <AiOutlineCheckCircle className="absolute top-0 left-2 w-4 h-4 text-green-400 mx-32" />
                    </div>
                  </motion.div>
                </button>
              )}

              {/* Edit and Delete Buttons */}
              {location.pathname.includes("/admin/product-list") && (
                <div className="flex gap-2 md:gap-4">
                  <motion.button
                    onClick={onEdit}
                    className={`flex items-center justify-center gap-2 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold ${
                      darkMode
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <AiOutlineEdit className="text-lg" />
                    EDIT
                  </motion.button>
                  <motion.button
                    onClick={onDelete}
                    className={`flex items-center justify-center gap-2 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm font-semibold ${
                      darkMode
                        ? "bg-red-700 hover:bg-red-800"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <AiOutlineDelete className="text-lg" />
                    DELETE
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tilt>

      {/* AR Modal */}
    </>
  );
};

export default ItemCard;
