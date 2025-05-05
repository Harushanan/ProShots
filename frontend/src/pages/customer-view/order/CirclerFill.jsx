import React from "react";
import { useLocation } from "react-router-dom";
import {
  FiUpload,
  FiFileText,
  FiCreditCard,
  FiCheckCircle,
  FiTruck,
  FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";

const CirclerFill = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const pages = [
    { path: "/client/design", name: "Design", icon: <FiUpload /> },
    { path: "/client/terms", name: "Terms", icon: <FiFileText /> },
    { path: "/client/payment", name: "Payment", icon: <FiCreditCard /> },
    { path: "/client/preview-order", name: "Confirm", icon: <FiCheckCircle /> },
    { path: "/client/delivery", name: "Delivery", icon: <FiTruck /> },
  ];

  const currentIndex = pages.findIndex((page) =>
    currentPath.includes(page.path)
  );

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-4 w-full max-w-4xl">
        <div className="flex items-center justify-between">
          {pages.map((page, index) => (
            <React.Fragment key={index}>
              <motion.div
                className="flex flex-col items-center relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Step indicator */}
                <motion.div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    relative z-10 transition-all duration-300
                    ${currentIndex > index ? "bg-green-500" : "bg-gray-100"}
                    ${
                      currentIndex === index &&
                      "border-2 border-green-500 bg-white"
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Completed steps (green checkmark) */}
                  {currentIndex > index ? (
                    <FiCheck className="text-lg text-white" />
                  ) : (
                    /* Active and upcoming steps */
                    React.cloneElement(page.icon, {
                      className: `text-lg ${
                        currentIndex === index
                          ? "text-green-500" // Active step - green icon
                          : index < currentIndex
                          ? "text-gray-300" // Before active but completed - light gray
                          : "text-gray-500" // Upcoming steps - medium gray
                      }`,
                    })
                  )}

                  {/* Active step pulse effect */}
                  {currentIndex === index && (
                    <motion.div
                      className="absolute inset-0 border-2 border-green-200 rounded-full"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.6, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Step label */}
                <motion.div
                  className={`mt-2 text-xs font-medium text-center max-w-[100px] ${
                    currentIndex >= index ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {page.name}
                </motion.div>
              </motion.div>

              {/* Connector line between steps */}
              {index < pages.length - 1 && (
                <div className="flex-1 relative mx-2">
                  <div
                    className={`h-1 rounded-full ${
                      currentIndex > index ? "bg-green-300" : "bg-gray-200"
                    } transition-colors duration-300`}
                  />
                  {currentIndex > index && (
                    <motion.div
                      className="absolute top-0 left-0 h-1 rounded-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CirclerFill;
