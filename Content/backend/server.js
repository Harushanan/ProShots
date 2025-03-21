const express = require("express");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

//midleware
app.use(cors()); // http requests are allowed
app.use(express.json()); //incomping json data is added to req.body

// Use file routes
app.use("/api", fileRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
