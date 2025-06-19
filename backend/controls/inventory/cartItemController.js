const cloudinary = require("../../config/cloudinaryConfig");
const { ItemCart } = require("../../models/itemModel");

// Add new product
const addProduct = async (req, res) => {
  try {
    const { name, sizes } = req.body;

    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file; 

    
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    
    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: "auto", 
      folder: "uploads", 
    });

  
    const newItem = new ItemCart({
      name,
      sizes: JSON.parse(sizes), 
      image: result.secure_url, 
    });

  
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
    const items = await ItemCart.find();
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
    const item = await ItemCart.findById(req.params.id);
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

    
    const item = await ItemCart.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    item.name = name || item.name;

    
    if (sizes) {
      let parsedSizes;
      try {
        parsedSizes = JSON.parse(sizes); 
      } catch (error) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }

      
      for (const sizeObj of parsedSizes) {
        if (typeof sizeObj.price !== "number" || isNaN(sizeObj.price)) {
          return res
            .status(400)
            .json({ message: "Invalid price value in sizes" });
        }
      }

      item.sizes = parsedSizes; 
    }

    
    if (req.file) {
      
      const base64Data = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: "uploads", 
      });

      item.image = result.secure_url; 
    }

    
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
    const item = await ItemCart.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    if (item.image) {
      const publicId = item.image
        .split("/")
        .slice(-2, -1)
        .concat(item.image.split("/").pop().split(".")[0])
        .join("/");
      await cloudinary.uploader.destroy(publicId);
    }

    
    await ItemCart.deleteOne({ _id: req.params.id });

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
