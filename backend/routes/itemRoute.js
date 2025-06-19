const express = require("express");
const { getAllItems, getItemById, createItem, updateItem, deleteItem, updateOrderQuantityItem } = require("../controls/inventory/itemController");
const router = express.Router();


router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);
router.put("/:name/order_quantity", updateOrderQuantityItem); 


module.exports = router;
