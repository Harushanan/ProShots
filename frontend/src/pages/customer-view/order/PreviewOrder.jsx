import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FiX, FiCheck, FiDownload, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import CirclerFill from "./CirclerFill";

const PreviewOrder = () => {
  const [order, setOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const email = user?.user?.email || null;
  const userId = email;

  const handleClose = () => navigate("/client/dashboard");

  const generatePDF = useCallback(async () => {
    const input = document.getElementById("order-summary");
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    return pdf;
  }, []);

  const confirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const pdf = await generatePDF();
      pdf.save(`Order_${order.orderId}.pdf`);

      const response = await fetch("http://localhost:5000/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error("Order confirmation failed");

      localStorage.removeItem("cart");
      localStorage.removeItem("design");
      localStorage.removeItem("paymentSlip");

      toast.success("Order confirmed! PDF downloaded", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/client/delivery"), 3000);
    } catch (err) {
      toast.error("Failed to confirm order. Please try again.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const design = JSON.parse(localStorage.getItem("design"));
    const paymentSlip = localStorage.getItem("paymentSlip");

    if (!cart.length || !design || !paymentSlip) {
      navigate("/client/products");
      return;
    }

    setOrder({
      userId,
      email,
      items: cart.map((item) => ({
        productName: item.name,
        size: item.selectedSize,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      design,
      paymentSlip,
      status: "Pending",
      orderDate: new Date().toLocaleString(),
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <ToastContainer />

      {/* Header with close button */}
      <div className="flex justify-between items-center mb-8">
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
        className="max-w-4xl mx-auto"
      >
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white"> Order Summary</h1>
          <p className="text-indigo-100 mt-1">
            Preview your order before confirmation
          </p>
        </div>

        {order ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Order summary card */}
            <div id="order-summary" className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #{order.orderId}
                  </h2>
                  <p className="text-sm text-gray-500">{order.orderDate}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  {order.status}
                </span>
              </div>

              {/* Products section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Your Products
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-indigo-600">
                        Rs. {item.total.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-right font-semibold">
                    Total: Rs.{" "}
                    {order.items
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Design and payment sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Your Design
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 italic">
                    {order.design.description}
                  </p>
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={order.design.image}
                      alt="Custom design"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Payment Slip
                  </h3>
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={order.paymentSlip}
                      alt="Payment slip"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation section */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-gray-600 text-center mb-3">
                Ready to finalize your order? Click the button below to confirm
                and download your receipt.
              </p>
              <motion.button
                onClick={confirmOrder}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white shadow-md transition-colors`}
              >
                {isSubmitting ? (
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
                    Processing...
                  </>
                ) : (
                  <>
                    <FiDownload className="w-5 h-5" />
                    <span>Confirm & Download Receipt</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-600">Loading your order details...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PreviewOrder;
