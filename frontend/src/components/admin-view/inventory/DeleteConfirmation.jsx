import React from "react";

const DeleteConfirmation = ({
  deleteItemId,
  deleteItemName,
  handleDelete, 
  setDeleteItemId,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-lg shadow-xl max-w-sm w-full hover:shadow-2xl transition-all duration-300">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold text-red-300">{deleteItemName}</span>?
        </h2>
        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleDelete(deleteItemId)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            Yes
          </button>
          <button
            onClick={() => setDeleteItemId(null)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
