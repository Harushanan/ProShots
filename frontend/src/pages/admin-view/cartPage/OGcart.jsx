import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FiShoppingCart, FiX, FiTrash2, FiChevronRight } from "react-icons/fi";

const OGcart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = storedCart.map(item => ({
        ...item,
        quantity: item.quantity > 0 ? item.quantity : 1,
        itemTotal: (item.price || 0) * (item.quantity > 0 ? item.quantity : 1),
      }));
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      calculateTotal(updatedCart);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
    setTotalPrice(total);
  };

  const updateQuantity = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updatedCart[index].itemTotal = updatedCart[index].price * quantity;

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);

    toast.info(`Quantity updated to ${quantity}`, {
      position: "bottom-right",
      autoClose: 1500,
      className: "bg-blue-50 text-blue-800",
      progressClassName: "bg-blue-400",
    });
  };

  const removeFromCart = (index) => {
    const item = cart[index];

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <FiTrash2 className="text-red-500 text-4xl mb-3" />
              <h1 className="text-xl font-bold mb-2">Remove this item?</h1>
              <p className="text-gray-600 mb-6">
                {`${item.name} (${item.selectedSize})`}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    const newCart = cart.filter((_, i) => i !== index);
                    setCart(newCart);
                    localStorage.setItem("cart", JSON.stringify(newCart));
                    calculateTotal(newCart);
                    toast.success(`${item.name} removed from cart`, {
                      position: "top-right",
                      autoClose: 2000,
                      className: "bg-green-50 text-green-700",
                      progressClassName: "bg-green-400",
                    });
                    onClose();
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    toast.info("Item kept in cart", {
                      position: "bottom-right",
                      autoClose: 1500,
                    });
                    onClose();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Keep
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  const handleEmptyCart = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <FiShoppingCart className="text-red-500 text-4xl mb-3" />
              <h1 className="text-xl font-bold mb-2">Empty Your Cart?</h1>
              <p className="text-gray-600 mb-6">
                This will remove all {cart.length} items
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setCart([]);
                    localStorage.setItem("cart", JSON.stringify([]));
                    setTotalPrice(0);
                    toast.success("Cart emptied successfully", {
                      position: "top-right",
                      autoClose: 2000,
                      className: "bg-green-50 text-green-700",
                      progressClassName: "bg-green-400",
                    });
                    onClose();
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Empty Cart
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiShoppingCart className="text-blue-600" />
            Your Shopping Cart
          </h1>
          <button 
            onClick={() => navigate('/client/products')}
            className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
            aria-label="Close cart"
          >
            <FiX className="text-gray-600 text-xl" />
          </button>
        </div>

        <ToastContainer />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-white rounded-full shadow-md mb-4">
              <FiShoppingCart className="text-gray-400 text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
            <button
              onClick={() => navigate('/client/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center gap-2 mx-auto"
            >
              Continue Shopping <FiChevronRight />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {cart.map((item, index) => (
                <div 
                  key={index}
                  className="p-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiShoppingCart className="text-gray-400 text-xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.selectedSize && `${item.selectedSize} • `}
                          {item.price} Rs per unit
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 100 }, (_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>

                      <div className="w-24 text-right font-medium text-gray-800">
                        {item.price * item.quantity} Rs
                      </div>

                     <button
                      onClick={() => removeFromCart(index)}
                      className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition duration-150"
                      aria-label="Remove item"
                       >
                      <FiTrash2 />
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Subtotal</h3>
                <div className="text-lg font-bold text-gray-800">{totalPrice} Rs</div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
               <button
    onClick={handleEmptyCart}
    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 flex-1 font-medium"
  >
    Empty Cart
  </button>
                <button
                  onClick={() => {
                    const hasZeroQuantity = cart.some(item => !item.quantity || item.quantity < 1);
                    if (hasZeroQuantity) {
                      toast.error("All items must have at least quantity of 1", {
                        position: "top-center",
                        autoClose: 3000,
                        className: "bg-red-50 text-red-700",
                        progressClassName: "bg-red-400",
                      });
                    } else {
                      navigate("/client/design");
                    }
                  }}
className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex-1 flex items-center justify-center gap-2"                >
                  Proceed to Design <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => navigate('/client/products')}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto"
              >
                <FiChevronRight className="transform rotate-180" /> Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OGcart;