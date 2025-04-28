import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const FilesDeleteConfirmation = ({
  fileId,
  fileType,
  setDeletingItems,
  setImages,
  setVideos,
  setIsDeleting,
  isDeleting,
  images,
  videos,
}) => {
  const MIN_IMAGES = 5;
  const MIN_VIDEOS = 3;
  const [isToastActive, setIsToastActive] = useState(false);

  const deleteFile = async () => {
   
    if (fileType === "image" && images.length <= MIN_IMAGES) {
      setIsToastActive(true);
      toast.error(`You must maintain at least ${MIN_IMAGES} images in the gallery`, {
        position: "top-center",
        autoClose: 3000,
        onClose: () => setIsToastActive(false)
      });
      return;
    }

    if (fileType === "video" && videos.length <= MIN_VIDEOS) {
      setIsToastActive(true);
      toast.error(`You must maintain at least ${MIN_VIDEOS} videos in the gallery`, {
        position: "top-center",
        autoClose: 3000,
        onClose: () => setIsToastActive(false)
      });
      return;
    }

    
    setIsDeleting(true);
    setIsToastActive(true);
    
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete this file?</p>
        <div className="flex gap-2 mt-2">
          <button
           className={`bg-red-500 text-white px-4 py-2 rounded-lg ${
            isDisabled ? "bg-gray-400 cursor-not-allowed opacity-70" : "hover:bg-red-600"
          }`}
            onClick={async () => {
              await confirmDelete(fileId, fileType);
              toast.dismiss(toastId);
              setIsToastActive(false);
            }}
            disabled={isDisabled}
          >
            Yes, Delete
          </button>
          <button
            className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${
            isDisabled ? "bg-gray-400 cursor-not-allowed opacity-70" : "hover:bg-gray-600"
          }`}
            onClick={() => {
              toast.dismiss(toastId);
              setIsDeleting(false);
              setIsToastActive(false);
            }}
            disabled={isDisabled}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        onClose: () => {
          setIsDeleting(false);
          setIsToastActive(false);
        }
      }
    );
  };

  const confirmDelete = async (fileId, fileType) => {
    try {
      setDeletingItems((prev) => [...prev, fileId]);
      
      const res = await fetch(`http://localhost:5000/api/file/${fileId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file");

      if (fileType === "image") {
        setImages((prev) => prev.filter((img) => img._id !== fileId));
      } else {
        setVideos((prev) => prev.filter((vid) => vid._id !== fileId));
      }

      toast.success("File deleted successfully!");
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Failed to delete file.");
    } finally {
      setDeletingItems((prev) => prev.filter((id) => id !== fileId));
      setIsDeleting(false);
    }
  };

 
  const isDisabled = isDeleting || isToastActive;

  return (
    <motion.button
      className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
        isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
      }`}
      onClick={deleteFile}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.1 } : {}}
      whileTap={!isDisabled ? { scale: 0.9 } : {}}
    >
      <motion.span
        animate={{ rotate: isDeleting ? 360 : 0 }}
        transition={{ duration: 1, repeat: isDeleting ? Infinity : 0 }}
      >
        <FaTrash />
      </motion.span>
      Delete
    </motion.button>
  );
};

export default FilesDeleteConfirmation;