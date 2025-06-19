import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AdminFAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pro/displayfaq");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      await axios.delete(`http://localhost:5000/pro/deletefaq/${faqId}`);
      fetchFaqs();
      toast.success("FAQ Deleted!");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleEdit = (faq) => {
    setEditing(faq._id);
    setEditedQuestion(faq.question);
    setEditedAnswer(faq.answer || "");
    setEditedCategory(faq.faqtype);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/pro/updatefaq/${editing}`, {
        question: editedQuestion,
        answer: editedAnswer,
        faqtype: editedCategory,
      });
      toast.success("FAQ Updated!");
      setEditing(null);
      fetchFaqs();
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (filter === "answered") return faq.answer && faq.answer.trim() !== "";
    if (filter === "unanswered") return !faq.answer || faq.answer.trim() === "";
    return true;
  });

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <nav className="bg-blue-500 p-4 shadow-lg mt-10 mb-12 w-11/12 mx-auto">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            Customer RelationShip Management
          </h1>
          <div className="space-x-6 flex items-center">
            <Link
              to="/admin/feedback"
              className="text-white hover:text-gray-200"
            >
              Feedback
            </Link>
            <Link to="/admin/faq" className="text-white hover:text-gray-200">
              FAQ
            </Link>
            <Link
              to="/admin/FaqAndFeedbackReport"
              className="text-white hover:text-gray-200"
            >
              FAQ & Feedback Report
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative w-6/12 z-0 cardShape rounded-xl">
        <div
          style={{
            padding: "20px",
            backgroundColor: "#F8F9FA",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 className="text-center text-blue-600 mb-10 text-2xl font-bold underline">
            Admin FAQ Management
          </h1>
          <div className="mb-5 flex justify-center">
            <label className="mr-2 text-xl">Filter: </label>
            <select
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              className="p-2 text-lg rounded-md border border-gray-300"
            >
              <option value="all">All</option>
              <option value="answered">Answered</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>

          <div>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq._id}
                  style={{
                    marginBottom: "15px",
                    padding: "15px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {editing === faq._id ? (
                    <>
                    <lable>Question :</lable>
                      <input
                        type="text"
                        value={editedQuestion}
                        onChange={(e) => setEditedQuestion(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "5px",
                          border: "1px solid #BDC3C7",
                        }}
                      />
                      <br/><br/>
                      <label>Answer : </label>
                      <textarea
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        placeholder="Type the answer..."
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "5px",
                          border: "1px solid #BDC3C7",
                        }}
                      />
                      <br/><br/>
                      <label>Category: </label>
                      <select
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                        style={{
                          padding: "5px",
                          fontSize: "16px",
                          borderRadius: "5px",
                          border: "1px solid #BDC3C7",
                        }}
                      >
                        <option value="EventBooking">Event Booking</option>
                        <option value="Product Order">Product Order</option>
                        <option value="Account">Account</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Other">Other</option>
                      </select>
                      <button
                        onClick={handleUpdate}
                        style={{
                          backgroundColor: "#2980B9",
                          color: "white",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                          marginTop: "10px",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        style={{
                          backgroundColor: "#BDC3C7",
                          color: "#2C3E50",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                          marginTop: "10px",
                          marginLeft: "10px",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <><div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex" }}>
                      <p style={{ fontWeight: "bold", color: "#333" }}>
                        Question : <br/>{faq.question}
                      </p>
                      </div>
                    <div>
                      {faq.answer && (
                        <p style={{ color: "#555" }}>Answer :<br/> {faq.answer}</p>
                      )}
                      </div>
                      <div style={{ display: "flex"}}>
                      <button
                        onClick={() => handleEdit(faq)}
                        style={{
                          backgroundColor: "#27AE60",
                          color: "white",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        style={{
                          backgroundColor: "#E74C3C",
                          color: "white",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                      </div>
                    </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p
                style={{ textAlign: "center", fontSize: "18px", color: "#777" }}
              >
                No FAQs available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFAQPage;