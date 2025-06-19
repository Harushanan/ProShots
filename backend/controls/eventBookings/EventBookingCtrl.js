const Booking = require('../../models/EventBookingModel');


const EventBookings = async(req, res) => {
    const {userEmail, clientName, phoneNumber, address, eventType, eventDate, location, duration, guestCount, budgetRange, knowUs, videography, drone, live, terms, status} = req.body;


    try {
        const existing = await Booking.findOne({userEmail, eventType, eventDate});

        if( existing ) {
            return res.status(400).json({
                success: false,
                message: 'You have already booked for the same event.'
            }); 
        }

        const newBooking = new Booking({ userEmail, clientName, phoneNumber, email:userEmail, address, eventType, eventDate, location, duration, guestCount, budgetRange, knowUs, videography, drone, live, terms, status});

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.log(error);
        res.status(500);
    }

}

module.exports = EventBookings; 