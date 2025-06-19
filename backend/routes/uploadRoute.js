// routes/uploadRoute.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Message = require("../models/Message");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 Received upload:", req.file);
    const { sender, userId } = req.body;

    const newMessage = new Message({
      text: req.file.path,
      sender,
      userId,
      status: "sent",
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();
    io.emit("receive_message", savedMessage);

    res.status(200).json({ success: true, fileUrl: req.file.path });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

module.exports = router;