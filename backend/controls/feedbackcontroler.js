const express = require("express");
const FeedbackModel =require ("../models/CustomerRelation.js");
const { post } = require("../routes/CustomerRelation");
const router = express.Router();

const postFeedback =  async (req, res) =>  {
    const { date, type, subject, message, status } = req.body;
    try{
        const newFeedBack = new FeedbackModel({ date, type, subject, message,status });
        await newFeedBack.save();
        res.status(201).json(newFeedBack);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}
const updateFeedback =  async (req, res) => {
  const { id } = req.params;
  const { date, type, subject, message,status } = req.body;
  
  try {
    // Find the feedback by ID and update the rate
    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      id,
      { date, type, subject, message,status });
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(updatedFeedback);  // Send the updated feedback as a response
  } catch (error) {
    console.error("Error updating rate:", error);
    res.status(500).json({ message: "Error updating rate" });
  }
}


const getFeedback =  async (req, res) =>  {
    try {
      const feedbacks = await FeedbackModel.find();  // Retrieve all feedbacks from the database
      res.status(200).json(feedbacks);  // Send the feedback data as a response
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching feedbacks", error: error.message });
    }
};



const deleteFeedback =  async (req, res) =>  {
    try {
      const { id } = req.params;
  
      // Find and delete the feedback by ID
      const feedback = await FeedbackModel.findByIdAndDelete(id);
  
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
  
      res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({ message: 'Error deleting feedback' });
    }
  };

  module.exports ={postFeedback , getFeedback , deleteFeedback , updateFeedback};