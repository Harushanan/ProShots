

const mongoose = require("mongoose");

// Define the Item schema and model
const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    current_quantity: {
      type: Number,
      required: true,
    },
    order_quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("items", ItemSchema);

module.exports = Item;