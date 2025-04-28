import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleChange = () => {
    navigate('/client/design')
  }

  const handleNext = () => {
    if (!accepted) {
      alert("You must accept the Terms & Conditions before proceeding.");
      return;
    }
    navigate("/client/payment");
  };

  return (
    <div className="p-10 text-center min-h-screen">
      <button onClick={handleChange} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button> 
      <ToastContainer />
      
      <h1 className="text-4xl font-bold text-[#00bcd4] mb-6">📜 Terms & Conditions</h1>

      <div className="max-w-3xl mx-auto bg-white border border-black rounded-xl shadow-lg p-6 text-left text-gray-700 space-y-4">
        <p> 
          When placing an order for a product, you are required to pay <strong>50% of the total price</strong> as an advance payment.
        </p>

        <p className="font-semibold">💳 Payment Details:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>🏦 <strong>BOC Account Number:</strong> 234559658584</li>
          <li>💵 After making the advance payment, please upload a <strong>clear photo</strong> of the payment slip.</li>
          <li>📌 Make sure to <strong>write your Email</strong> on the slip before uploading it. <br /> (Example: <code className="text-sm text-gray-600">abc@gmail.com</code>)</li>
        </ul>

        <p>
          If you have any changes or confirmations regarding your submitted design, please contact us via telephone and discuss with our team.
        </p>

        <p>
          Once your order is fully confirmed, You will recive a order process notification <br />
          <strong className="text-red-500">After that, no changes can be made</strong> to the design or order details.
        </p>

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="mr-3 w-5 h-5"
            />
            <span className="font-medium">I accept the Terms & Conditions</span>
          </label>
        </div>

        <button
          className={`mt-6 w-full py-3 rounded-lg font-bold transition-all ${
            accepted
              ? "bg-[#00bcd4] hover:bg-[#0097a7] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!accepted}
        >
          ✅ Confirm & Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Terms;
