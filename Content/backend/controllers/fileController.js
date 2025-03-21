const File = require("../models/fileModel");
const cloudinary = require("../config/cloudinaryConfig");

// Upload file in Cloudinary and save in MongoDB
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "slider",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(req.file.buffer);
    });

    const file = new File({
      filename: req.file.originalname,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype.startsWith("image/") ? "image" : "video",
      publicId: result.public_id,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (err) {
    console.error("Error uploading file:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all files
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a file by ID
exports.deleteFile = async (req, res) => {
  try {
    
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const cloudinaryResponse = await cloudinary.uploader.destroy(file.publicId);
    if (cloudinaryResponse.result !== "ok") {
      return res
        .status(500)
        .json({ message: "Error deleting file from Cloudinary" });
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err.message);
    res.status(500).json({ error: err.message });
  }
};

