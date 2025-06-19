const Message = require("../models/Message");

const onlineUsers = new Set();

module.exports = function (io) {
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

        // Simple bot response logic
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

    socket.on("get_users", async () => {
      try {
        const users = await Message.distinct("userId");
        socket.emit("user_list", users);
      } catch (err) {
        console.error("❌ Error getting users:", err);
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
};
 