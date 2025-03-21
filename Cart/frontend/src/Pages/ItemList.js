import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "../Component/ItemList/SearchBar";
import ItemCard from "../Component/ItemList/ItemCart";
import ImageModal from "../Component/ItemList/ItemModel";
import DeleteConfirmation from "../Component/ItemList/DeleteConfirmation"; // Import the new component

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setItems(response.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

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
    navigate("/create-product", { state: { item } });
    toast.success("Item edited successfully!");
  };

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemToDelete}`);
      setItems(items.filter((item) => item._id !== itemToDelete));
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

  const filteredItems = items.filter((item) => {
    return item.name.toLowerCase().startsWith(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">
          Product List
        </h2>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Item List */}
        <div className="grid md:grid-cols-2 gap-20">
          {filteredItems.map((item) => (
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
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        showConfirmation={showConfirmation}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* ToastContainer */}
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
