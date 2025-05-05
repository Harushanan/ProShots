const express = require('express');
const EventBookings = require('../controls/eventBookings/EventBookingCtrl');
const getEventBookings = require('../controls/eventBookings/getEventBookings');
const updateEventBooking = require('../controls/eventBookings/updateEventBooking');
const uploadOldEvents = require('../controls/eventBookings/uploadOldEvents');
const getOldEvents = require('../controls/eventBookings/getOldEvents');
const getSpecificEvent = require('../controls/eventBookings/getSpecificEvent');
const getUpcomingEvents = require('../controls/eventBookings/getUpcomingEvents');
const deleteOldEvent = require('../controls/eventBookings/deleteOldEvent');
const { uploadFile, getFiles, deleteFile } = require('../controls/content/fileController');
const router = express.Router();
const fileController = require("../controls/content/fileController");
const upload = require("../config/multerConfig"); 

router.get('/getbookings', getEventBookings);
router.post('/bookings', EventBookings);
router.put('/updatebookings/:_id/:email', updateEventBooking);
router.post('/oldEvents', uploadOldEvents);
router.get('/getOldEvents', getOldEvents);
router.get('/getUpcomingBookings', getUpcomingEvents);
router.get('/getSpecificEvent/:id', getSpecificEvent);
router.delete('/deleteOldEvent/:id', deleteOldEvent)



router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/files", fileController.getFiles);
router.delete("/file/:id", fileController.deleteFile);




 
module.exports = router; 