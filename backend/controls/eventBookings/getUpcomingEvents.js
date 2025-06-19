const Booking = require('../../models/EventBookingModel');


const getUpcomingEvents = async(req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const bookings = await Booking.find({status:"Accepted", eventDate: { $gt: today } })
        res.status(200).json(bookings);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error Fetching details"})
    }
}

module.exports = getUpcomingEvents;
 