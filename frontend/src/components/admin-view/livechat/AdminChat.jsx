import ChatIconWithBadge from "./ChatIconWithBadge";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import dingSound from "@/sounds/ding-101492.mp3";
import VoiceRecorder from "@/components/customer-view/livechat/VoiceRecorder";

const socket = io("http://localhost:5000");

const playDing = () => {
  const sound = new Audio(dingSound);
  sound.volume = 0.7;
  sound.play().catch((e) => {
    console.log("🔇 Autoplay blocked:", e.message);
  });
};

function AdminChat() {
  const [selectedUser, setSelectedUser] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [adminMessage, setAdminMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("get_users");

    socket.on("user_list", (users) => setUserList(users));
    socket.on("chat_history", (messages) => {
      setUserMessages(messages);
      scrollToBottom();
    });
    socket.on("receive_message", (data) => {
      if (data.sender === "user") playDing();
      if (data.userId === selectedUser) {
        setUserMessages((prev) => [...prev, data]);
        scrollToBottom();
      } else if (data.sender === "user") {
        setUnreadCount((prev) => prev + 1);
        setUnreadUsers((prev) => [...new Set([...prev, data.userId])]);
      }
    });

    socket.on("update_online_users", (onlineList) => {
      setOnlineUsers(onlineList);
    });

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      socket.off("user_list");
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("update_online_users");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const getChat = () => {
    if (selectedUser.trim() !== "") {
      socket.emit("get_history", selectedUser);
      setUnreadCount(0);
      setUnreadUsers((prev) => prev.filter((user) => user !== selectedUser));
    }
  };

  const handleSelectUserFromBadge = (userId) => {
    setSelectedUser(userId);
    socket.emit("get_history", userId);
    setUnreadUsers((prev) => prev.filter((id) => id !== userId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setDropdownOpen(false);
  };

  const sendAdminMessage = () => {
    if (adminMessage.trim()) {
      socket.emit("send_message", {
        text: adminMessage,
        sender: "admin",
        userId: selectedUser,
      });
      setAdminMessage("");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", "admin");
    formData.append("userId", selectedUser);

    try {
      const res = await axios.post("http://localhost:5000/chat/upload", formData);
      console.log("✅ Admin file uploaded:", res.data);
      setFile(null);
    } catch (err) {
      console.error("❌ Admin upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-10 overflow-hidden">
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700">
                  Unread Messages
                </div>
                {unreadUsers.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">No unread messages</div>
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    {unreadUsers.map((user, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                        onClick={() => handleSelectUserFromBadge(user)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800 truncate">{user}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-1 ${onlineUsers.includes(user) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {onlineUsers.includes(user) ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* User Selector */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <select
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select a user...</option>
                {userList.map((user, index) => (
                  <option key={index} value={user}>
                    {user} {onlineUsers.includes(user) ? "🟢 Online" : "🔴 Offline"}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={getChat}
              disabled={!selectedUser}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedUser 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Load Chat
            </button>
          </div>

          {/* Messages Container */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 h-96 overflow-y-auto mb-6">
            {userMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-lg">No messages yet</p>
                <p className="text-sm">Select a user and load their chat</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md rounded-xl p-4 ${msg.sender === 'admin' 
                      ? 'bg-blue-100 text-gray-800 rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {msg.sender === "admin" ? (
                            <span className="text-blue-600">You</span>
                          ) : (
                            <span className="text-gray-700">{msg.userId}</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      
                      {msg.text.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                          src={msg.text}
                          alt="upload"
                          className="max-w-full max-h-60 rounded-lg border border-gray-200 mt-2"
                        />
                      ) : msg.text.match(/\.pdf$/i) ? (
                        <a
                          href={msg.text}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:underline mt-2"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          View PDF
                        </a>
                      ) : msg.text.match(/\.(mp3|wav|ogg|webm)$/i) ? (
                        <div className="mt-2">
                          <audio controls className="w-full">
                            <source src={msg.text} />
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      ) : (
                        <p className="text-gray-800">{msg.text}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Reply Section */}
          {selectedUser && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {/* File Upload Preview */}
              {file && (
                <div className="mb-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleFileUpload}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Upload
                    </button>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Input Area */}
              <div className="flex items-center space-x-2">
                <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
                
                {/* <VoiceRecorder sender="admin" userId={selectedUser} /> */}
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendAdminMessage()}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendAdminMessage}
                    disabled={!adminMessage.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${adminMessage.trim() 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminChat;