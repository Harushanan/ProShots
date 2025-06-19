const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "sent" }
});

module.exports = mongoose.model("Message", messageSchema); // ✅ RIGHT PLACE
