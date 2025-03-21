const Item = require("../models/itemModel"); // Import the Item model

// Get all items
async function getAllItems(req, res) {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items", details: err });
  }
}

// Get item by ID
async function getItemById(req, res) {
  const { id } = req.params;
  console.log("ID", id);
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error fetching item", details: err });
  }
}

// Create new item
async function createItem(req, res) {
  const { name, price, current_quantity } = req.body;

  console.log("Received data:", req.body); // Log received data to check the values

  if (!name || !price || current_quantity === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newItem = new Item({
      name,
      price,
      current_quantity, // Ensure correct field mapping
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error("Error creating item", err);
    res.status(500).json({ error: "Error creating item", details: err });
  }
}

// Update item
async function updateItem(req, res) {
  const { id } = req.params;
  const { name, price, current_quantity } = req.body;
  console.log("Received data:", req.body);
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, price, current_quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: "Error updating item", details: err });
  }
}

// Delete item
async function deleteItem(req, res) {
  const { id } = req.params;
  console.log("ID", id);
  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting item", details: err });
  }
}

// Update order quantity for an item
async function updateOrderQuantityItem(req, res) {
  const { name } = req.params;
  const { price, current_quantity, order_quantity } = req.body;

  try {
    const updatedItem = await Item.findOneAndUpdate(
      { name }, // Find by name or use _id if needed
      { price, current_quantity, order_quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: "Error updating item", details: err });
  }
};



module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateOrderQuantityItem,
};
