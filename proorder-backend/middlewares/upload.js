const multer = require("multer");
const path = require("path");

//  Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save Images in "uploads/" Folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename File
  },
});

//  Upload Middleware
const upload = multer({ storage });

module.exports = upload;
