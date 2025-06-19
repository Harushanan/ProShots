import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiLoader,
  FiHelpCircle,
  FiMessageSquare,
  FiDownload,
  FiThumbsUp,
  FiThumbsDown,
  FiMeh,
} from "react-icons/fi";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";

const FaqAndFeedbackReport = () => {
  const [faqData, setFaqData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [categorizedFeedback, setCategorizedFeedback] = useState({
    positive: [],
    negative: [],
    neutral: [],
  });
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
      const data = response.data;
      setFeedbackData(data);

      // Categorize feedback by sentiment
      const categorized = {
        positive: data.filter((fb) => fb.sentiment === "positive"),
        negative: data.filter((fb) => fb.sentiment === "negative"),
        neutral: data.filter(
          (fb) => !fb.sentiment || fb.sentiment === "neutral"
        ),
      };
      setCategorizedFeedback(categorized);
    } catch (error) {
      console.error("Error fetching Feedback data:", error);
    }
  };

  const analyzeData = async () => {
    try {
      // Enhanced FAQ analysis prompt
      const faqPrompt = `
        Analyze the following FAQ content for quality and effectiveness:
        
        FAQ List:
        ${faqData
          .map(
            (faq, index) => `
          Question ${index + 1}: ${faq.question}
          Answer: ${faq.answer}
          ${"-".repeat(50)}`
          )
          .join("\n")}

        Provide a detailed analysis with:
        1. Content Quality Assessment (1-5 scale)
        2. Clarity Evaluation
        3. Identification of redundant or unclear FAQs
        4. Top 3 recommendations for improvement
        5. Suggested new FAQ topics based on gaps
      `;

      // Enhanced feedback analysis with sentiment context
      const feedbackPrompt = `
        Analyze these customer feedback items with their sentiment context:
        
        Positive Feedback (${categorizedFeedback.positive.length} items):
        ${categorizedFeedback.positive
          .map(
            (fb) => `
          Subject: ${fb.subject}
          Message: ${fb.message}
          ${"-".repeat(30)}`
          )
          .join("\n")}
        
        Negative Feedback (${categorizedFeedback.negative.length} items):
        ${categorizedFeedback.negative
          .map(
            (fb) => `
          Subject: ${fb.subject}
          Message: ${fb.message}
          ${"-".repeat(30)}`
          )
          .join("\n")}
        
        Neutral Feedback (${categorizedFeedback.neutral.length} items):
        ${categorizedFeedback.neutral
          .map(
            (fb) => `
          Subject: ${fb.subject}
          Message: ${fb.message}
          ${"-".repeat(30)}`
          )
          .join("\n")}

        Provide a comprehensive analysis covering:
        1. Overall sentiment distribution
        2. Key positive aspects customers appreciate
        3. Major pain points and complaints
        4. Common themes in neutral feedback
        5. Actionable recommendations (prioritized)
        6. Suggested response templates for common issues
      `;

      const [faqResponse, feedbackResponse] = await Promise.all([
        axios.post("http://localhost:5000/analyze/ai", { prompt: faqPrompt }),
        axios.post("http://localhost:5000/analyze/ai", {
          prompt: feedbackPrompt,
        }),
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
      if (paragraph.match(/^\d+\.\s[A-Z]/)) {
        return (
          <h4 key={index} className="font-semibold mt-4 text-blue-600">
            {paragraph}
          </h4>
        );
      } else if (paragraph.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-6 list-disc mt-2">
            {paragraph}
          </li>
        );
      } else if (paragraph.match(/^[A-Z][a-z]+:/)) {
        return (
          <h5 key={index} className="font-medium mt-3 text-gray-800">
            {paragraph}
          </h5>
        );
      }
      return (
        <p key={index} className="mt-2">
          {paragraph}
        </p>
      );
    });
  };

  const downloadPDF = (type) => {
    const doc = new jsPDF();

    // Add logo or header
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text("Customer Support Analytics", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(new Date().toLocaleDateString(), 105, 28, { align: "center" });

    if (type === "faq") {
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("FAQ Analysis Report", 105, 20, { align: "center" });

      // FAQ Analysis content
      doc.setFontSize(12);
      const faqLines = doc.splitTextToSize(faqAnalysis, 180);
      doc.text(faqLines, 15, 30);

      // FAQ Table
      doc.autoTable({
        head: [["#", "Question", "Answer"]],
        body: faqData.map((faq, index) => [
          index + 1,
          faq.question,
          faq.answer,
        ]),
        startY: doc.previousAutoTable.finalY + 20,
        margin: { horizontal: 15 },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 70 },
          2: { cellWidth: 100 },
        },
      });

      doc.save("FAQ_Analysis_Report.pdf");
    } else if (type === "feedback") {
      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("Feedback Analysis Report", 105, 20, { align: "center" });

      // Feedback Analysis content
      doc.setFontSize(12);
      const feedbackLines = doc.splitTextToSize(feedbackAnalysis, 180);
      doc.text(feedbackLines, 15, 30);

      // Feedback Summary
      doc.setFontSize(14);
      doc.text(
        "Feedback Summary",
        15,
        doc.previousAutoTable?.finalY + 20 || 50
      );
      doc.autoTable({
        head: [["Sentiment", "Count", "Percentage"]],
        body: [
          [
            "Positive",
            categorizedFeedback.positive.length,
            `${Math.round(
              (categorizedFeedback.positive.length / feedbackData.length) * 100
            )}%`,
          ],
          [
            "Negative",
            categorizedFeedback.negative.length,
            `${Math.round(
              (categorizedFeedback.negative.length / feedbackData.length) * 100
            )}%`,
          ],
          [
            "Neutral",
            categorizedFeedback.neutral.length,
            `${Math.round(
              (categorizedFeedback.neutral.length / feedbackData.length) * 100
            )}%`,
          ],
        ],
        startY: doc.previousAutoTable?.finalY + 30 || 60,
        margin: { horizontal: 15 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 53, 147] },
      });

      doc.save("Feedback_Analysis_Report.pdf");
    } else {
      // Full report
      // FAQ Section
      doc.addPage();
      doc.setFontSize(16);
      doc.text("FAQ Analysis", 105, 20, { align: "center" });
      doc.setFontSize(12);
      const faqLines = doc.splitTextToSize(faqAnalysis, 180);
      doc.text(faqLines, 15, 30);

      // Feedback Section
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Feedback Analysis", 105, 20, { align: "center" });
      doc.setFontSize(12);
      const feedbackLines = doc.splitTextToSize(feedbackAnalysis, 180);
      doc.text(feedbackLines, 15, 30);

      doc.save("Full_Customer_Support_Report.pdf");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin text-blue-600 text-3xl" />
          <span className="text-lg text-gray-800">
            Analyzing customer data...
          </span>
        </div>
        <p className="mt-2 text-gray-600">Generating comprehensive insights</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav className="bg-blue-500 p-4 shadow-lg mt-10 mb-12 w-11/12 mx-auto">
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          {/* Full Report Button - top-right corner */}
          <button
            onClick={() => downloadPDF("full")}
            className="absolute top-4 right-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center"
          >
            <FiDownload className="mr-2" />
            Full Report
          </button>

          {/* Title and subtitle */}
          <h1 className="text-3xl font-bold">Customer Insights Dashboard</h1>
          <p className="mt-2 opacity-90">
            AI-powered analysis of FAQs and customer feedback
          </p>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex items-center px-6 py-4 font-medium ${
              activeTab === "faq"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiHelpCircle className="mr-2" />
            FAQ Analysis
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center px-6 py-4 font-medium ${
              activeTab === "feedback"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiMessageSquare className="mr-2" />
            Feedback Analysis
          </button>
        </div>

        <div className="p-6">
          {/* Download buttons */}
          <div className="flex space-x-4 mb-6">
            {/* <button
              onClick={() => downloadPDF("faq")}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
            >
              <FiDownload className="mr-2" />
              FAQ Report
            </button>
            <button
              onClick={() => downloadPDF("feedback")}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
            >
              <FiDownload className="mr-2" />
              Feedback Report
            </button> */}
            {/* <button
              onClick={() => downloadPDF("full")}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center"
            >
              <FiDownload className="mr-2" />
              Full Report
            </button> */}
          </div>

          {activeTab === "faq" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                FAQ Analysis
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-gray-700">
                  {formatAnalysisText(faqAnalysis)}
                </div>
              </div>

              <h4 className="text-xl font-semibold mb-3 text-gray-700">
                Current FAQ List
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Question
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Answer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {faqData.map((faq, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {faq.question}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {faq.answer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Feedback Analysis
              </h3>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-gray-700">
                  {formatAnalysisText(feedbackAnalysis)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Positive Feedback */}
                <div className="border border-green-200 rounded-lg overflow-hidden">
                  <div className="bg-green-100 px-4 py-2 flex items-center">
                    <FiThumbsUp className="text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">
                      Positive Feedback ({categorizedFeedback.positive.length})
                    </h4>
                  </div>
                  <div className="divide-y divide-green-100 max-h-96 overflow-y-auto">
                    {categorizedFeedback.positive.map((fb, index) => (
                      <div key={index} className="p-4 hover:bg-green-50">
                        <p className="font-medium text-gray-800">
                          {fb.subject}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {fb.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negative Feedback */}
                <div className="border border-red-200 rounded-lg overflow-hidden">
                  <div className="bg-red-100 px-4 py-2 flex items-center">
                    <FiThumbsDown className="text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-800">
                      Negative Feedback ({categorizedFeedback.negative.length})
                    </h4>
                  </div>
                  <div className="divide-y divide-red-100 max-h-96 overflow-y-auto">
                    {categorizedFeedback.negative.map((fb, index) => (
                      <div key={index} className="p-4 hover:bg-red-50">
                        <p className="font-medium text-gray-800">
                          {fb.subject}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {fb.message}
                        </p>
                        {fb.response && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            <span className="font-medium">Response:</span>{" "}
                            {fb.response}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Feedback */}
                <div className="border border-yellow-200 rounded-lg overflow-hidden">
                  <div className="bg-yellow-100 px-4 py-2 flex items-center">
                    <FiMeh className="text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-800">
                      Neutral Feedback ({categorizedFeedback.neutral.length})
                    </h4>
                  </div>
                  <div className="divide-y divide-yellow-100 max-h-96 overflow-y-auto">
                    {categorizedFeedback.neutral.map((fb, index) => (
                      <div key={index} className="p-4 hover:bg-yellow-50">
                        <p className="font-medium text-gray-800">
                          {fb.subject}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {fb.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqAndFeedbackReport;
