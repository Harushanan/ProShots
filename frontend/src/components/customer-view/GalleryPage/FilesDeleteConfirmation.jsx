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

    // Confirmation toast notification
    const toastId = "delete-confirmation"; 
    toast.info(
      <div>
        <p>Are you sure you want to delete this file?</p>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              confirmDelete(fileId, fileType);
            
              toast.update(toastId, {
                render: (
                  <div>
                    <p>Deleting file...</p>
                  </div>
                ),
                autoClose: 3000, 
                closeButton: false, 
              });
            }}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              toast.dismiss(toastId); 
              setIsDeleting(false); 
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
        toastId: toastId, 
      }
    );
  };

  const confirmDelete = async (fileId, fileType) => {
    try {
      
      setDeletingItems((prev) => [...prev, fileId]);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch(`http://localhost:5000/api/file/${fileId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file");

      if (fileType === "image") {
        setImages((prevImages) =>
          prevImages.filter((img) => img._id !== fileId)
        );
      } else if (fileType === "video") {
        setVideos((prevVideos) =>
          prevVideos.filter((vid) => vid._id !== fileId)
        );
      }

  
      setDeletingItems((prev) => prev.filter((id) => id !== fileId));

      
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
      setIsDeleting(false); 
      toast.dismiss("delete-confirmation"); 
    }
  };

  return (
    <motion.button
      className="bg-red-400 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
      onClick={deleteFile}
      disabled={isDeleting} 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }} 
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
