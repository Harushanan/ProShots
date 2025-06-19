const uploadOldEventSchema = require('../../models/uploadOldEventSchema');


const getSpecificEvent = async(req, res) => {
    const eventId = req.params.id;
    try {
        const eventDetails = await uploadOldEventSchema.findById(eventId);

        if (!eventDetails) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event Booking Retrived.",
            data: eventDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error retriving events."
        })
    }
}

module.exports = getSpecificEvent;