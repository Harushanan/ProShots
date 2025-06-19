const express = require("express");
const Delivery = require("../models/Delivery");

const router = express.Router();

// ✅ POST: Save a Delivery (already added)
router.post("/", async (req, res) => {
  try {
    const { userId, deliveryType, location, address, formattedAddress, deliveryFee } = req.body;

    const newDelivery = new Delivery({
      userId,
      orderId: "ORD" + Math.floor(Math.random() * 100000),
      deliveryType,
      location,
      address,
      formattedAddress,
      deliveryFee,
    });

    await newDelivery.save();
    res.status(201).json({ message: "Delivery order saved!", delivery: newDelivery });
  } catch (err) {
    console.error("Error saving delivery:", err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});


// ✅ GET: All Deliveries (for Admin Panel)
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});


// ✅ PUT: Update Status (Admin changes pending → delivered)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Delivery.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Delivery not found" });

    res.json({ message: "Status updated!", delivery: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

module.exports = router;