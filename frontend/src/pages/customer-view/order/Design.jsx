import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload, FiX, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import CirclerFill from "./CirclerFill";

const Design = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [mergedImage, setMergedImage] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/client/dashboard");
  };

  // Auto-merge when images change
  useEffect(() => {
    if (selectedImages.length > 0) {
      mergeImages();
    } else {
      setMergedImage(null);
    }
  }, [selectedImages]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/bmp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, PNG, SVG, BMP files are allowed");
        return false;
      }
      if (file.size > maxSize) {
        setFileError("File size should be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.error("❌ Invalid file(s) selected. Please check format and size.");
      return;
    }

    setFileError("");
    const newImages = validFiles.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // Merge images into grid
  const mergeImages = async () => {
    setIsMerging(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const total = selectedImages.length;
      const cols = Math.ceil(Math.sqrt(total));
      const rows = Math.ceil(total / cols);

      const imgSize = 300;
      const spacing = 10;

      canvas.width = cols * imgSize + (cols - 1) * spacing;
      canvas.height = rows * imgSize + (rows - 1) * spacing;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const images = await Promise.all(
        selectedImages.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = src;
            })
        )
      );

      for (let i = 0; i < images.length; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = col * (imgSize + spacing);
        const y = row * (imgSize + spacing);
        ctx.drawImage(images[i], x, y, imgSize, imgSize);
      }

      setMergedImage(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Merge error:", error);
    } finally {
      setIsMerging(false);
    }
  };

  // Remove individual image
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async () => {
    if (!mergedImage) {
      toast.warning("📌 Please upload images first.");
      return;
    }
    if (!description.trim()) {
      toast.warning("✏️ Please add a description for your design.");
      return;
    }

    try {
      setUploading(true);
      // Convert data URL to blob
      const blob = await fetch(mergedImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "design.png");

      const response = await fetch("http://localhost:5000/upload-design", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error("Upload failed");
      }

      localStorage.setItem(
        "design",
        JSON.stringify({ image: data.imageUrl, description })
      );
      toast.success("🎨 Design saved successfully!");
      navigate("/client/terms");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("⚠️ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header with close button */}
      <div className="flex justify-end mb-4">
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Progress stepper */}
      <CirclerFill />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Upload Your Design
            </h1>
            <p className="text-indigo-100 mt-1">Share your vision with us</p>
          </div>

          {/* Main content */}
          <div className="p-6">
            {/* File upload area */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Design Images
              </label>
              <label className="cursor-pointer">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    selectedImages.length > 0
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload
                      className={`w-8 h-8 mb-2 ${
                        selectedImages.length > 0
                          ? "text-indigo-500"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        selectedImages.length > 0
                          ? "text-indigo-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {selectedImages.length > 0
                        ? "Add more images"
                        : "Click to upload"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                  />
                </div>
              </label>
              {fileError && (
                <p className="mt-2 text-sm text-red-500">{fileError}</p>
              )}
            </div>

            {/* Images preview */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Design preview ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Design Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Describe your design (colors, placement, special requests)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Upload button */}
            <motion.button
              onClick={uploadToCloudinary}
              className={`w-full py-3 px-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={uploading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <span>Upload & Continue</span>
              )}
            </motion.button>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Design;
