const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/CustomerRelation');
const {displayfaq , submitfaq , deletefaq , updatefaq} = require('../controls/FAQcontroller');



//-------- FAQ Mangement Routes ------------------//
router.get('/displayfaq', displayfaq);
router.post('/submitfaq', submitfaq);
router.delete('/deletefaq/:faqId', deletefaq);
router.put('/updatefaq/:id', updatefaq);
//------------------------------------------------//

module.exports = router;

 


router.post("/feedback", async (req, res) => {
    const { date, type, subject, message, status } = req.body;
    try{
        const newFeedBack = new FeedbackModel({ date, type, subject, message, status });
        await newFeedBack.save();
        res.status(201).json(newFeedBack);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

router.get("/feedback", async (req, res) => {
    try {
      const feedbacks = await FeedbackModel.find();  // Retrieve all feedbacks from the database
      res.status(200).json(feedbacks);  // Send the feedback data as a response
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching feedbacks", error: error.message });
    }
});


router.delete('/feedback/:id', async (req, res) => {
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
  });
  
  


module.exports = router;
 