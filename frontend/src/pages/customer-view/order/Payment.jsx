import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Payment = () => {
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentSlipFile, setPaymentSlipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState(""); // 🔥 Error state
  const navigate = useNavigate();

  const handleChange = () => {
    navigate('/client/terms');
  }
 
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileError("Only JPG, JPEG, PNG, SVG, BMP files are allowed");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/bmp"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, JPEG, PNG, SVG, BMP files are allowed");
      toast.error("❌ Only JPG, JPEG, PNG, SVG, BMP files are allowed");
      return;
    }

    // Valid file
    setFileError("");
    setPaymentSlip(file.name);
    setPaymentSlipFile(file); 
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await fetch("http://localhost:5000/upload-payment-slip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploading(false);
      return data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return null;
    }
  };

  const handleNext = async () => {
    if (!paymentSlipFile) {
      toast.warning("📌 Please upload your payment slip before proceeding.");
      return;
    }

    const imageUrl = await uploadToCloudinary(paymentSlipFile);
    if (!imageUrl) {
      toast.error("⚠️ Payment slip upload failed. Please try again.");
      return;
    }

    localStorage.setItem("paymentSlip", imageUrl);
    toast.success(" Payment slip uploaded successfully!");
    navigate("/client/preview-order");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-6">
        {/* Card Container */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-2xl w-full text-center transition-all duration-300 hover:shadow-md">
            <button onClick={handleChange} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button> 
            <ToastContainer />
            
            {/* Title */}
            <h1 className="text-4xl font-extrabold text-green-700 tracking-wide drop-shadow-md">Upload Payment Slip</h1>
            <p className="text-lg text-gray-700 mt-2 leading-relaxed">Your order will only be confirmed after payment is uploaded.</p>

            {/* Upload Section */}
            <div className="mt-6">
            <label className="cursor-pointer border-dashed border-2 border-gray-400 hover:border-green-500 rounded-lg p-6 block w-full transition duration-200">
                <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                />
                <span className="text-gray-600">📂 Click to upload payment slip</span>
            </label>
            {fileError && <p className="text-sm text-red-500 mt-2">{fileError}</p>}
            </div>

            {/* File Name Preview */}
            {paymentSlip && (
            <p className="mt-4 text-green-600 font-semibold text-lg">✅ Uploaded: {paymentSlip}</p>
            )}

            {/* Next Button */}
            <button
            className={`mt-6 px-8 py-3 text-lg font-semibold rounded-full shadow-md transform transition duration-300 ${
                uploading
                ? "bg-gray-400 cursor-not-allowed text-gray-100"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            }`}
            onClick={handleNext}
            disabled={uploading}
            >
            {uploading ? "Uploading..." : "Next"}
            </button>
        </div>
        </div>

  );
};

export default Payment;
