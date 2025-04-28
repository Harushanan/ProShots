import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmation from "@/components/admin-view/cart/ItemList/DeleteConfirmation";
import ImageModal from "@/components/admin-view/cart/ItemList/ItemModel";
import SearchBar from "@/components/admin-view/cart/ItemList/SearchBar";
import ItemCard from "@/components/admin-view/cart/ItemList/ItemCart";
import Navbar from "@/components/admin-view/cart/common/Navbar";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const newDarkMode = !savedDarkMode; // Flip it every time page loads
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode); // Save the new mode
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cart");
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(storedCart.length);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) =>
      item.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [itemId]: size,
    }));
  };

  const getPriceForSize = (item, size) => {
    const sizeDetail = item.sizes.find((s) => s.size === size);
    return sizeDetail ? sizeDetail.price : item.sizes[0]?.price;
  };

  const handleEdit = (itemId) => {
    const item = items.find((item) => item._id === itemId);
    navigate("/admin/create-product", { state: { item } });
    toast.success("Item edited successfully!");
  };

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const itemName =
        items.find((item) => item._id === itemToDelete)?.name || "the item";
      await axios.delete(`http://localhost:5000/cart/${itemToDelete}`);
      const updatedItems = items.filter((item) => item._id !== itemToDelete);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      toast.success(`"${itemName}" deleted successfully!`, {
        className: "bg-green-50 text-green-700",
        progressClassName: "bg-green-400",
      });
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(`Error deleting "${itemName}". Please try again!`, {
        className: "bg-red-50 text-red-700",
        progressClassName: "bg-red-400",
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const hasNoResults = searchQuery && filteredItems.length === 0;

  return (
    <div className={`min-h-screen relative overflow-hidden`}>
      {/* Animated Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-64 md:h-80 lg:h-96">
        <motion.svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          initial={{ x: 0 }}
          animate={{
            x: [-20, 0, -20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <motion.path
            d="M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,114.29,1200,47.53V120Z"
            opacity=".25"
            className="fill-blue-400"
            initial={{
              d: "M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,114.29,1200,47.53V120Z",
            }}
            animate={{
              d: [
                "M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,114.29,1200,47.53V120Z",
                "M0,120V83.71c37.79-12.2,93.59-22.17,148-18,80.36,5.37,126.33,23.31,196.8,27.5C438.64,97.57,512.34,76.33,583,57.95c79.27-18,128.3-14.88,199.4-3.08,26.15,6,79.85,27.84,114.45,39.34C989.49,105,1113,124.29,1200,57.53V120Z",
                "M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,114.29,1200,47.53V120Z",
              ],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          <motion.path
            d="M0,120V104.19C13,93.08,27.64,73.14,47.69,57.95,99.41,28.73,165,29,224.58,48.42c31.15,10.15,60.09,26.07,89.67,39.8,40.92,19,84.73,46,130.83,49.67,36.26,2.85,70.9-9.42,98.6-31.56,31.77-25.39,62.32-62,103.63-73,40.44-10.79,81.35,6.69,119.13,24.28s75.16,39,116.92,43.05c59.73,5.85,113.28-22.88,168.9-38.84,30.2-8.66,59-6.17,87.09,7.5,22.43,10.89,48,26.93,60.65,49.24V120Z"
            opacity=".5"
            className="fill-blue-500"
            initial={{
              d: "M0,120V104.19C13,93.08,27.64,73.14,47.69,57.95,99.41,28.73,165,29,224.58,48.42c31.15,10.15,60.09,26.07,89.67,39.8,40.92,19,84.73,46,130.83,49.67,36.26,2.85,70.9-9.42,98.6-31.56,31.77-25.39,62.32-62,103.63-73,40.44-10.79,81.35,6.69,119.13,24.28s75.16,39,116.92,43.05c59.73,5.85,113.28-22.88,168.9-38.84,30.2-8.66,59-6.17,87.09,7.5,22.43,10.89,48,26.93,60.65,49.24V120Z",
            }}
            animate={{
              d: [
                "M0,120V104.19C13,93.08,27.64,73.14,47.69,57.95,99.41,28.73,165,29,224.58,48.42c31.15,10.15,60.09,26.07,89.67,39.8,40.92,19,84.73,46,130.83,49.67,36.26,2.85,70.9-9.42,98.6-31.56,31.77-25.39,62.32-62,103.63-73,40.44-10.79,81.35,6.69,119.13,24.28s75.16,39,116.92,43.05c59.73,5.85,113.28-22.88,168.9-38.84,30.2-8.66,59-6.17,87.09,7.5,22.43,10.89,48,26.93,60.65,49.24V120Z",
                "M0,120V94.19C23,83.08,37.64,63.14,57.69,47.95,109.41,18.73,175,19,234.58,38.42c41.15,15.15,70.09,31.07,99.67,44.8,30.92,14,74.73,36,120.83,39.67,46.26,3.85,80.9-14.42,108.6-36.56,21.77-20.39,52.32-52,93.63-63,30.44-8.79,71.35,3.69,109.13,21.28s85.16,34,126.92,38.05c49.73,4.85,103.28-17.88,158.9-33.84,40.2-13.66,69-11.17,97.09,2.5,32.43,15.89,58,31.93,70.65,54.24V120Z",
                "M0,120V104.19C13,93.08,27.64,73.14,47.69,57.95,99.41,28.73,165,29,224.58,48.42c31.15,10.15,60.09,26.07,89.67,39.8,40.92,19,84.73,46,130.83,49.67,36.26,2.85,70.9-9.42,98.6-31.56,31.77-25.39,62.32-62,103.63-73,40.44-10.79,81.35,6.69,119.13,24.28s75.16,39,116.92,43.05c59.73,5.85,113.28-22.88,168.9-38.84,30.2-8.66,59-6.17,87.09,7.5,22.43,10.89,48,26.93,60.65,49.24V120Z",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          <motion.path
            d="M0,120V114.37C149.93,60,314.09,47.68,475.83,76.43c43,7.64,84.23,20.12,127.61,26.46,59,8.63,112.48-12.24,165.56-35.4C827.93,42.78,886,24.76,951.2,30c86.53,7,172.46,45.71,248.8,84.81V120Z"
            className="fill-blue-600"
            initial={{
              d: "M0,120V114.37C149.93,60,314.09,47.68,475.83,76.43c43,7.64,84.23,20.12,127.61,26.46,59,8.63,112.48-12.24,165.56-35.4C827.93,42.78,886,24.76,951.2,30c86.53,7,172.46,45.71,248.8,84.81V120Z",
            }}
            animate={{
              d: [
                "M0,120V114.37C149.93,60,314.09,47.68,475.83,76.43c43,7.64,84.23,20.12,127.61,26.46,59,8.63,112.48-12.24,165.56-35.4C827.93,42.78,886,24.76,951.2,30c86.53,7,172.46,45.71,248.8,84.81V120Z",
                "M0,120V104.37C139.93,70,304.09,57.68,465.83,86.43c33,2.64,74.23,15.12,117.61,21.46,69,13.63,122.48-7.24,175.56-30.4C817.93,52.78,876,34.76,941.2,40c76.53,5,162.46,35.71,238.8,74.81V120Z",
                "M0,120V114.37C149.93,60,314.09,47.68,475.83,76.43c43,7.64,84.23,20.12,127.61,26.46,59,8.63,112.48-12.24,165.56-35.4C827.93,42.78,886,24.76,951.2,30c86.53,7,172.46,45.71,248.8,84.81V120Z",
              ],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        {location.pathname.includes("/client/products") && (
          <div className="h-[250px] md:h-[450px] bg-[url('@/assets/products.jpg')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4"
              >
                Our Products
              </motion.h1>
            </div>
          </div>
        )}

        {/* Navbar */}
        {!location.pathname.includes("/client/products") && <Navbar />}

        {/* Cart Button */}
        <div className="fixed right-4 top-4 md:top-6 z-50 flex gap-4">
          {/* Cart Button - Only show in client view */}
          {!location.pathname.includes("/admin/product-list") && (
            <div
              className={`p-2 md:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                darkMode
                  ? "bg-gray-700"
                  : "bg-gradient-to-r from-blue-500 to-blue-600"
              }`}
            >
              <Link
                to="/client/cart"
                className="relative text-white hover:text-gray-200"
              >
                <FiShoppingCart className="text-lg md:text-xl lg:text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs px-1 md:px-2 py-[1px] md:py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Dark Mode Toggle Button - Show in both views */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 md:p-3 lg:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-blue-500 text-white"
            }`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-3">
          <h1
            className={`text-4xl mt-8 mb-8 text-center underline font-bold ${
              darkMode ? "text-gray" : "text-blue-900"
            }`}
          >
            Product List
          </h1>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            darkMode={darkMode}
          />

          {/* Item Cards Grid */}
          <div className="grid md:grid-cols-2 gap-20 mb-20 mt-10">
            {hasNoResults ? (
              <div className="col-span-2 text-center py-16 md:py-24 lg:py-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`inline-block p-8 rounded-xl shadow-2xl max-w-md w-full border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2,
                        }}
                        className="inline-block text-5xl mb-4"
                      >
                        🔍
                      </motion.div>
                      <h3
                        className={`text-2xl md:text-3xl font-bold mb-3 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        No Products Found
                      </h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={`mb-6 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        We couldn't find any products matching "{searchQuery}"
                      </motion.p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchQuery("")}
                      className={`px-6 py-3 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium ${
                        darkMode
                          ? "bg-blue-700 hover:bg-blue-800"
                          : "bg-gradient-to-r from-blue-500 to-blue-600"
                      }`}
                    >
                      Clear Search
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  darkMode={darkMode}
                  selectedSize={selectedSizes[item._id] || item.sizes[0]?.size}
                  onSizeChange={(size) => handleSizeChange(item._id, size)}
                  onEdit={() => handleEdit(item._id)}
                  onDelete={() => handleDelete(item._id)}
                  onImageClick={() => handleImageClick(item.image)}
                  getPriceForSize={getPriceForSize}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={handleCloseModal}
          darkMode={darkMode}
        />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmation
        showConfirmation={showConfirmation}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        darkMode={darkMode}
      />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeButton
        pauseOnHover
        draggable
        limit={3}
      />
    </div>
  );
};

export default ItemList;
