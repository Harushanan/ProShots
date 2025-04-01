import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; //  Add toast import

const PreviewOrder = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const userId = "USR001";

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const email = user && user.user ? user.user.email : null;

  const handleChange = () => {
    navigate('/client/payment');
  }

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const design = JSON.parse(localStorage.getItem("design"));
    const paymentSlip = localStorage.getItem("paymentSlip");

    if (cart.length === 0 || !design || !paymentSlip) {
      toast.error("❌ Order details missing! Complete all steps.", { position: "top-center" });
      navigate("/client/products");
      return; 
    }

    const orderData = { 
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
    };
 
    setOrder(orderData);
  }, [navigate]);

  const confirmOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error("Failed to confirm order");

      const data = await response.json();
      console.log("Order Confirmed:", data);

      localStorage.removeItem("cart");
      localStorage.removeItem("design");
      localStorage.removeItem("paymentSlip");

      toast.success("🎉 Your order has been confirmed!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/client/products");
      }, 3000);
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("❌ Something went wrong. Check console.");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-white to-[#e6f9ff]">
      <h1 className="text-4xl font-extrabold text-center text-[#00bcd4] drop-shadow-lg">📝 Order Preview</h1>
      <button onClick={handleChange} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button> 
        <ToastContainer />

      {order ? (
        <div className="mt-8 p-8 border border-black rounded-xl shadow-2xl bg-white max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-700">📅 Order Date: <span className="text-black">{order.orderDate}</span></h2>
         
  
          <h3 className="text-xl font-semibold mt-6 text-[#00bcd4]">🛍️ Products:</h3>
          <ul className="mt-4 space-y-4">
            {order.items.map((item, index) => (
              <li key={index} className="border border-black p-5 rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                <p><strong>Product:</strong> {item.productName} ({item.size})</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total:</strong> {item.total} Rs/=</p>
              </li>
            ))}
          </ul>
            <div className="flex flex-col md:flex-row items-center justify-around">
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mt-8 text-[#00bcd4]">🎨 Design:</h3>
                    <p className="text-gray-600 italic">{order.design.description}</p>
                    <img
                        src={order.design.image}
                        alt="Design Preview"
                        className="mt-4 w-56 h-56 object-cover border-4 border-black rounded-xl shadow-md hover:scale-105 transition duration-300"
                    />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-semibold mt-8 text-[#00bcd4]">💳 Payment Slip:</h3>
                  <img
                    src={order.paymentSlip}
                    alt="Payment Slip"
                    className="mt-11 w-56 h-56 object-cover border-4 border-black rounded-xl shadow-md hover:scale-105 transition duration-300"
                  />
                </div>
            </div>
            
          <button
            className="mt-8 w-full py-3 bg-[#00bcd4] hover:bg-[#0097a7] text-white font-bold rounded-xl shadow-lg transition-all text-xl"
            onClick={confirmOrder}
          >
             Confirm Final Order
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">Loading order details...</p>
      )}
    </div>
  );
};

export default PreviewOrder;
