const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  API Routes

  
app.use("/", orderRoutes);

app.get("/", (req, res) => res.send("API Running 🚀"));

//  Server Start பண்ணும்
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
