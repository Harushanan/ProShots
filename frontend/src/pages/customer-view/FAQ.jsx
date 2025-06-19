import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import faqImage from "../../assets/faq.webp";
import { toast, ToastContainer } from "react-toastify";

const ClientFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("EventBooking");
  const [searchCategory, setSearchCategory] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pro/displayfaq");
      setFaqs(response.data || []);
    } catch (error) {
      toast.error("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async () => {
    if (question.length < 15) {
      window.alert("Question must Be 15 Characters");
      return;
    }

    try {
      const result = await axios.post("http://localhost:5000/pro/submitfaq", {
        question,
        category,
      });
      if (result.data.message === "faqsubmit") {
        toast.success("FAQ submitted successfully!");
        setTimeout(() => setError(""), 3000);
        setQuestion("");
        setCategory("EventBooking");
        fetchFaqs();
      }
    } catch (err) {
      toast.error("Failed to submit FAQ. Please try again.");
    }
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <div className="w-10/12 mx-auto p-5 font-sans">
      <ToastContainer autoClose={3000} />

      {/* Close button */}
      <button
        onClick={handleNavigate}
        className="absolute top-4 right-4 text-red-950 text-3xl hover:text-red-500 transition"
      >
        ✖
      </button>

      {/* Full-width FAQ Image */}
      <div
        className="bg-cover bg-center h-56 w-full"
        style={{ backgroundImage: `url(${faqImage})` }}
      ></div>

      <div className="flex flex-col md:flex-row gap-8 bg-[#F1E1C6] ">
        {/* New FAQ Section (Left) */}
        <div className="flex flex-col gap-12 rounded-lg bg-[#F1E1C6] p-7 w-full md:w-[45%] border-2 border-black">
          <h2 className="text-center text-xl md:text-4xl font-bold text-blue-600 mb-6">
            Ask a New Question
          </h2>

          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 font-mono"
          />
          <div className="flex items-center gap-2">
            <label className="font-bold font-serif">Select FAQ Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 rounded-md border border-gray-300 w-[150px] font-sans"
            >
              <option value="EventBooking">Event Booking</option>
              <option value="Product Order">Product Order</option>
              <option value="Account">Account</option>
              <option value="Delivery">Delivery</option>
              <option value="Other">Other</option>

            </select>
          </div>

          <button
            onClick={submitQuestion}
            className={`p-2 rounded-md border-none text-white mt-10 ${
              question.trim()
                ? "bg-blue-500 cursor-pointer"
                : "bg-blue-400 cursor-not-allowed"
            }`}
            disabled={!question.trim()}
          >
            Submit
          </button>
        </div>

        {/* Old FAQ Section (Right) */}
        <div className="w-full md:w-[55%]">
          <div className="mt-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-center text-xl md:text-4xl font-bold text-blue-600">
                Past Question
              </h2>

              {/* Filter by Category */}
              <div className="mt-6 flex flex-col md:flex-row items-center gap-4 justify-center">
                <label className="font-bold text-lg text-gray-800 uppercase tracking-wide">
                  Filter by Category:
                </label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="p-3 w-full md:w-[220px] rounded-xl border border-gray-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-indigo-300 outline-none"
                >
                  <option value="All">All</option>
                  <option value="EventBooking">Event Booking</option>
                  <option value="Product Order">Product Order</option>
                  <option value="Account">Account</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Other">Other</option>

                </select>
              </div>

              {/* Displaying old FAQs */}
              {error && (
                <p className="text-green-600 text-center mt-2">{error}</p>
              )}
              {loading ? (
                <p>Loading FAQs...</p>
              ) : (
                <div className="mt-2">
                  {faqs
                    .filter(
                      (faq) =>
                        searchCategory === "All" ||
                        faq.faqtype === searchCategory
                    )
                    .filter((faq) => faq.answer).length === 0 ? (
                    <p className="text-center text-red-700 font-bold mt-12 text-2xl">
                      No FAQs available.
                    </p>
                  ) : (
                    <div>
                      <div className="max-h-[300px] overflow-y-auto mt-4">
                        {faqs
                          .filter(
                            (faq) =>
                              searchCategory === "All" ||
                              faq.faqtype === searchCategory
                          )
                          .filter((faq) => faq.answer)
                          .map((faq) => (
                            <div
                              key={faq._id}
                              className="border border-gray-300 p-4 mb-2 rounded-md bg-gray-100 cursor-pointer transition duration-300 hover:bg-gray-200"
                              onClick={() =>
                                setExpandedFaq(
                                  expandedFaq === faq._id ? null : faq._id
                                )
                              }
                            >
                              <p className="font-serif font-bold">
                                {faq.faqtype}
                              </p>
                              <p
                                className="font-mono flex items-center cursor-pointer"
                                onClick={() =>
                                  setExpandedFaq(
                                    expandedFaq === faq._id ? null : faq._id
                                  )
                                }
                              >
                                <span
                                  className={`transition-transform pr-3 pt-1 duration-300 ${
                                    expandedFaq === faq._id
                                      ? "rotate-90"
                                      : "rotate-0"
                                  }`}
                                >
                                  ▶
                                </span>
                                {faq.question}
                              </p>
                              {expandedFaq === faq._id && (
                                <p className="pl-8 font-serif">{faq.answer}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientFAQ;