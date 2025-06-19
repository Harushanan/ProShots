const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controls/inventory/cartItemController");
const upload = require("../config/multerConfig"); 

const router = express.Router();

router.post("/add", upload.single("image"), addProduct);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
