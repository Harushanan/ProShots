const mongoose = require('mongoose');
const eventBookingModel = require('../../models/EventBookingModel');

const getMyBookings = async(req, res) => {
    const {email} = req.params;
    try {
        const myBookings = await eventBookingModel.find({email: email});
        if (!myBookings || myBookings.length === 0) {
            return res.status(404).json({ success: false, message: "Bookings not found." });
        }
        res.status(200).json({success:true, data: myBookings});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Fetch booking failed."});
    }
}

module.exports = getMyBookings;  