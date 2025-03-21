import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
        <img
          src={imageUrl}
          alt="Selected product"
          className="w-full h-auto object-contain"
          style={{
            objectFit: "contain",
            maxWidth: "40vw",
            maxHeight: "40vh",
          }}
        />
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
