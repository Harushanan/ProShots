import React from "react";
import { FaTrash, FaSpinner } from "react-icons/fa";

const DeleteConfirmation = ({
  showConfirmation,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!showConfirmation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl text-center text-white border-2 border-gray-500">
        <p className="text-2xl font-bold mb-6">
          Are you sure you want to delete this item?
        </p>
        <div className="flex justify-center gap-6">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 flex items-center justify-center"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaTrash className="mr-2" />
            )}
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
