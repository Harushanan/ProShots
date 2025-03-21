import React from "react";
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
}) => {
  const deleteFile = async () => {
    setIsDeleting(true);

    // confirmation toast notification
    toast.info(
      <div>
        <p>Are you sure you want to delete this file?</p>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => confirmDelete(fileId, fileType)}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              toast.dismiss(); // Dismiss the confirmation toast
              setIsDeleting(false); // Re-enable actions if canceled
            }}
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
        toastId: "delete-confirmation", // Assign a unique ID to the toast
      }
    );
    
  };

  const confirmDelete = async (fileId, fileType) => {
    try {
      // Add the item to the deletingItems state
      setDeletingItems((prev) => [...prev, fileId]);

      // Wait for the animation to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch(`http://localhost:5000/api/file/${fileId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file");

      // Update the state based on the file type
      if (fileType === "image") {
        setImages((prevImages) =>
          prevImages.filter((img) => img._id !== fileId)
        );
      } else if (fileType === "video") {
        setVideos((prevVideos) =>
          prevVideos.filter((vid) => vid._id !== fileId)
        );
      }

      // Remove the item from the deletingItems state
      setDeletingItems((prev) => prev.filter((id) => id !== fileId));

      // Show success toast notification
      toast.success("File deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log("File deleted successfully");
    } catch (err) {
      console.error("Error deleting file:", err);

      // Show error toast notification
      toast.error("Failed to delete file.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsDeleting(false); // Re-enable actions after deletion is complete
      toast.dismiss("delete-confirmation"); // Dismiss the confirmation toast
    }
  };

  return (
    <motion.button
      className="bg-red-400 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
      onClick={deleteFile}
      disabled={isDeleting} // Disable while deleting
      whileHover={{ scale: 1.1 }} // Animation on hover
      whileTap={{ scale: 0.9 }} // Animation on click
    >
      <motion.span
        animate={{ rotate: isDeleting ? 360 : 0 }} // Rotate icon while deleting
        transition={{ duration: 1, repeat: isDeleting ? Infinity : 0 }} // Infinite rotation
      >
        <FaTrash />
      </motion.span>
      Delete
    </motion.button>
  );
};

export default FilesDeleteConfirmation;
