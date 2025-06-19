const mongoose = require('mongoose');
const eventBookingModel = require('../models/EventBookingModel');
const sendEmail = require('./mailService');
const cron = require('node-cron');


const automatedReminder = () => {
    cron.schedule('15 8 * * *', async() => {
        console.log('Running daily event reminder check...');
        try {
            const myBookings = await eventBookingModel.find({status: "Accepted"});

            const today = new Date();
            const threeDaysLater = new Date(today);
            threeDaysLater.setDate(today.getDate() + 4);

            myBookings.forEach((event) => {
                const eventDate = new Date(event.eventDate);
                const to = event.email;
                const clientname = event.clientName;
                const eventtype = event.eventType;
                const eventlocation = event.location;

                if (eventDate.toDateString() === threeDaysLater.toDateString()) {
                    let emailSubject = `Your ${eventtype} Event Booking is Confirmed!`;
                    let emailText = `
                        Dear ${clientname},  

                        We are excited to remind you that your **${eventtype}** event is coming up in just 3 days! 🎉

                        **Location:** ${eventlocation}  
                        **Date:** ${eventDate.toISOString().split("T")[0]}

                        We are getting everything ready to make your day truly unforgettable.  
                        Thank you for choosing **ProShots Studio**!

                        Warm regards,  
                        [ProShots Studio Team]
                    `;

                    sendEmail(to, emailSubject, emailText);
                }
            });
        } catch (error) {
            console.log(error);
        }
    } , {
        timezone: 'Asia/Colombo' // optional but recommended for accuracy
    });
}


module.exports = automatedReminder;  