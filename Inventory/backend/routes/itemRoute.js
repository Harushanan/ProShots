const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateOrderQuantityItem,
} = require("../controllers/itemController");

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.put("/:name/order_quantity", updateOrderQuantityItem); // Use name in the URL path


module.exports = router;
