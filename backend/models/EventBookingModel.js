const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    address: {
        type: String,
        required: true 
    },
    eventType: {
        type: String, 
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    guestCount: {
        type: Number,
        required: true
    },
    budgetRange: {
        type: Number,
        required: true
    },
    knowUs: {
        type: String,
        required: true
    },
    videography: {
        type: String,
        required: true
    },
    drone: {
        type: String,
        required: true
    },
    live: {
        type: String,
        required: true
    },
    terms: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }
});

BookingSchema.index({ email: 1, eventDate: 1 , eventType: 1}, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);

