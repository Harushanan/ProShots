import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Component/common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateProductName,
  validateProductImage,
} from "../Validations/ListFormValidations";
import {
  FaPlus,
  FaTrash,
  FaUpload,
  FaSave,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const ListForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    sizes: [{ size: "", price: "" }],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (location.state?.item) {
      setNewProduct(location.state.item);
      setImagePreview(location.state.item.image);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSizeChange = (e, index) => {
    const { name, value } = e.target;
    const newSizes = [...newProduct.sizes];
    newSizes[index][name] = name === "price" ? parseFloat(value) || 0 : value;
    setNewProduct((prevState) => ({
      ...prevState,
      sizes: newSizes,
    }));
  };

  const handleAddSize = () => {
    setNewProduct((prevState) => ({
      ...prevState,
      sizes: [...prevState.sizes, { size: "", price: "" }],
    }));
  };

  const handleRemoveSize = (index) => {
    const newSizes = newProduct.sizes.filter((_, i) => i !== index);
    setNewProduct((prevState) => ({
      ...prevState,
      sizes: newSizes,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageError = validateProductImage(file);
    if (imageError) {
      toast.error(imageError);
      return;
    }

    setNewProduct((prevState) => ({
      ...prevState,
      image: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelImage = () => {
    setNewProduct((prevState) => ({
      ...prevState,
      image: null,
    }));
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  const handleCancelEdit = () => {
    setNewProduct({
      name: "",
      sizes: [{ size: "", price: "" }],
      image: null,
    });
    setImagePreview(null);
    fileInputRef.current.value = "";
    navigate("/");
  };

  const validateForm = () => {
    // Validate product name
    const nameError = validateProductName(newProduct.name);
    if (nameError) {
      toast.error(nameError);
      return false;
    }

    // Validate product image
    if (!newProduct.image) {
      toast.error("Product image is required.");
      return false;
    }

    // Validate sizes and prices
    const sizes = newProduct.sizes;

    // Check initial size (only price is required)
    if (sizes.length > 0) {
      const initialSize = sizes[0];
      if (!initialSize.price && initialSize.price !== 0) {
        toast.error("Initial price is required.");
        return false;
      }
    }

    // Check additional sizes (both size and price are required)
    for (let i = 1; i < sizes.length; i++) {
      const size = sizes[i];
      if (!size.size || (!size.price && size.price !== 0)) {
        toast.error("Both size and price are required for additional sizes.");
        return false;
      }
    }

    return true; // Validation passed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("sizes", JSON.stringify(newProduct.sizes));
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      let response;
      if (location.state?.item) {
        response = await axios.put(
          `http://localhost:5000/api/items/${newProduct._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:5000/api/items/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product added successfully!");
      }

      console.log("Product saved:", response.data);

      // Reset form after successful submission
      setNewProduct({
        name: "",
        sizes: [{ size: "", price: "" }],
        image: null,
      });
      setImagePreview(null);
      fileInputRef.current.value = "";

      navigate("/");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFormValues =
    (newProduct.name &&
      typeof newProduct.name === "string" &&
      newProduct.name.trim() !== "") ||
    newProduct.sizes.some(
      (size) =>
        (size.size &&
          typeof size.size === "string" &&
          size.size.trim() !== "") ||
        (size.price !== "" && !isNaN(size.price))
    ) ||
    newProduct.image !== null;

  const sizesLabelText =
    newProduct.sizes.length === 1 && !newProduct.sizes[0].size
      ? "Price"
      : "Sizes and Prices";

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-500">
      <Navbar />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {location.state?.item ? "Update Product" : "Add New Product"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-8 w-full max-w-lg border border-white/30"
        >
          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full p-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20"
            />
          </div>

          {/* Sizes and Prices */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {sizesLabelText}
            </label>
            {newProduct.sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-3 mb-3">
                {index === 0 && newProduct.sizes.length === 1 && !size.size ? (
                  <input
                    type="number"
                    name="price"
                    value={size.price}
                    onChange={(e) => handleSizeChange(e, index)}
                    placeholder="Price"
                    className="w-full p-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      name="size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(e, index)}
                      placeholder="Size (e.g., small)"
                      className="w-1/2 p-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20"
                    />
                    <input
                      type="number"
                      name="price"
                      value={size.price}
                      onChange={(e) => handleSizeChange(e, index)}
                      placeholder="Price"
                      className="w-1/2 p-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20"
                    />
                  </>
                )}
                {(newProduct.sizes.length > 1 ||
                  (newProduct.sizes.length === 1 &&
                    (size.size.trim() !== "" || size.price !== ""))) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSize}
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Size and Price
            </button>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="imageInput"
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaUpload /> Upload Image
              </label>
              <input
                id="imageInput"
                type="file"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleCancelImage}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Selected product preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaSave />{" "}
                  {location.state?.item ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
            {hasFormValues && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeButton
        pauseOnHover
        draggable
        limit={3}
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default ListForm;
