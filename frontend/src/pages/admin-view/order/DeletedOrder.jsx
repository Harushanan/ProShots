import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";

const DeletedOrders = () => {
  const [deletedOrders, setDeletedOrders] = useState([]);

  useEffect(() => {
    fetchDeletedOrders();
  }, []);

  const fetchDeletedOrders = () => {
    fetch("http://localhost:5000/deleted-orders")
      .then((res) => res.json())
      .then((data) => setDeletedOrders(data))
      .catch((error) => console.error("Error fetching deleted orders:", error));
  };
 
  const restoreOrder = (id) => {
    fetch(`http://localhost:5000/restore-order/${id}`, {
      method: "POST",
    })
      .then(() => {
        alert(`Order ${id} has been restored.`);
        fetchDeletedOrders();
      })
      .catch((error) => console.error("Error restoring order:", error));
  };
 
  return (
    <div className="p-10">
      <Navbar />
      <h1 className="text-4xl font-bold text-center underline text-blue-900 mt-10 mb-10">Deleted Orders (Recovery)</h1>

      <div className="mt-6">
        {deletedOrders.length > 0 ? (
          deletedOrders.map((order) => (
            <div key={order._id} className="border p-4 my-2 rounded-lg shadow-md bg-gray-200">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User ID:</strong> {order.userId}</p>
              <p><strong>Product:</strong> {order.productName} ({order.size})</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Deleted At:</strong> {new Date(order.deletedAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No deleted orders found.</p>
        )}
      </div>
    </div>
  );
};

export default DeletedOrders;
  