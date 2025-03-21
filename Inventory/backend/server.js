const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Import MongoDB connection & model

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON requests

// Routes
const itemsRoutes = require("./routes/itemRoute"); // Import the routes correctly

app.use("/items", itemsRoutes); // Use the 'items' route

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
