const mongoose = require('mongoose');


const uploadOldEventSchema = new mongoose.Schema({

        ClientName: {
            type: String,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        Place: {
            type: String,
            required: true
        },
        EventType: {
            type: String,
            required: true
        },
        EventURLs: [{
            url: {
                type: String,
                required: true
            }
        }]
        
})

module.exports = mongoose.model("uploadOldEventSchema", uploadOldEventSchema );

