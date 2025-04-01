import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Design = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState(""); //  New State
  const navigate = useNavigate();

  
   const handleChange = () => {
       navigate('/client/cart')
   }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileError("Only JPG, JPEG, PNG, SVG, BMP files are allowed");
      return;
    } 

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/bmp"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, JPEG, PNG, SVG, BMP files are allowed");
      toast.error("❌ Only JPG, JPEG, PNG, SVG, BMP files are allowed");
      return;
    }

    setFileError(""); //  Clear error if valid
    setImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const response = await fetch("http://localhost:5000/upload-design", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploading(false);
      return data.imageUrl;
    } catch (error) {
      setUploading(false);
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleNext = async () => {
    if (!imageFile || !description) {
      toast.warning("📌 Please upload an image and enter a description.");
      return;
    }

    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
      toast.error("⚠️ Image upload failed. Please try again.");
      return;
    }

    localStorage.setItem("design", JSON.stringify({ image: imageUrl, description }));
    toast.success(" Design uploaded successfully!");
    navigate("/client/terms");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-6">
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-2xl w-full text-center transition-all duration-300 hover:shadow-md">
            <button onClick={handleChange} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button> 
            <ToastContainer />
            
            <h1 className="text-4xl font-extrabold text-cyan-800 tracking-wide drop-shadow-md">Upload Your Design</h1>
            <p className="text-lg text-gray-700 mt-2 leading-relaxed">Upload an image and add a description for your order.</p>

            <div className="mt-6">
            <label className="cursor-pointer border-dashed border-2 border-gray-400 hover:border-cyan-500 rounded-lg p-6 block w-full transition duration-200">
                <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                />
                <span className="text-gray-600">📂 Click to upload an image</span>
            </label>
            {fileError && <p className="text-sm text-red-500 mt-2">{fileError}</p>}
            </div>

            {/* Image Preview */}
            {image && (
            <img
                src={image}
                alt="Preview"
                className="mt-6 mx-auto w-48 h-48 object-cover border-2 border-gray-300 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105"
            />
            )}

            {/* Description Input */}
            <textarea
            className="border border-gray-300 rounded-xl p-3 w-full mt-4 shadow-sm focus:ring-2 focus:ring-cyan-500 transition"
            placeholder="Enter a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {/* Next Button */}
            <button
            className={`mt-6 px-8 py-3 text-lg font-semibold rounded-full shadow-md transform transition duration-300 ${
                uploading
                ? "bg-gray-400 cursor-not-allowed text-gray-100"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            }`}
            onClick={handleNext}
            disabled={uploading}
            >
            {uploading ? "Uploading..." : "Next"}
            </button>
        </div>
        </div>

  );
};

export default Design;
