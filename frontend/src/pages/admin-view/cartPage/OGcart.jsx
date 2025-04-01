import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const OGcart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const handleChange = () => {
      navigate('/client/products')
  }

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []); 

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
    setTotalPrice(total);
  };

  const updateQuantity = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);

    toast.info(`Quantity updated to ${quantity}`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const removeFromCart = (index) => {
    const item = cart[index];

    confirmAlert({
      title: "Are you sure?",
      message: `Remove ${item.name} (${item.selectedSize}) from your cart?`,
      buttons: [
        {
          label: "Yes, Remove",
          onClick: () => {
            const newCart = cart.filter((_, i) => i !== index);
            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
            calculateTotal(newCart);

            toast.success(`${item.name} removed from cart.`, {
              position: "top-right",
              autoClose: 2000,
            });
          },
        },
        {
          label: "Cancel",
          onClick: () => {
            toast.info("Cancelled action", {
              position: "bottom-left",
              autoClose: 1500,
            });
          },
        },
      ],
    });
  };

  return (
    <div className="container mx-auto p-6 lg:p-12 bg-gray-200 min-h-screen">
      <button onClick={handleChange} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button> 
      <h1 className="text-3xl font-bold text-blue-900 underline mb-8 text-center">Your Cart</h1>
      <ToastContainer />

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg font-medium">Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="bg-white p-5 rounded-xl border border-black shadow-lg flex flex-col md:flex-row justify-between items-center transition duration-200 hover:shadow-xl"
              >
                <div className="text-left mb-4 md:mb-0">
                  <p className="text-xl font-semibold text-black">{item.name} ({item.selectedSize})</p>
                  <p className="text-gray-500 text-sm">{item.price} Rs/= per unit</p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    className="border p-2 rounded-lg text-gray-700"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, Number(e.target.value))}
                  >
                    {[...Array(100).keys()].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <span className="font-bold text-black text-lg">
                    {item.price * item.quantity || 0} Rs/=
                  </span>
                </div>

                <button
                  className="mt-4 md:mt-0 text-red-600 font-bold hover:underline"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-2xl font-bold text-right text-black">
            Grand Total: {totalPrice} Rs/=
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-[#0cbdd6] hover:bg-[#0aa7be] text-white px-8 py-3 rounded-full text-lg shadow-md transition duration-300"
              onClick={() => navigate("/client/design")}
            >
              Proceed to Design
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OGcart;
