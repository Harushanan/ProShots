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
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cart");
        setItems(response.data);
        setFilteredItems(response.data); // Initialize filteredItems with all items
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
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

  // Progressive search as user types
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => 
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
      await axios.delete(`http://localhost:5000/cart/${itemToDelete}`);
      const updatedItems = items.filter((item) => item._id !== itemToDelete);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Error deleting item. Please try again!");
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

  const hasNoResults = searchQuery && filteredItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-200">
      {location.pathname.includes("/client/products") && (
        <div className="h-[250px] md:h-[450px] bg-[url('@/assets/products.jpg')] bg-cover bg-center"></div>
      )}
      {!location.pathname.includes("/client/products") && <Navbar />}

      {!location.pathname.includes("/admin/product-list") && (
        <div className="bg-blue-500 fixed left-1 top-4 md:top-6 z-50 p-2 md:p-3 lg:p-4 rounded-full">
          <Link to="/client/cart" className="relative text-white hover:text-gray-200">
            <FiShoppingCart className="text-lg md:text-xl lg:text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs px-1 md:px-2 py-[1px] md:py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3">
        <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">
          Product List
        </h1>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="grid md:grid-cols-2 gap-20 mb-20 mt-10">
          {hasNoResults ? (
            <div className="col-span-2 text-center py-16 md:py-24 lg:py-32">
           <motion.div
           initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-block p-8 bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100"
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
               <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                 No Products Found
                 </h3>
                 <motion.p
                  initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-6"
                   >
                    We couldn't find any products matching "{searchQuery}"
                  </motion.p>
                  </div>
          <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSearchQuery("")}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
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
                selectedSize={selectedSizes[item._id] || "small"}
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

      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}

      <DeleteConfirmation
        showConfirmation={showConfirmation}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

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