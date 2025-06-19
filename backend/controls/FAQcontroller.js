const express = require("express");
const faqModel = require("../models/faqModel");

//------------ Display Faq --------//

const displayfaq = async (req, res) => { 
    try {
        const faqs = await faqModel.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching FAQs" });
    }
};

//------------ Submit FAQ Customer--------//
const submitfaq = async (req, res) => {
    const { question, category } = req.body;
    console.log("req.body");
    try {
        await faqModel.create({ question: question, faqtype: category });
        res.json({ message: "faqsubmit" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit FAQ" });
    }
};

//------------Admin delte FAQ --------//
const deletefaq =  async (req, res) => {
    try {
        console.log("I am")
      const { faqId } = req.params;
      const result = await faqModel.findByIdAndDelete(faqId);
      console.log("Find Result : ", result);

      res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting FAQ" });
    }
  };

  //------------Admin Answred or Update  FAQ --------//
  const updatefaq = async (req, res) => {
    console.log("Received Update Request:", req.params.id, req.body);
    
    const { answer, faqtype, question } = req.body;
    try {
        const updateData = {};
        if (answer) updateData.answer = answer;
        if (faqtype) updateData.faqtype = faqtype;
        if (question) updateData.question = question;

        const updatedFaq = await faqModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
       
        res.json({ message: "updated successfully", faq: updatedFaq });
    } catch (error) {
        console.error("Error updating answer:", error);
        res.status(500).json({ error: "Failed to update answer" });
    }
};




module.exports = {displayfaq , submitfaq , deletefaq , updatefaq};
