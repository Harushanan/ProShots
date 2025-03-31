const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const upload = require("../middlewares/upload");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

//  Email Notification Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Set in .env
    pass: process.env.EMAIL_PASS, // Set in .env
  },
});

// ✅ Upload Image to Cloudinary (for Design & Payment Slip)
const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // Remove local file after upload
    return result.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

//  Fetch Single Order by ID (Admin View)
router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found!" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order details", error: err });
  }
});

// Upload Design Image
router.post("/upload-design", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  const imageUrl = await uploadToCloudinary(req.file.path, "proorder/designs");
  if (!imageUrl) return res.status(500).json({ message: "Failed to upload design image" });

  res.status(200).json({ success: true, imageUrl });
});

//  Upload Payment Slip Image
router.post("/upload-payment-slip", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  const imageUrl = await uploadToCloudinary(req.file.path, "proorder/payment_slips");
  if (!imageUrl) return res.status(500).json({ message: "Failed to upload payment slip" });

  res.status(200).json({ success: true, imageUrl });
});

// Confirm Order API (Frontend Confirms & Saves in DB)
router.post("/confirm-order", async (req, res) => {
  try {
    const { userId, email, items, design, paymentSlip } = req.body;
    if (!userId || !email || !items || !design || !paymentSlip) {
      return res.status(400).json({ message: "Missing order details!" });
    }

    const newOrder = new Order({
      userId,
      email,
      items,
      design, // Already Cloudinary URL
      paymentSlip, // Already Cloudinary URL
      status: "Pending",
      orderDate: new Date(),
    });

    await newOrder.save();

    // Send Order Confirmation Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      text: `Your order has been placed successfully! Order ID: ${newOrder._id}`,
    });

    res.status(201).json({ message: "Order Confirmed!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error saving order", error: err });
  }
});

// Fetch User's Orders
router.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders.length) return res.status(404).json({ message: "No orders found!" });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

// Fetch All Orders for Admin
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

//  Update Order Status
router.put("/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    //  Send Email Notification to User
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Order Status Updated - ${status}`,
      text: `Your order with ID ${order._id} has been updated to '${status}'.`,
    });

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err });
  }
});

//  Delete Order (Moves to Recovery DB)
router.delete("/order/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    //  Move Order to Recovery DB
    const RecoveryOrder = require("../models/RecoveryOrder");
    await RecoveryOrder.create(order.toObject());

    // Send Deletion Email to User
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: "Order Deleted",
      text: `Your order with ID ${order._id} has been deleted by the admin.`,
    });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err });
  }
});

module.exports = router;
