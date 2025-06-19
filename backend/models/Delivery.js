const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  { 
    userId: { type: String, required: true }, // Example: user email
    orderId: { type: String, required: true }, // Example: ORD12345
    deliveryType: { type: String, required: true }, // Online / Normal
    location: {
      lat: Number,
      lng: Number,
    },
    address: String,
    formattedAddress: String,
    deliveryFee: Number,
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true } // ✅ This auto-generates createdAt & updatedAt
);

module.exports = mongoose.model("Delivery", deliverySchema);
