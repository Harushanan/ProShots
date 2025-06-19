const uploadOldEventsSchema = require('../../models/uploadOldEventSchema');


const getOldEvents = async(req, res) => {
    try {
        const oldEvents = await uploadOldEventsSchema.find();

        res.status(200).json({
            success: true,
            data: oldEvents
        })
    } catch (error) { 
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occured wile fetching."
        })
    }
}

module.exports = getOldEvents;
