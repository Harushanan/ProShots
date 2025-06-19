import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CirclerFill from "./CirclerFill";
import { FiX, FiCheck, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/client/products");
  };

  const handleNext = () => {
    if (!accepted) {
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          You must accept the Terms & Conditions
        </div>,
        { position: "top-center" }
      );
      return;
    }
    navigate("/client/payment");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
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

      {/* Header with navigation buttons */}
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
        {/* Header section */}
        <div className="bg-indigo-600 p-6 text-center rounded-t-xl">
          <h1 className="text-2xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-indigo-100 mt-1">
            Please review and accept to proceed
          </p>
        </div>

        {/* Terms card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-b-xl shadow-lg overflow-hidden"
        >
          {/* Terms content */}
          <div className="p-6 md:p-8">
            <motion.div
              variants={itemVariants}
              className="prose prose-sm md:prose-base max-w-none text-gray-700 space-y-4"
            >
              <p>
                When placing an order for a product, you are required to pay{" "}
                <strong className="text-indigo-600">
                  50% of the total price
                </strong>{" "}
                as an advance payment.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-blue-700 flex items-center">
                  <span className="mr-2">💳</span> Payment Details
                </h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">🏦</span>
                    <span>
                      <strong>Bank Account:</strong> BOC #234559658584
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">📸</span>
                    <span>
                      After payment, upload a <strong>clear photo</strong> of
                      the payment slip
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✏️</span>
                    <span>
                      <strong>Write your email</strong> on the slip (Example:{" "}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                        abc@gmail.com
                      </code>
                      )
                    </span>
                  </li>
                </ul>
              </div>

              <p>
                For any design changes or confirmations, please contact our team
                via telephone.
              </p>

              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                <p className="text-amber-800 font-medium flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span>
                    After receiving order confirmation,{" "}
                    <strong className="text-red-500">no changes</strong> can be
                    made to the design
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Acceptance Checkbox */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-start"
            >
              <div className="flex items-center h-5">
                <input
                  id="terms-acceptance"
                  type="checkbox"
                  checked={accepted}
                  onChange={() => setAccepted(!accepted)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <label
                htmlFor="terms-acceptance"
                className="ml-3 text-gray-700 cursor-pointer select-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span className="font-medium">
                  I accept the Terms & Conditions
                </span>
                {isHovering && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-2 text-xs text-gray-500 inline-block"
                  >
                    (Required to continue)
                  </motion.span>
                )}
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="mt-8">
              <motion.button
                onClick={handleNext}
                disabled={!accepted}
                whileHover={{ scale: accepted ? 1.02 : 1 }}
                whileTap={{ scale: accepted ? 0.98 : 1 }}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  accepted
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                {accepted ? (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>Confirm & Proceed to Payment</span>
                  </>
                ) : (
                  "Accept Terms to Continue"
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Terms;
