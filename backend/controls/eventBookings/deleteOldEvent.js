const EventBookingModel = require("../../models/uploadOldEventSchema");


const deleteOldEvent = async(req, res) => {
    const eventId = req.params.id;
    console.log("Event ID : ", eventId)
    try {
        const deleteEvent = await EventBookingModel.findByIdAndDelete(eventId);
        
        if (!deleteEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Deleted successfully',
            data: deleteEvent 
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error delete booking'
        })
    }
}

module.exports = deleteOldEvent;
