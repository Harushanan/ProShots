const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    faqtype:{type :String}
});

const faqModel = mongoose.model("faqSchema", faqSchema); 

module.exports = faqModel;
 