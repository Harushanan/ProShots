import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/admin-view/cart/common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateProductName,
  validateProductImage,
  validateProductPrice,
} from "./Validations/ListFormValidations";
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
    if (isSubmitting) return;
    
    setNewProduct({
      name: "",
      sizes: [{ size: "", price: "" }],
      image: null,
    });
    setImagePreview(null);
    fileInputRef.current.value = "";
    navigate("/admin/create-product");
  };

  const validateForm = () => {
    const nameError = validateProductName(newProduct.name);
    if (nameError) {
      toast.error(nameError);
      return false;
    }

    const imageError = validateProductImage(newProduct.image);
    if (imageError) {
      toast.error(imageError);
      return false;
    }

    const sizes = newProduct.sizes;

    if (sizes.length > 0) {
      const initialSize = sizes[0];
      const priceError = validateProductPrice(initialSize.price);
      if (priceError) {
        toast.error(priceError);
        return false;
      }
    }

    for (let i = 1; i < sizes.length; i++) {
      const size = sizes[i];
      if (!size.size || (!size.price && size.price !== 0)) {
        toast.error("Both size and price are required for additional sizes.");
        return false;
      }
      const priceError = validateProductPrice(size.price);
      if (priceError) {
        toast.error(priceError);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          `http://localhost:5000/cart/${newProduct._id}`,
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
          "http://localhost:5000/cart/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product added successfully!");
      }

      setNewProduct({
        name: "",
        sizes: [{ size: "", price: "" }],
        image: null,
      });
      setImagePreview(null);
      fileInputRef.current.value = "";

      navigate("/admin/create-product");
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <Navbar />
      <div className="flex flex-col items-center p-6">
        <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">
          {location.state?.item ? "Update Product" : "Add New Product"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border border-gray-200"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      name="size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(e, index)}
                      placeholder="Size (e.g., small)"
                      className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="price"
                      value={size.price}
                      onChange={(e) => handleSizeChange(e, index)}
                      placeholder="Price"
                      className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                className={`p-3 text-white rounded-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <FaUpload /> Upload Image
              </label>
              <input
                id="imageInput"
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept="image/"
                ref={fileInputRef}
                disabled={isSubmitting}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleCancelImage}
                  className={`p-3 text-white rounded-lg transition duration-300 ${
                    isSubmitting ? "bg-red-400" : "bg-red-500 hover:bg-red-600"
                  }`}
                  disabled={isSubmitting}
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
              className={`w-full p-3 text-white rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-green-600 cursor-wait"
                  : "bg-green-500 hover:bg-green-600"
              }`}
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
                disabled={isSubmitting}
                className={`w-full p-3 text-white rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
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
      />
    </div>
  );
};

export default ListForm;