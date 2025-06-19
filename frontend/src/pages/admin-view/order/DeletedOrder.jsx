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
      <h1 className="text-4xl font-bold text-center underline text-white mt-10 mb-10">Deleted Orders (Recovery)</h1>

      <div className="mt-6">
        {deletedOrders.length > 0 ? (
          deletedOrders.map((order) => (
            <div key={order._id} className="my-8 relative z-0 cardShape rounded-xl">
            <div className="p-4 border-blue-400 border-2 rounded-lg shadow-md bg-gray-200">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User Email:</strong> {order.email}</p>
              <table className="w-2/6 border border-gray-300 shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-blue-200 text-black">
                    <tr>
                      <th className="px-4 py-2 border">Product</th>
                      <th className="px-4 py-2 border">Size</th>
                      <th className="px-4 py-2 border">Quantity</th>
                      <th className="px-4 py-2 border">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-100">
                    {order.items.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-200 transition">
                        <td className="px-4 py-2 border text-center">{product.productName}</td>
                        <td className="px-4 py-2 border text-center">{product.size}</td>
                        <td className="px-4 py-2 border text-center">{product.quantity}</td>
                        <td className="px-4 py-2 border text-center">{product.price*product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              <p><strong>Deleted At:</strong> {new Date(order.deletedAt).toLocaleString()}</p>
            </div>
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
  