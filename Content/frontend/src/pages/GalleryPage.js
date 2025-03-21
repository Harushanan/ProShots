import React, { useState, useEffect } from "react";
import "../CSS/GalleryPage.css"; // Import custom styles for the gallery layout
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilesDeleteConfirmation from "../Components/GalleryPage/FilesDeleteConfirmation";

const GalleryPage = () => {
  const [images, setImages] = useState([]); // State for images
  const [videos, setVideos] = useState([]); // State for videos
  const [view, setView] = useState("images"); // 'images' or 'videos'
  const [error, setError] = useState(null);
  const [deletingItems, setDeletingItems] = useState([]); // Track items being deleted
  const [isDeleting, setIsDeleting] = useState(false); // Track if deletion is in progress

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();

      // Separate images and videos
      const imageFiles = data.filter((file) => file.fileType === "image");
      const videoFiles = data.filter((file) => file.fileType === "video");

      setImages(imageFiles);
      setVideos(videoFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files.");
    }
  };

  // Slider functionality for images and videos
  const handleNext = (type) => {
    if (isDeleting) return; // Prevent sliding if deleting
    const slide = document.querySelector(`.${type}-slide`);
    const items = document.querySelectorAll(`.${type}-item`);
    slide.appendChild(items[0]);
  };

  const handlePrev = (type) => {
    if (isDeleting) return; // Prevent sliding if deleting
    const slide = document.querySelector(`.${type}-slide`);
    const items = document.querySelectorAll(`.${type}-item`);
    slide.prepend(items[items.length - 1]);
  };

  return (
    <div className="container">
      {/* Toast Container */}
      <ToastContainer />

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Button to Switch View */}
      <div className="view-buttons-container">
        <button
          className={`px-4 md:px-6 py-2 rounded-lg transition-colors duration-300 ${
            view === "images"
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("images")}
          disabled={isDeleting} // Disable while deleting
        >
          Images
        </button>
        <button
          className={`px-4 md:px-6 py-2 rounded-lg transition-colors duration-300 ${
            view === "videos"
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("videos")}
          disabled={isDeleting} // Disable while deleting
        >
          Videos
        </button>
      </div>

      {/* Image and Video Sliders */}
      {view === "images" && (
        <div className="image-slide slide">
          {images.map((file, index) => (
            <div
              key={file._id}
              className={`image-item item ${index === 0 ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                backgroundImage: `url(${file.fileUrl})`, // Use the Cloudinary URL on monodb
              }}
            >
              <div className="content">
                <button className="cursor-default">See More</button>
                <FilesDeleteConfirmation
                  fileId={file._id}
                  fileType="image"
                  setDeletingItems={setDeletingItems}
                  setImages={setImages}
                  setVideos={setVideos}
                  setIsDeleting={setIsDeleting}
                  isDeleting={isDeleting}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrow buttons for Image Slider */}
      {view === "images" && (
        <div className="buttons">
          <button
            className="prev"
            onClick={() => handlePrev("image")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="next"
            onClick={() => handleNext("image")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}

      {/* Video Slider */}
      {view === "videos" && (
        <div className="video-slide slide">
          {videos.map((file, index) => (
            <div
              key={file._id}
              className={`video-item item ${index === 0 ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                backgroundImage: `url(${file.fileUrl})`,
              }}
            >
              <video className="video-player" autoPlay loop muted playsInline>
                <source src={file.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Content for the video item */}
              <div className="content">
                <button className="cursor-default">See More</button>
                <FilesDeleteConfirmation
                  fileId={file._id}
                  fileType="video"
                  setDeletingItems={setDeletingItems}
                  setImages={setImages}
                  setVideos={setVideos}
                  setIsDeleting={setIsDeleting}
                  isDeleting={isDeleting}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrow buttons for Video Slider */}
      {view === "videos" && (
        <div className="buttons">
          <button
            className="prev"
            onClick={() => handlePrev("video")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="next"
            onClick={() => handleNext("video")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
