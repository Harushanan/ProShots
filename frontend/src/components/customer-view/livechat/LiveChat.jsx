import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import ProshotsLogo from "@/assets/pro.png";
import dingSound from "@/sounds/ding-101492.mp3";
import VoiceRecorder from "./VoiceRecorder";
import Cookies from 'js-cookie';


const socket = io.connect("http://localhost:5000");

const playDing = () => {
  const sound = new Audio(dingSound);
  sound.volume = 0.7;
  sound.play().catch((e) => {
    console.log(" Autoplay blocked:", e.message);
  });
};

const userData = Cookies.get('user');
const user = userData ? JSON.parse(userData) : null;
const userEmails = user && user.user ? user.user.email : null;
const userId = userEmails;

function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const m = minutes < 10 ? "0" + minutes : minutes;
  return `${h}:${m} ${ampm}`;
}

function LiveChat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { text: message, sender: "user", userId });
      setMessage("");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", "user");
    formData.append("userId", userId); 
 
    try {
      const res = await axios.post("http://localhost:5000/chat/upload", formData);
      console.log("✅ File uploaded:", res.data);
      setFile(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  useEffect(() => {
    socket.emit("user_connected", userId);
    socket.emit("get_history", userId);

    socket.on("chat_history", (messages) => setChatLog(messages));

    socket.on("receive_message", (data) => {
      if (data.userId === userId) {
        setChatLog((prev) => [...prev, data]);
        if (data.sender === "user") playDing();
      }
    });

    socket.on("update_online_users", (list) => {
      setOnlineUsers(list);
      console.log(" Online Users:", list);
    });

    socket.emit("mark_seen");

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("update_online_users");
    };
  }, [userId]);

   

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen md:h-screen border-black mt-16 lg:mt-28 overflow-y-hidden">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-start items-center">
        <img src="/liveChat.jpg" alt="liveChat" className="h-80 md:h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: "80vh" }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <img src={ProshotsLogo} alt="ProShots Logo" className="w-6 h-6" />
            </div>
            <h1 className="font-bold text-lg">ProShots Support</h1>
          </div>
          <div className="bg-blue-400 text-xs px-2 py-1 rounded-full">
            {onlineUsers.length} online
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {chatLog.map((msg, index) => (
            <div 
              key={index} 
              className={`flex mb-4 ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === "admin" 
                ? "bg-blue-500 text-white rounded-br-none" 
                : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
              >
                <div className="flex items-center text-xs mb-1">
                  {msg.sender === "admin" ? (
                    <>
                      <img src={ProshotsLogo} alt="logo" className="w-4 h-4 mr-1" />
                      <span className="font-medium">ProShots</span>
                    </>
                  ) : (
                    <span className="font-medium">You</span>
                  )}
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-gray-400">{formatTime(msg.timestamp)}</span>
                </div>
                
                {msg.text.endsWith(".jpg") || msg.text.endsWith(".png") ? (
                  <img 
                    src={msg.text} 
                    alt="upload" 
                    className="max-w-full rounded-lg border border-gray-200" 
                  />
                ) : msg.text.endsWith(".pdf") ? (
                  <a 
                    href={msg.text} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-blue-100 hover:underline"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    View PDF
                  </a>
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}

                {msg.sender === "admin" && (
                  <div className={`text-xs mt-1 text-right ${msg.status === "seen" ? "text-blue-100" : "text-blue-200"}`}>
                    {msg.status === "seen" ? "✓✓ Seen" : "✓ Sent"}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-3 bg-white">
          {file && (
            <div className="flex items-center mb-2 bg-blue-50 rounded-lg p-2">
              <span className="text-sm text-blue-600 flex-1 truncate">{file.name}</span>
              <button
                onClick={handleUpload}
                className="ml-2 bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
              >
                Upload
              </button>
              <button 
                onClick={() => setFile(null)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )} 
          
          <div className="flex items-center">
            <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-2 rounded-full ${message.trim() 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default LiveChat;