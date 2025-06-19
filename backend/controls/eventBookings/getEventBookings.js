const Booking = require('../../models/EventBookingModel');



const getEventBookings = async(req, res) => {
    try {
        const bookings = await Booking.find({status: "Pending"});
        res.status(201).json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error retriving bookings"});
    }
}

module.exports = getEventBookings; 
