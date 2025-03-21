const mongoose = require('mongoose');
const deliveryschema = new mongoose.Schema({
    date:String,
    prodect:String,
    quantity:Number,
    adress:String,
    phone:Number,
})
const deliverymodel = mongoose.model('delivery', deliveryschema);

module.exports = deliverymodel;