const sendEmail = require('../../config/mailService');
const Booking = require('../../models/EventBookingModel');

const updateEventBooking = async (req, res) => {
    const bookingId = req.params._id;
    const to = req.params.email;
    const amount = req.params.amount;
    const { status, clientName, eventDate, eventType, eventLocation } = req.body;
     
    try { 
        const updateBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: status, budgetRange: amount },
            { new: true }
        );

        if (!updateBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        let emailSubject = "";
        let emailText = "";

        console.log("receiver :", to);
        if (status == "Accepted") {
            emailSubject = `Your ${eventType} Event Booking is Confirmed!`;
            emailText = `
                Dear ${clientName}, 

                We are excited to inform you that your booking for **${eventType}** on  🌟${eventDate}🌟  at  ✨${eventLocation}✨  has been confirmed! 🎉

                Our team will reach out to you soon to discuss further details.

                Thank you for choosing us! Looking forward to making your event special.  

                Best regards,  
                [ ProShots Studio ]
            `;
            console.log("Booking Accepted");
        } else if (status == "Rejected") {
            emailSubject = `Booking Request for ${eventType} Event is Rejected.`;
            emailText = `
                Dear ${clientName}, 

                Unfortunately, we are unable to accommodate your **${eventType}** booking request on  🌟${eventDate}🌟  at  ✨${eventLocation}✨,  because another event has already been booked on that date. 

                We apologize for the inconvenience and hope to assist you in the future with another event.  

                Best regards,  
                [ ProShots Studio ]
            `;
            console.log("Booking Rejected");
        }

        if (emailSubject && emailText) {
            await sendEmail(to, emailSubject, emailText);
        }

        res.status(200).json({
            success: true,
            message: 'Updated successfully',
            data: updateBooking,
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
        });
    }
};

module.exports = updateEventBooking;
