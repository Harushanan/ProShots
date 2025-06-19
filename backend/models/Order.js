const mongoose = require("mongoose");

//  Order Schema Define பண்ணு
const orderSchema = new mongoose.Schema({
  userId: String,
  email: String,
  items: [
    { 
      productName: String,
      size: String,
      price: Number,
      quantity: Number,
      total: Number,
    } 
  ],
  design: {
    description: String,
    image: String,
  },
  paymentSlip: String,
  status: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
