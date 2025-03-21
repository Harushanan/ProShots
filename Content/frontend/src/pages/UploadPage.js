import React, { useState } from "react";
import { FaImage, FaVideo, FaCloudUploadAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateImageSize,
  validateVideoSize,
} from "../Validations/UploadPageValidations";

const UploadPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const handleFileUpload = async (e, file, type) => {
    e.preventDefault();
    if (!file) return;

    if (type === "image" && !validateImageSize(file)) return;
    if (type === "video" && !validateVideoSize(file)) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    if (type === "image") setImageLoading(true);
    if (type === "video") setVideoLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`
      );

      if (type === "image") {
        setImageFile(null);
        document.getElementById("imageInput").value = "";
      } else if (type === "video") {
        setVideoFile(null);
        document.getElementById("videoInput").value = "";
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      if (type === "image") setImageLoading(false);
      if (type === "video") setVideoLoading(false);
    }
  };

  const createImagePreview = (file) => {
    return file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
  };

  const createVideoPreview = (file) => {
    return file && file.type.startsWith("video/") ? URL.createObjectURL(file) : null;
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-r from-green-400 to-blue-500 min-h-screen">
      <h1 className="text-5xl font-bold text-white mb-12 text-center">
        Upload Your Files
      </h1>

      <div className="flex space-x-10 mb-6">
        {/* Image Upload Section */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-96 hover:scale-105 transition-transform duration-300">
          <label className="text-xl text-gray-800 flex items-center gap-3 font-semibold mb-4">
            <FaImage className="text-4xl text-indigo-600 hover:text-indigo-800 transition-colors duration-300" />
            <span>Upload Image</span>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="file:border-none file:rounded-lg file:px-6 file:py-4 file:text-lg file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 file:transition-all file:duration-300 file:cursor-pointer w-full mb-4"
          />
          <div className="w-full h-40 flex items-center justify-center border border-gray-300 rounded-md mb-4">
            {imageFile ? (
              <img
                src={createImagePreview(imageFile)}
                alt={imageFile.name}
                className="max-w-full max-h-40 rounded-md shadow-md"
              />
            ) : (
              <p className="text-gray-400">No image selected</p>
            )}
          </div>
          <button
            type="submit"
            onClick={(e) => handleFileUpload(e, imageFile, "image")}
            disabled={imageLoading || !imageFile}
            className={`w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-300 transition duration-300 ${
              imageLoading || !imageFile ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <FaCloudUploadAlt
                className={imageLoading ? "animate-bounce" : ""}
              />
              {imageLoading ? "Uploading..." : "Upload Image"}
            </span>
          </button>
        </div>

        {/* Video Upload Section */}
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-96 hover:scale-105 transition-transform duration-300">
          <label className="text-xl text-gray-800 flex items-center gap-3 font-semibold mb-4">
            <FaVideo className="text-4xl text-green-500 hover:text-green-700 transition-colors duration-300" />
            <span>Upload Video</span>
          </label>
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="file:border-none file:rounded-lg file:px-6 file:py-4 file:text-lg file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 file:transition-all file:duration-300 file:cursor-pointer w-full mb-4"
          />
          <div className="w-full h-40 flex items-center justify-center border border-gray-300 rounded-md mb-4">
            {videoFile ? (
              <video
                controls
                className="max-w-full max-h-40 rounded-md shadow-md"
                src={createVideoPreview(videoFile)}
              />
            ) : (
              <p className="text-gray-400">No video selected</p>
            )}
          </div>
          <button
            type="submit"
            onClick={(e) => handleFileUpload(e, videoFile, "video")}
            disabled={videoLoading || !videoFile}
            className={`w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-red-300 transition duration-300 ${
              videoLoading || !videoFile ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <FaCloudUploadAlt
                className={videoLoading ? "animate-bounce" : ""}
              />
              {videoLoading ? "Uploading..." : "Upload Video"}
            </span>
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UploadPage;
