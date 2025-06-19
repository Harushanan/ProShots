const mongoose = require("mongoose");


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



const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    
  },
  price: {
    type: Number,
    required: true,
  },
});

const itemCartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sizes: [sizeSchema],
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ItemCart = mongoose.model("itemsCart", itemCartSchema);
const Item = mongoose.model("items", ItemSchema);
module.exports = {Item, ItemCart};