const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now }, // Stores proper Date format
    type: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Normal" },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

module.exports = FeedbackModel;