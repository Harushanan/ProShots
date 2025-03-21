const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/itemController");
const upload = require("../config/multerConfig"); // Assuming multer configuration is set up correctly

const router = express.Router();

// Route for adding a new product
router.post("/add", upload.single("image"), addProduct);

// Route for getting all products
router.get("/", getAllProducts);

// Route for getting a product by ID
router.get("/:id", getProductById);

// Route for updating a product by ID
router.put("/:id", upload.single("image"), updateProduct);

// Route for deleting a product by ID
router.delete("/:id", deleteProduct);

module.exports = router;
