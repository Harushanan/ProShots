import React, { useState, useRef } from "react";
import axios from "axios";

function VoiceRecorder({ sender, userId }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "voice_message.webm", { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sender", sender);     // 'admin' or 'user'
      formData.append("userId", userId);     // selectedUser in AdminChat

      try {
        const res = await axios.post("http://localhost:5000/upload", formData);
        console.log("🎤 Voice uploaded:", res.data.fileUrl);
      } catch (err) {
        console.error("❌ Voice upload failed:", err);
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`px-3 py-1 text-sm rounded ${
        recording ? "bg-red-500 text-white" : "bg-purple-500 text-white"
      }`}
    >
      {recording ? "Stop" : "🎙️ Record"}
    </button>
  );
}

export default VoiceRecorder;
