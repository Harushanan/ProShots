import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiX,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { motion } from "framer-motion";
import CirclerFill from "./CirclerFill";

const Payment = () => {
  const [paymentSlipFile, setPaymentSlipFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showZoom, setShowZoom] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => navigate("/client/products");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileError("Please select a file");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, JPEG, PNG files are allowed");
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2 text-red-500" />
          Invalid file type. Only JPG, JPEG, PNG are allowed.
        </div>
      );
      return;
    }

    if (file.size > maxSize) {
      setFileError("File size should be less than 5MB");
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2 text-red-500" />
          File is too large. Maximum size is 5MB.
        </div>
      );
      return;
    }

    setFileError("");
    setPreviewUrl(URL.createObjectURL(file));
    setPaymentSlipFile(file);
  };

  const clearImage = () => {
    setPaymentSlipFile(null);
    setPreviewUrl(null);
    setShowZoom(false);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await fetch(
        "http://localhost:5000/upload-payment-slip",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2 text-red-500" />
          Failed to upload payment slip. Please try again.
        </div>
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleNext = async () => {
    if (!paymentSlipFile) {
      toast.warning(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2 text-amber-500" />
          Please upload your payment slip before proceeding.
        </div>
      );
      return;
    }

    const imageUrl = await uploadToCloudinary(paymentSlipFile);
    if (!imageUrl) return;

    localStorage.setItem("paymentSlip", imageUrl);
    toast.success(
      <div className="flex items-center">
        <FiCheckCircle className="mr-2 text-green-500" />
        Payment slip uploaded successfully!
      </div>
    );
    navigate("/client/preview-order");
  };

  return (
    <div className="min-h-screen p-6">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header with close button */}
      <div className="flex justify-between items-center mb-4">
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-6 p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Progress stepper */}
      <CirclerFill />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Upload Payment Slip
            </h1>
            <p className="text-indigo-100 mt-1">
              Please upload a clear image of your payment slip
            </p>
          </div>

          {/* Main content */}
          <div className="p-6">
            {/* File upload area */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Payment Slip Image
              </label>
              <label className="cursor-pointer">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    previewUrl
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload
                      className={`w-8 h-8 mb-2 ${
                        previewUrl ? "text-indigo-500" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        previewUrl
                          ? "text-indigo-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {previewUrl ? "Image selected" : "Click to upload"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </div>
              </label>
              {fileError && (
                <p className="mt-2 text-sm text-red-500">{fileError}</p>
              )}
            </div>

            {/* Image preview */}
            {previewUrl && (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Preview
                </label>
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Payment slip preview"
                    className="w-full h-auto object-contain max-h-64 rounded-lg border border-gray-200 cursor-zoom-in"
                    onClick={() => setShowZoom(true)}
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <motion.button
              onClick={handleNext}
              disabled={uploading || !paymentSlipFile}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                uploading || !paymentSlipFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white shadow-md transition-colors`}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <FiCheckCircle className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Zoom Modal */}
      {showZoom && previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setShowZoom(false)}
        >
          <img
            src={previewUrl}
            alt="Zoomed Payment Slip"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Payment;
