import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:5000/pro/"; // Your backend URL

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default"); // default, asc, desc
  const [sortedFeedbacks, setSortedFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch feedbacks from the API
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${API_URL}feedback`);
      const data = await response.json();
      setFeedbacks(data);
      setSortedFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to fetch feedbacks.");
    } finally {
      setLoading(false);  // Update the loading state to false
    }
  };

  // Handle feedback deletion
  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(`${API_URL}feedback/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Feedback deleted successfully!");
        setSortedFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
        setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
      } else {
        toast.error("Unable to delete feedback.");
      }
    } catch (error) {
      toast.error("Error deleting feedback.");
    }
  };

  // Handle sort option change
  const handleSortChange = (order) => {
    setSortOrder(order);
    let sortedData = [...feedbacks];

    if (order === "asc") {
      sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (order === "desc") {
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setSortedFeedbacks(sortedData);
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    const filteredFeedbacks = feedbacks.filter(
      (feedback) =>
        feedback.type.toLowerCase().includes(query) ||
        feedback.subject.toLowerCase().includes(query) ||
        feedback.message.toLowerCase().includes(query)
    );

    setSortedFeedbacks(filteredFeedbacks);
  };

  // Use useEffect to fetch feedbacks when component mounts
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <h1 className="text-center text-green-800 p-10 border-black border-4 m-10 text-4xl">Loading...</h1>;
  }

  return (
    <div className="feedback-list w-11/12 mx-auto flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />

      <nav className="bg-blue-500 p-4 shadow-lg mt-10 mb-12">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">Customer RelationShip Management</h1>
            <div className="space-x-6 flex items-center">
            <Link to="/admin/feedback" className="text-white hover:text-gray-200">
                Feedback
            </Link>
            <Link to="/admin/faq" className="text-white hover:text-gray-200">
                FAQ
            </Link>
             <Link to="/admin/FaqAndFeedbackReport" className="text-white hover:text-gray-200">
                      FAQ & Feedback Report
                  </Link>
            </div>
        </div>
        </nav>

      <div className="relative w-10/12 z-0 cardShape rounded-xl">
      <div className="bg-white rounded-xl mx-auto">
        <h1 className="text-center text-blue-600 mb-10 pt-10 text-2xl font-bold underline">
          FeedBack Management
        </h1>

      {/* Search and Sort Options */}
      <div className="flex justify-center items-center mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Feedback..."
          className="w-5/12 p-2 text-lg border-sky-500 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />

        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-3/12 px-4 py-2 text-lg border-sky-500 border-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        >
          <option value="default">🔄 Reset to Default</option>
          <option value="asc">⬆ Sort Ascending</option>
          <option value="desc">⬇ Sort Descending</option>
        </select>
      </div>

      {/* Feedback Table */}
      <div className="feedback-table w-9/12 bg-white shadow-lg rounded-lg overflow-hidden mx-auto">
        <table className="w-full table-auto mb-8">
          <thead>
            <tr className="bg-blue-200">
              <th className="border p-2 text-center">Type</th>
              <th className="border p-2 text-center">Subject</th>
              <th className="border p-2 text-center">Message</th>
              <th className="border p-2 text-center">Date</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFeedbacks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-red-500 py-40 text-4xl">No feedbacks found.</td>
              </tr>
            ) : (
              sortedFeedbacks.map((feedback) => (
                <tr key={feedback._id} className="hover:bg-gray-100 transition duration-300">
                  <td className="border p-2 text-center">{feedback.type}</td>
                  <td className="border p-2 text-center">{feedback.subject}</td>
                  <td className="border p-2 text-center">{feedback.message}</td>
                  <td className="border p-2 text-center">{new Date(feedback.createdAt).toLocaleDateString()}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteFeedback(feedback._id)}
                      className="bg-red-500 mx-auto px-5 text-white p-2 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      </div>
    </div>
  );
};

export default FeedbackList;
