import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiLoader, FiHelpCircle, FiMessageSquare } from "react-icons/fi";
import { jsPDF } from "jspdf";
import { FiDownload } from "react-icons/fi";

const FaqAndFeedbackReport = () => {
  const [faqData, setFaqData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [faqAnalysis, setFaqAnalysis] = useState("");
  const [feedbackAnalysis, setFeedbackAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("faq");

  const fetchFAQData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pro/displayfaq");
      setFaqData(response.data);
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
    }
  };

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/pro/feedback");
      setFeedbackData(response.data);
    } catch (error) {
      console.error("Error fetching Feedback data:", error);
    }
  };

  const analyzeData = async () => {
    try {
      const faqPrompt = `
        Analyze the following FAQs:
        ${faqData.map((faq, index) => `${index + 1}. Q: ${faq.question} A: ${faq.answer}`).join("\n")}

        Provide:
        1. Overall FAQ Quality Summary
        2. Identify any confusing or repetitive FAQs
        3. Suggest 3 improvements for FAQ content.
      `;

      const feedbackPrompt = `
        Analyze the following Customer Feedback:
        ${feedbackData.map((fb, index) => `${index + 1}. Subject: ${fb.subject} | Message: ${fb.message} | Status: ${fb.status}`).join("\n")}

        Provide:
        1. Overall Feedback Sentiment (positive, negative, mixed)
        2. Highlight common complaints or praise
        3. Suggest 3 actions to improve customer satisfaction.
      `;

      const [faqResponse, feedbackResponse] = await Promise.all([
        axios.post("http://localhost:5000/analyze/ai", { prompt: faqPrompt }),
        axios.post("http://localhost:5000/analyze/ai", { prompt: feedbackPrompt })
      ]);

      setFaqAnalysis(faqResponse.data.analysis);
      setFeedbackAnalysis(feedbackResponse.data.analysis);
    } catch (error) {
      console.error("Error analyzing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQData();
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    if (faqData.length && feedbackData.length) {
      analyzeData();
    }
  }, [faqData, feedbackData]);

  const formatAnalysisText = (text) => {
    return text.split("\n").map((paragraph, index) => {
      if (paragraph.match(/^\d+\./)) {
        return <li key={index} className="ml-4 list-disc">{paragraph}</li>;
      } else if (paragraph.match(/^[A-Z][a-z]+:/)) {
        return <h4 key={index} className="font-semibold mt-3 text-blue-600">{paragraph}</h4>;
      }
      return <p key={index} className="mt-2">{paragraph}</p>;
    });
  };

 const downloadPDF = () => {
  // Create FAQ Analysis PDF
  const faqDoc = new jsPDF();
  faqDoc.setFontSize(16);
  faqDoc.text("FAQ Analysis", 20, 30);
  faqDoc.setFontSize(12);
  faqDoc.text(faqAnalysis, 20, 40);
  faqDoc.save("FAQ_Analysis.pdf");

  // Create Feedback Analysis PDF
  const feedbackDoc = new jsPDF();
  feedbackDoc.setFontSize(16);
  feedbackDoc.text("Feedback Analysis", 20, 30);
  feedbackDoc.setFontSize(12);
  feedbackDoc.text(feedbackAnalysis, 20, 40);
  feedbackDoc.save("Feedback_Analysis.pdf");
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin text-blue-600 text-3xl" />
          <span className="text-lg text-gray-800">Analyzing FAQ and Feedback data...</span>
        </div>
        <p className="mt-2 text-gray-600">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <h1 className="text-4xl font-extrabold">AI Analysis Dashboard</h1>
          <p className="mt-2 text-lg opacity-90">Insights from customer FAQs and feedback</p>
        </div>

        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex items-center px-8 py-4 text-lg font-medium ${activeTab === "faq" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            <FiHelpCircle className="mr-2" />
            FAQ Analysis
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center px-8 py-4 text-lg font-medium ${activeTab === "feedback" ? "text-blue-600 border-b-4 border-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            <FiMessageSquare className="mr-2" />
            Feedback Analysis
          </button>
        </div>

        <div className="p-8">
          {activeTab === "faq" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">FAQ Analysis</h3>
              <div className="text-gray-700">{formatAnalysisText(faqAnalysis)}</div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Feedback Analysis</h3>
              <div className="text-gray-700">{formatAnalysisText(feedbackAnalysis)}</div>
            </div>
          )}

          <button
          onClick={downloadPDF}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <FiDownload className="mr-2 animate-spin-slow" /> {/* The icon with animation */}
          Download as PDF
        </button>
        </div>
      </div>
    </div>
  );
};

export default FaqAndFeedbackReport;
