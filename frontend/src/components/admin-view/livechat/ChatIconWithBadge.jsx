import React from "react";

function ChatIconWithBadge({ unreadCount = 0 }) {
  return (
    <div className="relative w-10 h-10 cursor-pointer">
      <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
        💬
      </div>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
}

export default ChatIconWithBadge;
