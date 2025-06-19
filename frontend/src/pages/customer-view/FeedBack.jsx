import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/feedbackimage.jpeg";
import { toast, ToastContainer } from "react-toastify";
import ClientFAQ from "./FAQ";

const API_URL = "http://localhost:5000/pro/";

const FeedBack = () => {
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0];

  const handleNavigate = () => navigate("/client/faq");

  // Function to send feedback to API
  const createFeedback = async (feedback) => {
    try {
      const response = await fetch(`${API_URL}feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const data = await response.json();
      toast.success("Your feedback submit successfully.");
      console.log(data.message);
      setTimeout(() => {
        setType("");
        setSubject("");
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
    }
  };

  const insertfb = async (e) => {
    e.preventDefault();

    if (!type || !subject || !message) {
      window.alert("Please fill all the fields");
      return;
    }

    if (subject.length < 15) {
      window.alert("Subject must Be 15 Characters");
      return;
    }

    if (message.length < 15) {
      window.alert("Message must Be 15 Characters");
      return;
    }

    const feedback = {
      date: currentDate,
      type,
      subject,
      message,
      status: "normal",
    };
    await createFeedback(feedback);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen md:h-screen border-black mt-16 lg:mt-28 overflow-y-hidden">
      <ToastContainer autoClose={3000} />
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-start items-center">
        <img src={img} alt="Feedback" className="h-80 md:h-full object-cover" />
      </div>

      {/* Right Side - Enlarged Form */}
      <div className="w-full md:w-1/2 flex justify-center">
        <form className="w-full md:w-2/3 lg:w-3/4 p-8 md:p-10 bg-white shadow-xl rounded-xl flex flex-col space-y-6">
          <h1 className="text-4xl font-bold text-center text-blue-800 underline">
            Feedback Form
          </h1>

          <select
            className="w-full h-12 px-4 border border-gray-400 rounded-lg outline-none focus:border-blue-500 transition"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Feedback Type</option>
            <option value="order">Order Feedback</option>
            <option value="delivery">Delivery Feedback</option>
            <option value="event">Event Feedback</option>
            <option value="general">General Feedback</option>
            <option value="system">System Feedback</option>
            <option value="other">Other</option>
          </select>

          <input
            className="w-full h-12 px-4 border border-gray-400 rounded-lg outline-none focus:border-blue-500 transition"
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <textarea
            className="w-full h-32 p-4 border border-gray-400 rounded-lg outline-none resize-none focus:border-blue-500 transition"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button
            className="w-full h-12 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            type="submit"
            onClick={insertfb}
          >
            Submit
          </button>
          <p className="text-lg text-right text-gray-800 hover:text-blue-600 cursor-pointer transition-all duration-300 ease-in-out">
            If You Have any Question
            <span
              onClick={handleNavigate}
              className="text-gray-400 hover:underline hover:text-gray-700 font-semibold pl-3"
            >
              Frequently Asked Questions
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default FeedBack;