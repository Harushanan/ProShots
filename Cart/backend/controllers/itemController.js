const cloudinary = require("../config/cloudinaryConfig");
const Item = require("../models/itemModel");

// Add new product
const addProduct = async (req, res) => {
  try {
    const { name, sizes } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file; // This is the uploaded image file

    // Convert the buffer to a base64-encoded string
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    // Upload the base64-encoded image to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: "auto", // Auto-detect the resource type (e.g., image, video, etc.)
      folder: "uploads", // Specify the folder name
    });

    // Create a new item
    const newItem = new Item({
      name,
      sizes: JSON.parse(sizes), // Parse the sizes array from the client
      image: result.secure_url, // Get the secure URL of the image
    });

    // Save the new item to the database
    await newItem.save();

    res.status(200).json({
      message: "Product added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};


// Get all products
const getAllProducts = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { name, sizes } = req.body;

    // Find product by ID
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields
    item.name = name || item.name;

    // Validate and parse sizes if provided
    if (sizes) {
      let parsedSizes;
      try {
        parsedSizes = JSON.parse(sizes); // Parse the sizes array
      } catch (error) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }

      // Validate each size object
      for (const sizeObj of parsedSizes) {
        if (typeof sizeObj.price !== "number" || isNaN(sizeObj.price)) {
          return res
            .status(400)
            .json({ message: "Invalid price value in sizes" });
        }
      }

      item.sizes = parsedSizes; // Update the sizes array
    }

    // Handle image update if a new image is uploaded
    if (req.file) {
      // Convert the buffer to a base64-encoded string
      const base64Data = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: "uploads", // Specify the folder name
      });

      item.image = result.secure_url; // Update the image URL
    }

    // Save the updated product to the database
    await item.save();

    res.status(200).json({
      message: "Product updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};
// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the image from Cloudinary
    if (item.image) {
      const publicId = item.image
        .split("/")
        .slice(-2, -1)
        .concat(item.image.split("/").pop().split(".")[0])
        .join("/");
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the product from the database
    await Item.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
