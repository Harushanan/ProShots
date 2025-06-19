import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const email = user && user.user ? user.user.email : null;

  const closeBtn = () => {
      navigate('/client/home')
  }

  const handleView = (id) => {
    navigate(`/client/detailedMyOrders/${id}`);
  }


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch("http://localhost:5000/orders") // Fetch user-specific orders
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.filter((order) => order.email === email);
        setOrders(userOrders);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  };
 
  return (
    <div className="p-10 bg-gradient-to-br from-white to-[#e0f7fa] min-h-screen">
      <button onClick={closeBtn} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button>
      <h1 className="text-4xl font-extrabold text-center text-[#0cbdd6] mb-8 drop-shadow">
        My Orders
      </h1>

      <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
             onClick={() => handleView(order._id)}
              key={order._id}
              className={`p-6 rounded-2xl shadow-lg border-l-8 ${
                order.status === "Pending"
                  ? "bg-yellow-100 border-yellow-400"
                  : "bg-green-100 border-green-500"
              } transition-all hover:shadow-xl`}
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">Order ID:</span> {order._id}
              </p>

              <h3 className="text-lg font-bold mt-3 text-black">Products:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700">
                      <strong>Product:</strong> {item.productName} ({item.size})
                    </p>
                    <p className="text-gray-700">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p className="text-gray-700">
                      <strong>Price:</strong> {item.price} Rs/=
                    </p>
                    <p className="text-gray-900 font-semibold">
                      <strong>Total:</strong> {item.total} Rs/=
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-700">
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded ${
                      order.status === "Pending"
                        ? "bg-yellow-400 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg font-medium">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
