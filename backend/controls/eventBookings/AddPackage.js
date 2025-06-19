const mongoose = require('mongoose');
const Package = require('../../models/Package');
const AddPackage = async (req, res) => {
  try {
    const {
      packageHead,
      packageSubhead,
      price,
      sessionPeriod,
      noOfCameraman,
      photoCount,
      albumDetails
    } = req.body;

    const newPackage = new Package({
      packageHead,
      packageSubhead,
      price,
      sessionPeriod,
      noOfCameraman,
      photoCount,
      albumDetails
    });

    await newPackage.save();

    res.status(201).json({ message: "Package created successfully." });

  } catch (error) {
    console.error("Create Package Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = AddPackage