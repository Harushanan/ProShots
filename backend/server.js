const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/Bookingroute');
const { createPermanentAdmin } = require('./models/usertable');
const userRoutes = require('./routes/userRoutes');
require("dotenv").config();
const itemsRoutes = require("./routes/itemRoute"); 
const itemCartRoute = require("./routes/itemCartRoute"); 
const path = require("path");
const orderRouter = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const feedbackRoutes = require('./routes/CustomerRelation');
const automatedReminder = require('./config/automatedReminder');
const Joi = require("joi");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const imageSearchRoutes = require("./routes/imageSearchRoute");
const { Groq } = require("groq-sdk");
const multer = require('multer');
const Message = require("./models/Message");



mongoose.connect(
    'mongodb+srv://Thananchayan:Thanu2002@cluster0.oxle4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
).then(() => {
    console.log('Mongodb Connected.');
    createPermanentAdmin();
    automatedReminder();
}).catch((e) => {
    console.log(e);
})



const app = express();
const PORT = process.env.PORT || 5000;


// 1. SECURITY & ESSENTIAL MIDDLEWARE (FIRST)
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));


// 5. GROQ INITIALIZATION
if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY environment variable");
    process.exit(1);
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
 

app.use(
    cors({
        origin: ["http://localhost:5173" , "https://res.cloudinary.com"],
        methods : ['POST', 'GET', 'PUT', 'DELETE'],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials : true
    }
));




app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/cart", itemCartRoute);
app.use("/items", itemsRoutes); 
app.use('/api', router);
app.use("/deliveries", deliveryRoutes);
app.use("/pro", feedbackRoutes);
app.use(userRoutes);
app.use("/", orderRouter);
app.use("/api", imageSearchRoutes); 


   
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
        model: "llama3-70b-8192",
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
  
  // =============================================
  // 8. ERROR HANDLING (LAST MIDDLEWARE)
  // =============================================
  app.use((err, req, res, next) => {
    console.error("Error:", err);
    if (err.type === "entity.too.large") {
      return res.status(413).json({
        success: false,
        error: "File too large. Maximum size is 50MB",
      });
    }
    res.status(500).json({ success: false, error: "Server error" });
  });

  app.get("/", (req, res) => res.send("API Running 🚀"));




  const http = require("http");
const socketIO = require("socket.io");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;


// Server & Socket Setup
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Track online users
const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("user_connected", (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    io.emit("update_online_users", Array.from(onlineUsers));
  });

  socket.on("get_history", async (userId) => {
    try {
      const messages = await Message.find({ userId }).sort({ timestamp: 1 });
      socket.emit("chat_history", messages);
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        text: data.text,
        sender: data.sender,
        userId: data.userId,
        status: "sent",
        timestamp: new Date(),
      });
      const savedMessage = await newMessage.save();
      io.emit("receive_message", savedMessage);

      if (data.sender === "user") {
        const userText = data.text.toLowerCase().trim();
        let botReply = "";

        if (["hi", "hello"].includes(userText)) {
          botReply = "🎉 Welcome to ProShots! How can I assist you today?";
        } else if (userText === "yes") {
          botReply = "❓ Please choose your issue:\n1️⃣ Order-related problem\n2️⃣ Event booking issue";
        } else if (userText.includes("order")) {
          botReply = "📦 What kind of order issue are you facing?\n1️⃣ Design problem\n2️⃣ Payment issue\n3️⃣ Order change\n4️⃣ Delivery issue";
        } else if (userText.includes("design")) {
          botReply = "✏️ Please upload or send your design file here. We'll review it and confirm.";
        } else if (userText.includes("payment")) {
          botReply = "💰 Please wait while our admin reviews your payment issue.";
        } else if (userText.includes("change") || userText.includes("quantity") || userText.includes("size")) {
          botReply = "🔄 Thanks for the update! Your change request has been noted.";
        } else if (userText.includes("delivery")) {
          botReply = "🚚 What delivery issue are you facing?";
        } else if (userText.includes("delay") || userText.includes("address") || userText.includes("damaged")) {
          botReply = "🕒 Thanks! Delivery issue received. Admin will check.";
        } else if (userText.includes("event")) {
          botReply = "📅 Event issue noted. Admin will respond shortly.";
        } else if (userText.includes("thanks") || userText.includes("thank")) {
          botReply = "🙏 You're welcome!";
        } else if (userText.includes("price") || userText.includes("cost")) {
          botReply = "💰 Please tell us which service you need a price for.";
        } else if (userText.includes("location")) {
          botReply = "📍 We're at [Business Address]. Need directions?";
        } else {
          botReply = "✅ Message received! Our admin will respond shortly.";
        }

        const botMessage = new Message({
          text: botReply,
          sender: "admin",
          userId: data.userId,
          status: "sent",
          timestamp: new Date(),
        });

        const savedBot = await botMessage.save();
        io.emit("receive_message", savedBot);
      }
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  });

  socket.on("get_users", async () => {
    try {
      const users = await Message.distinct("userId");
      socket.emit("user_list", users);
    } catch (err) {
      console.error("❌ Error getting users:", err);
    }
  });

  socket.on("admin_send_message", async (data) => {
    try {
      const newMessage = new Message({
        text: data.text,
        sender: "admin",
        userId: data.userId,
        status: "sent",
        timestamp: new Date(),
      });
      const saved = await newMessage.save();
      io.emit("receive_message", saved);
    } catch (err) {
      console.error("❌ Error sending admin message:", err);
    }
  });

  socket.on("mark_seen", async () => {
    try {
      await Message.updateMany({ status: "sent" }, { $set: { status: "seen" } });
    } catch (err) {
      console.error("❌ Error updating seen status:", err);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("update_online_users", Array.from(onlineUsers));
    }
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Cloudinary Setup for Upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_uploads",
    allowed_formats: ["jpg", "png", "pdf", "mp3", "webm"],
  },
});

const upload = multer({ storage });

app.post("/chat/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 Received upload:", req.file);
    const { sender, userId } = req.body;

    const newMessage = new Message({
      text: req.file.path,
      sender,
      userId,
      status: "sent",
      timestamp: new Date(),
    });8

    const savedMessage = await newMessage.save();
    io.emit("receive_message", savedMessage);

    res.status(200).json({ success: true, fileUrl: req.file.path });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});



server.listen(PORT, () => {
    console.log('Server is running on PORT '+PORT);
    
})