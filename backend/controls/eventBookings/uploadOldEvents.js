const OldEventSchema = require('../../models/uploadOldEventSchema');

const uploadOldEvents = async (req, res) => {
        try {
            console.log("2");
            const newEvent = new OldEventSchema({
                ClientName: req.body.ClientName,
                Description: req.body.Description,
                Place: req.body.Place,
                EventType: req.body.EventType,
                EventURLs: req.body.EventURLs.map(urls => ({ url : urls}))
            });
            console.log("3");

            await newEvent.save();

            res.status(200).json({
                success: true,
                message: "Upload Successful",
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ 
                success: false, 
                message: "Some error occurred" 
            });
        }
};

module.exports = uploadOldEvents;
