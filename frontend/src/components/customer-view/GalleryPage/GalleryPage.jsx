import React, { useState, useEffect, useCallback, useRef } from "react";
import "./GalleryPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faVolumeMute, faVolumeUp, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilesDeleteConfirmation from "@/components/customer-view/GalleryPage/FilesDeleteConfirmation";
import { useLocation } from "react-router-dom";
import MuteUnmuteButton from "./MuteUnmuteButton";

const STORAGE_KEY = "galleryPageState";

const GalleryPage = () => {
  const getInitialState = () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return {
          view: parsed.view || "images",
          activeVideoIndex: parsed.activeVideoIndex || 0,
          activeImageIndex: parsed.activeImageIndex || 0,
          isMuted: typeof parsed.isMuted === 'boolean' ? parsed.isMuted : true
        };
      }
    } catch (e) {
      console.error("Error parsing saved state:", e);
    }
    return {
      view: "images",
      activeVideoIndex: 0,
      activeImageIndex: 0,
      isMuted: true
    };
  };

  const [state, setState] = useState(getInitialState);
  const { view, activeVideoIndex, activeImageIndex, isMuted } = state;
  
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [deletingItems, setDeletingItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState({});
  const videoRefs = useRef([]);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      view,
      activeVideoIndex,
      activeImageIndex,
      isMuted
    }));
  }, [view, activeVideoIndex, activeImageIndex, isMuted]);

  useEffect(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current && current.includes('activeVideoIndex: {')) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Error cleaning storage:", e);
    }
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();

      setImages(data.filter(file => file.fileType === "image"));
      setVideos(data.filter(file => file.fileType === "video"));
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files.");
    }
  };

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handleViewChange = (newView) => {
    if (isDeleting) return;
    updateState({ view: newView });
  };

  const handleNext = useCallback((type) => {
    if (isDeleting) return;

    if (type === "video") {
      if (videoRefs.current[activeVideoIndex]) {
        videoRefs.current[activeVideoIndex].pause();
      }
      const newIndex = (activeVideoIndex + 1) % videos.length;
      updateState({ activeVideoIndex: newIndex });
    } else if (type === "image") {
      const newIndex = (activeImageIndex + 1) % images.length;
      updateState({ activeImageIndex: newIndex });
    }

    const slide = document.querySelector(`.${type}-slide`);
    const items = document.querySelectorAll(`.${type}-item`);
    if (slide && items.length > 0) {
      slide.appendChild(items[0]);
    }
  }, [isDeleting, activeVideoIndex, videos.length, activeImageIndex, images.length]);

  const handlePrev = useCallback((type) => {
    if (isDeleting) return;

    if (type === "video") {
      if (videoRefs.current[activeVideoIndex]) {
        videoRefs.current[activeVideoIndex].pause();
      }
      const newIndex = (activeVideoIndex - 1 + videos.length) % videos.length;
      updateState({ activeVideoIndex: newIndex });
    } else if (type === "image") {
      const newIndex = (activeImageIndex - 1 + images.length) % images.length;
      updateState({ activeImageIndex: newIndex });
    }

    const slide = document.querySelector(`.${type}-slide`);
    const items = document.querySelectorAll(`.${type}-item`);
    if (slide && items.length > 0) {
      slide.prepend(items[items.length - 1]);
    }
  }, [isDeleting, activeVideoIndex, videos.length, activeImageIndex, images.length]);

  const toggleSound = () => {
    const newMuted = !isMuted;
    if (videoRefs.current[activeVideoIndex]) {
      videoRefs.current[activeVideoIndex].muted = newMuted;
    }
    updateState({ isMuted: newMuted });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (view === "images" && images.length > 1) {
      const interval = setInterval(() => {
        handleNext("image");
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [view, images, handleNext]);

  useEffect(() => {
    if (view !== "videos") return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeVideoIndex) {
        video.style.display = "block";
        video.muted = isMuted;
        setLoadingVideos(prev => ({ ...prev, [videos[index]?._id]: true }));
        video.play()
          .then(() => setLoadingVideos(prev => ({ ...prev, [videos[index]?._id]: false })))
          .catch(e => {
            console.log("Autoplay prevented:", e);
            setLoadingVideos(prev => ({ ...prev, [videos[index]?._id]: false }));
          });
      } else {
        video.style.display = "none";
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeVideoIndex, isMuted, view, videos]);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos]);

  useEffect(() => {
    return () => {
      videoRefs.current.forEach(video => {
        if (video) video.pause();
      });
    };
  }, []);

 //console.log(activeImageIndex);
  
  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{
          zIndex: 9999,
          marginTop: '70px',
          backgroundColor: 'white !important',
        }}
      />

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
          onClick={() => handleViewChange("images")}
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
          onClick={() => handleViewChange("videos")}
          disabled={isDeleting}
        >
          Videos
        </button>
      </div>

      {view === "images" && (
        <div className="image-slide slide">
          {images.map((file, index) => (
            <div
              key={file._id}
              className={`image-item item ${index === activeImageIndex ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                backgroundImage: `url(${file.fileUrl})`,
                
              }}
            >
              <div className="content">
                <button className="italic font-sans font-light text-lg hover:text-blue-600 transition-colors duration-200 cursor-default">
                  ProShots creations
                </button>
                {location.pathname.includes('/admin/gallery') &&
                  <FilesDeleteConfirmation
                    fileId={file._id}
                    fileType="image"
                    setDeletingItems={setDeletingItems}
                    setImages={setImages}
                    setVideos={setVideos}
                    setIsDeleting={setIsDeleting}
                    isDeleting={isDeleting}
                    images={images}
                    videos={videos}
                  />
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "videos" && (
        <div className="video-slide slide">
          {videos.map((file, index) => (
            <div
              key={file._id}
              className={`video-item item ${index === activeVideoIndex ? "active" : ""} ${
                deletingItems.includes(file._id) ? "rocket-animation" : ""
              }`}
              style={{
                opacity: index === activeVideoIndex ? 1 : 0,
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
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
              >
                <source src={file.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="content" style={{ zIndex: 2 }}>
                <button className="italic font-sans font-light text-lg hover:text-blue-600 transition-colors duration-200 cursor-default text-white">
                  ProShots creations
                </button>
                {location.pathname.includes('/admin/gallery') &&
                  <FilesDeleteConfirmation
                    fileId={file._id}
                    fileType="video"
                    setDeletingItems={setDeletingItems}
                    setImages={setImages}
                    setVideos={setVideos}
                    setIsDeleting={setIsDeleting}
                    isDeleting={isDeleting}
                    images={images}
                    videos={videos}
                  />
                }
              </div>
            </div>
          ))}
        </div>
      )}

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

      {view === "videos" && (
        <MuteUnmuteButton isMuted={isMuted} toggleSound={toggleSound} />
      )}
    </div>
  );
};

export default GalleryPage;