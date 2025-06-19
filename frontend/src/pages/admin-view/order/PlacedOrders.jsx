import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./NavBar";
import { motion, AnimatePresence } from "framer-motion";

const PlacedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Error fetching orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/order/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="p-4">
          <p className="font-semibold text-lg mb-4 text-gray-800">
            Are you sure you want to delete this order?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                fetch(`http://localhost:5000/order/${id}`, {
                  method: "DELETE",
                })
                  .then(() => {
                    toast.success(`Order ${id} deleted`);
                    fetchOrders();
                    closeToast();
                  })
                  .catch(() => {
                    toast.error("Failed to delete order");
                    closeToast();
                  });
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        className: "shadow-xl rounded-lg",
      }
    );
  };

  const filteredOrders = orders
    .filter((order) => (filter === "all" ? true : order.status === filter))
    .filter(
      (order) =>
        order._id.includes(searchTerm) ||
        order.userId.includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.orderDate) - new Date(a.orderDate);
      if (sortBy === "price") {
        const totalA = a.items.reduce((acc, item) => acc + item.total, 0);
        const totalB = b.items.reduce((acc, item) => acc + item.total, 0);
        return totalB - totalA;
      }
      return 0;
    });

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Processing: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen">
      <h1 className="h-10"></h1>
      <Navbar />
      <ToastContainer />

      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-100 underline mb-8"
        >
          Order Management
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Orders
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Search by Order ID, User ID, or Status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full md:w-1/4">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="filter"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="w-full md:w-1/4">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Default</option>
                <option value="date">Date (Newest)</option>
                <option value="price">Price (Highest)</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              {item.productName} ({item.size})
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              {item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {order.items.reduce((acc, item) => acc + item.total, 0)} Rs/=
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className={`p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                              statusColors[order.status] || "bg-gray-100 text-gray-800"
                            }`}
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Pending" className="bg-amber-100 text-amber-800">
                              Pending
                            </option>
                            <option value="Processing" className="bg-blue-100 text-blue-800">
                              Processing
                            </option>
                            <option value="Completed" className="bg-green-100 text-green-800">
                              Completed
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                              onClick={() => navigate(`/admin/detailedOrder/${order._id}`)}
                            >
                              View
                            </motion.button>
                            {order.status !== "Completed" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                                onClick={() => deleteOrder(order._id)}
                              >
                                Cancel
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "There are currently no orders matching your criteria."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PlacedOrders;