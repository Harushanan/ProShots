import React, { useState, useEffect, useCallback, useRef } from "react";
import "./GalleryPage.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilesDeleteConfirmation from "@/components/customer-view/GalleryPage/FilesDeleteConfirmation";
import { useLocation } from "react-router-dom";
import MuteUnmuteButton from "./MuteUnmuteButton";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [view, setView] = useState("images");
  const [error, setError] = useState(null);
  const [deletingItems, setDeletingItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loadingVideos, setLoadingVideos] = useState({});
  const videoRefs = useRef([]);
  const location = useLocation();

  // Fetch files from the server
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();

      const imageFiles = data.filter((file) => file.fileType === "image");
      const videoFiles = data.filter((file) => file.fileType === "video");

      setImages(imageFiles);
      setVideos(videoFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files.");
    }
  };

  // Handle next slide
  const handleNext = useCallback(
    (type) => {
      if (isDeleting) return;

      if (type === "video") {
        if (videoRefs.current[activeVideoIndex]) {
          videoRefs.current[activeVideoIndex].pause();
        }
        setActiveVideoIndex((prev) => (prev + 1) % videos.length);
      }

      const slide = document.querySelector(`.${type}-slide`);
      const items = document.querySelectorAll(`.${type}-item`);
      if (slide && items.length > 0) {
        slide.appendChild(items[0]);
      }
    },
    [isDeleting, videos.length, activeVideoIndex]
  );

  // Handle previous slide
  const handlePrev = useCallback(
    (type) => {
      if (isDeleting) return;

      if (type === "video") {
        if (videoRefs.current[activeVideoIndex]) {
          videoRefs.current[activeVideoIndex].pause();
        }
        setActiveVideoIndex(
          (prev) => (prev - 1 + videos.length) % videos.length
        );
      }

      const slide = document.querySelector(`.${type}-slide`);
      const items = document.querySelectorAll(`.${type}-item`);
      if (slide && items.length > 0) {
        slide.prepend(items[items.length - 1]);
      }
    },
    [isDeleting, videos.length, activeVideoIndex]
  );

  // Automatically change images every 15 seconds
  useEffect(() => {
    if (view === "images" && images.length > 1) {
      const interval = setInterval(() => {
        handleNext("image");
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [view, images, handleNext]);

  // Toggle sound for the active video
  const toggleSound = () => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      if (videoRefs.current[activeVideoIndex]) {
        videoRefs.current[activeVideoIndex].muted = newMutedState;
      }
      return newMutedState;
    });
  };

  // Manage video playback when active video changes
  useEffect(() => {
    if (view !== "videos") return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeVideoIndex) {
        video.style.display = "block";
        video.muted = isMuted;
        setLoadingVideos((prev) => ({ ...prev, [videos[index]._id]: true }));
        video
          .play()
          .then(() =>
            setLoadingVideos((prev) => ({
              ...prev,
              [videos[index]._id]: false,
            }))
          )
          .catch((e) => {
            console.log("Autoplay prevented:", e);
            setLoadingVideos((prev) => ({
              ...prev,
              [videos[index]._id]: false,
            }));
          });
      } else {
        video.style.display = "none";
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeVideoIndex, isMuted, view, videos]);

  // Reset video refs when videos change
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos]);

  // Cleanup videos on unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
    };
  }, []);

  return (
    <div className="container">
      <ToastContainer />

      {/* Images/Videos view buttons */}
      {error && (
        <p className="flex items-center justify-center text-red-500 text-center mb-4 animate-pulse">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          {error}
        </p>
      )}
      <div className="view-buttons-container flex justify-center gap-4 mb-4">
        <button
          className={`px-4 md:px-6 py-2 rounded-lg transition-colors duration-300 ${
            view === "images"
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setView("images")}
          disabled={isDeleting}
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
          disabled={isDeleting}
        >
          Videos
        </button>
      </div>

      {/* Image Slider */}
      {view === "images" && (
        <div className="image-slide slide">
          {images.map((file, index) => (
            <div
              key={file._id}
              className={`image-item item ${index === 0 ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                backgroundImage: `url(${file.fileUrl})`,
              }}
            >
              <div className="content">
                <button className="
                  italic font-sans font-light text-lg 
                 hover:text-gray-900 
                  transition-colors duration-200
                  cursor-default
                  ">
                  ProShots creations
                </button>
                { location.pathname.includes('/admin/gallery') &&
                  <FilesDeleteConfirmation
                    fileId={file._id}
                    fileType="image"
                    setDeletingItems={setDeletingItems}
                    setImages={setImages}
                    setVideos={setVideos}
                    setIsDeleting={setIsDeleting}
                    isDeleting={isDeleting}
                  />
              }
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrow buttons for Image Slider */}
      {view === "images" && (
        <div className="buttons flex justify-between mt-4">
          <button
            className="prev p-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePrev("image")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="next p-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleNext("image")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}

      {/* Video Slider */}
      {view === "videos" && (
        <div className="video-slide slide ">
          {videos.map((file, index) => (
            <div
              key={file._id}
              className={`video-item item ${index === activeVideoIndex ? "active" : ""} ${
              deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                opacity: index === activeVideoIndex ? 1 : 0.5,
                zIndex: index === activeVideoIndex ? 2 : 1,
                
              }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="video-player"
                autoPlay={index === activeVideoIndex}
                loop
                muted={isMuted}
                playsInline
                onWaiting={() =>
                  setLoadingVideos((prev) => ({ ...prev, [file._id]: true }))
                }
                onPlaying={() =>
                  setLoadingVideos((prev) => ({ ...prev, [file._id]: false }))
                }
                onCanPlay={() =>
                  setLoadingVideos((prev) => ({ ...prev, [file._id]: false }))
                }
              >
                <source src={file.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
                {loadingVideos[file._id] && (
                  <div className="video-loading-indicator">Loading...</div>
                )}
              </video>

              <div className="content">
                <button className="
                  italic font-sans font-light text-lg 
                 hover:text-gray-900 
                  transition-colors duration-200
                  cursor-default
                  ">
                  ProShots creations
                </button>
                { location.pathname.includes('/admin/gallery') &&
                <FilesDeleteConfirmation
                  fileId={file._id}
                  fileType="video"
                  setDeletingItems={setDeletingItems}
                  setImages={setImages}
                  setVideos={setVideos}
                  setIsDeleting={setIsDeleting}
                  isDeleting={isDeleting}
                />
                }

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrow buttons for Video Slider */}
      {view === "videos" && (
        <div className="buttons flex justify-between mt-4">
          <button
            className="prev p-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePrev("video")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="next p-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleNext("video")}
            disabled={isDeleting}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}

      {/* Sound Toggle Button */}
      {view === "videos" && (
        <MuteUnmuteButton isMuted={isMuted} toggleSound={toggleSound} />
      )}
    </div>
  );
};

export default GalleryPage;
