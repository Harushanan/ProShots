const mongoose = require("mongoose");

const recoveryOrderSchema = new mongoose.Schema({
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
  status: String,
  orderDate: Date,
  deletedAt: { type: Date, default: Date.now },
});

const RecoveryOrder = mongoose.model("RecoveryOrder", recoveryOrderSchema);
module.exports = RecoveryOrder;
