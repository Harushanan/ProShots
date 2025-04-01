import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./NavBar";

const PlacedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => toast.error("Error fetching orders"));
  };

  const updateOrderStatus = (id, status) => {
    fetch(`http://localhost:5000/order/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(() => {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      })
      .catch(() => toast.error("Failed to update order status"));
  };
  const deleteOrder = (id) => {
    toast.warn(({ closeToast }) => (
      <div>
        <p className="font-semibold mb-2">Are you sure you want to delete this order?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              fetch(`http://localhost:5000/order/${id}`, {
                method: "DELETE",
              })
                .then(() => {
                  toast.success(`Order ${id} deleted`);
                  fetchOrders();
                  closeToast(); //  close the confirmation box
                })
                .catch(() => {
                  toast.error("Failed to delete order");
                  closeToast(); //  also close if error occurs
                });
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Yes, Delete
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  };
  
 

  const filteredOrders = orders
    .filter((order) =>
      filter === "all" ? true : order.status === filter
    )
    .filter((order) =>
      order._id.includes(searchTerm) ||
      order.userId.includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.orderDate) - new Date(a.orderDate);
      if (sortBy === "price") return b.total - a.total;
      return 0;
    });

  return (
    <div className="p-10">
        <Navbar />
        <ToastContainer />
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-10 mt-10 drop-shadow underline">
        Admin Order Management
      </h1>

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <input
          type="text"
          className="p-2 border rounded w-64"
          placeholder="Search by Order ID, User ID, or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="p-2 border rounded" onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="date">Date</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#f0f0f0] text-black text-sm uppercase">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="text-center text-sm hover:bg-gray-50">
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">{order.userId}</td>
                  <td className="border p-2">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.productName} ({item.size})
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">
                    {order.items.map((item, index) => (
                      <div key={index}>{item.quantity}</div>
                    ))}
                  </td>
                  <td className="border p-2 font-semibold">
                    {order.items.reduce((acc, item) => acc + item.total, 0)} Rs/=
                  </td>
                  <td className="border p-2">
                    <select
                      className="p-1 border rounded"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button 
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      onClick={() => navigate(`/admin/detailedOrder/${order._id}`)}
                    >
                      View
                    </button>
                    {order.status !== "Completed" && (
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                        onClick={() => deleteOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacedOrders;
