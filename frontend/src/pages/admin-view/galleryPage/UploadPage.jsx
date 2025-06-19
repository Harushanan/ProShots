import React, { useState, useCallback } from "react";
import { FaImage, FaVideo, FaCloudUploadAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateVideoSize, validateImageSize } from "./UploadValidations";

const UploadPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [dragActiveImage, setDragActiveImage] = useState(false);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);

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

  const handleDrag = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "image") {
      setDragActiveImage(e.type === "dragenter" || e.type === "dragover");
    } else {
      setDragActiveVideo(e.type === "dragenter" || e.type === "dragover");
    }
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "image") {
      setDragActiveImage(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        if (e.dataTransfer.files[0].type.startsWith("image/")) {
          setImageFile(e.dataTransfer.files[0]);
        }
      }
    } else {
      setDragActiveVideo(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        if (e.dataTransfer.files[0].type.startsWith("video/")) {
          setVideoFile(e.dataTransfer.files[0]);
        }
      }
    }
  }, []);

  const createImagePreview = (file) => {
    return file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
  };

  const createVideoPreview = (file) => {
    return file && file.type.startsWith("video/") ? URL.createObjectURL(file) : null;
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <h1 className="text-5xl font-bold text-white mb-12 mt-10 text-center underline">
        Upload Your Files
      </h1>

      <div className="flex space-x-10 mb-6">
        
        <div 
          className={`flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-96 hover:scale-105 transition-transform duration-300 ${
            dragActiveImage ? "ring-4 ring-indigo-500" : ""
          }`}
          onDragEnter={(e) => handleDrag(e, "image")}
          onDragLeave={(e) => handleDrag(e, "image")}
          onDragOver={(e) => handleDrag(e, "image")}
          onDrop={(e) => handleDrop(e, "image")}
        >
          <label className="text-xl text-gray-800 flex items-center gap-3 font-semibold mb-4">
            <FaImage className="text-4xl text-indigo-600 hover:text-indigo-800 transition-colors duration-300" />
            <span>Upload Image</span>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            disabled={imageLoading}
            onChange={(e) => setImageFile(e.target.files[0])}
            className={`file:border-none file:rounded-lg file:px-6 file:py-4 file:text-lg file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 file:transition-all file:duration-300 file:cursor-pointer w-full mb-4 ${
              imageLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          />
          <div 
            className={`w-full h-40 flex items-center justify-center border-2 border-dashed ${
              dragActiveImage ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
            } rounded-md mb-4 relative`}
          >
            {imageFile ? (
              <img
                src={createImagePreview(imageFile)}
                alt={imageFile.name}
                className="max-w-full max-h-40 rounded-md shadow-md"
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-400 mb-2">Drag & drop an image here</p>
                <p className="text-gray-400 text-sm">or click to browse</p>
              </div>
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

        
        <div 
          className={`flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-96 hover:scale-105 transition-transform duration-300 ${
            dragActiveVideo ? "ring-4 ring-green-500" : ""
          }`}
          onDragEnter={(e) => handleDrag(e, "video")}
          onDragLeave={(e) => handleDrag(e, "video")}
          onDragOver={(e) => handleDrag(e, "video")}
          onDrop={(e) => handleDrop(e, "video")}
        >
          <label className="text-xl text-gray-800 flex items-center gap-3 font-semibold mb-4">
            <FaVideo className="text-4xl text-green-500 hover:text-green-700 transition-colors duration-300" />
            <span>Upload Video</span>
          </label>
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            disabled={videoLoading}
            onChange={(e) => setVideoFile(e.target.files[0])}
            className={`file:border-none file:rounded-lg file:px-6 file:py-4 file:text-lg file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 file:transition-all file:duration-300 file:cursor-pointer w-full mb-4 ${
              videoLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          />
          <div 
            className={`w-full h-40 flex items-center justify-center border-2 border-dashed ${
              dragActiveVideo ? "border-green-500 bg-green-50" : "border-gray-300"
            } rounded-md mb-4 relative`}
          >
            {videoFile ? (
              <video
                controls
                className="max-w-full max-h-40 rounded-md shadow-md"
                src={createVideoPreview(videoFile)}
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-400 mb-2">Drag & drop a video here</p>
                <p className="text-gray-400 text-sm">or click to browse</p>
              </div>
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
        autoClose={3000}
        style={{
          zIndex: 9999,
          marginTop: '70px',
          backgroundColor: 'white !important',
        }}
      />
    </div>
  );
};

export default UploadPage;