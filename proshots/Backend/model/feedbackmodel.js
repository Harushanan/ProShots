const mongoose = require('mongoose');
const feedbackschema = new mongoose.Schema({
    date:String,
    reporttype:String,
    file:String,
    subject:String,
    message:String,
})
const feedbackmodel = mongoose.model('feedback', feedbackschema);

module.exports = feedbackmodel;