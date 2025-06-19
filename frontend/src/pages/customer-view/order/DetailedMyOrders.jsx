import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailedMyOrders = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const closeBtn = () => {
    navigate('/client/my-orders');
  }



  useEffect(() => {
    fetch(`http://localhost:5000/order/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details.");
      });
  }, [id]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!order) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-[#32C5FF] to-black flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white bg-opacity-90 p-10 rounded-xl shadow-[0px_10px_25px_rgba(50,197,255,0.3)] backdrop-blur-md border border-[#32C5FF]">
        <button onClick={closeBtn} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button>
        <h1 className="text-5xl font-extrabold text-center text-[#32C5FF] drop-shadow-lg">Order Details</h1>

        <div className="border-b border-[#32C5FF] pb-4 mb-4 text-gray-900">
          <p className="text-lg font-semibold"><strong>Order ID:</strong> {order._id}</p>
          <p className="text-lg"><strong>Email:</strong> {order.email}</p>
        </div>

        <h3 className="text-2xl font-semibold text-[#005A9C] mt-6">Products</h3>
        <ul className="mt-4 space-y-4">
          {order.items.map((item, index) => (
            <li key={index} className="border p-5 rounded-lg shadow-md bg-white bg-opacity-80 border-[#32C5FF] hover:shadow-lg transition-transform transform hover:scale-105">
              <p className="text-lg font-semibold"><strong>Product:</strong> {item.productName} ({item.size})</p>
              <p className="text-lg"><strong>Quantity:</strong> {item.quantity}</p>
              <p className="text-lg"><strong>Price:</strong> {item.price} Rs/=</p>
              <p className="text-lg"><strong>Total:</strong> {item.total} Rs/=</p>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Design Image */}
          <div>
            <h3 className="text-2xl font-semibold text-[#005A9C]">Design</h3>
            <p className="text-gray-800">{order.design?.description || "No description provided"}</p>
            {order.design?.image && (
              <img
                src={order.design.image}
                alt="Design Preview"
                className="mt-4 w-full max-w-xs h-56 object-cover border-4 border-[#32C5FF] rounded-lg shadow-[0px_8px_20px_rgba(50,197,255,0.4)] cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => openImageModal(order.design.image)}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            )} 
          </div>

          {/* Payment Slip */}
          <div>
            <h3 className="text-2xl font-semibold text-[#005A9C]">Payment Slip</h3>
            {order.paymentSlip && (
              <img
                src={order.paymentSlip}
                alt="Payment Slip"
                className="mt-4 w-full max-w-xs h-56 object-cover border-4 border-[#32C5FF] rounded-lg shadow-[0px_8px_20px_rgba(50,197,255,0.4)] cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => openImageModal(order.paymentSlip)}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            )}
          </div>
        </div>
      </div>

      {/*  Fullscreen Image Modal with Soft Blur Effect */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-xl transition-all duration-300"
          onClick={closeModal} 
        >
          <div className="relative">
            <button 
              className="absolute top-4 right-4 bg-[#32C5FF] text-black text-2xl px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all"
              onClick={closeModal}
            >
              ✖
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged Preview" 
              className="max-w-[85vw] max-h-[85vh] rounded-lg shadow-[0px_10px_30px_rgba(50,197,255,0.6)] border-4 border-[#32C5FF]"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedMyOrders;
