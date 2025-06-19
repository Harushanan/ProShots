const express = require('express');
const router = express.Router();
const{postFeedback , getFeedback , deleteFeedback , updateFeedback} = require('../controls/feedbackcontroler');
const {displayfaq , submitfaq , deletefaq , updatefaq} = require('../controls/FAQcontroller');



//-------- FAQ Mangement Routes ------------------//
router.get('/displayfaq', displayfaq);
router.post('/submitfaq', submitfaq);
router.delete('/deletefaq/:faqid', deletefaq);
router.put('/updatefaq/:id', updatefaq);
router.get('/displayfaq/:id', displayfaq);

//-----------------Feedback Routes-----------------//
router.get('/feedback', getFeedback);
router.delete('/feedback/:id', deleteFeedback);
router.put('/feedback/:id', updateFeedback);
router.post('/feedback', postFeedback);



module.exports = router;