require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Groq } = require("groq-sdk");
const Joi = require("joi");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require("./routes/Bookingroute");
const { createPermanentAdmin } = require("./models/usertable");
const userRoutes = require("./routes/userRoutes");
const itemsRoutes = require("./routes/itemRoute");
const itemCartRoute = require("./routes/itemCartRoute");
const orderRouter = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const feedbackRoutes = require("./routes/CustomerRelation");
const path = require("path");

// Initialize Express app
const app = express();

// Middleware setup
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies (important!)
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Initialize Groq API
if (!process.env.GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY environment variable");
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://Thananchayan:Thanu2002@cluster0.oxle4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Mongodb Connected.");
    createPermanentAdmin();
  })
  .catch((e) => {
    console.log(e);
  });

// Input validation for analysis endpoint
const analysisSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productName: Joi.string().required(),
        price: Joi.number().min(0).required(),
        size: Joi.string().optional(),
        quantity: Joi.number().min(1).required(),
        date: Joi.string().isoDate().required(),
      })
    )
    .required(),
  selectedMonth: Joi.string()
    .pattern(/^[A-Za-z]+\s\d{4}$/)
    .required(),
  view: Joi.string().valid("quantity", "price").required(),
});

// Analysis endpoint
app.post("/analyze", async (req, res) => {
  try {
    const { error, value } = analysisSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { products, selectedMonth, view } = value;

    const monthData = products.filter((p) => {
      const productMonth = new Date(p.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      return productMonth === selectedMonth;
    });

    if (monthData.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the selected month" });
    }

    const totalQuantity = monthData.reduce((sum, p) => sum + p.quantity, 0);
    const totalRevenue = monthData.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    const prompt = `Analyze sales data for ${selectedMonth} (focus: ${view}):
Products: ${JSON.stringify(monthData, null, 2)}
Total: ${view === "quantity" ? totalQuantity + " units" : "$" + totalRevenue}

Provide:
1. Performance summary
2. Top/underperforming products
3. 3 recommendations
4. Notable trends`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({
      analysis: response.choices[0]?.message?.content,
      summary: { totalQuantity, totalRevenue, productCount: monthData.length },
    });
  } catch (err) {
    console.error("Groq API Error:", err);
    const errorMsg = err.message.includes("429")
      ? "Rate limit exceeded (30 RPM)"
      : err.message;
    res.status(500).json({ error: "Analysis failed", details: errorMsg });
  }
});

// Routes
app.use("/cart", itemCartRoute);
app.use("/items", itemsRoutes);
app.use("/api", router);
app.use("/deliveries", deliveryRoutes);
app.use("/pro", feedbackRoutes);
app.use(userRoutes);
app.use("/", orderRouter);

app.post("/analyze/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 800,
    });
    res.json({ analysis: response.choices[0]?.message?.content });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze prompt" });
  }
});

// Root
app.get("/", (req, res) => res.send("API Running 🚀"));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
});
