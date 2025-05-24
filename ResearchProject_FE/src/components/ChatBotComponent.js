import React, { useState } from "react";
import axios from "axios";
import { FaCopy, FaSync, FaVolumeUp, FaVolumeMute, FaPaperPlane } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import "./SummaryGenerator.css";

const ChatBotComponent = () => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const pageUrl = tab.url;

    const userMessage = {
      sender: "user",
      text: question,
      timestamp: formatTime(),
    };

    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);
    setLoading(true);
    setQuestion("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        url: pageUrl,
        question: question,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.answer,
        timestamp: formatTime(),
      };

      setChat([...updatedChat, botMessage]);
    } catch (err) {
      console.error("Error fetching answer:", err);
      const errorMessage = {
        sender: "bot",
        text: "Something went wrong. Try again.",
        timestamp: formatTime(),
      };
      setChat([...updatedChat, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleRegenerate = async (question) => {
    setLoading(true);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const pageUrl = tab.url;

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        url: pageUrl,
        question,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.answer,
        timestamp: formatTime(),
      };

      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (err) {
      console.error("Error regenerating:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="chatbot-container">
      <h2>Ask the Article 🤖</h2>

      <div className="chat-thread">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="avatar">{msg.sender === "user" ? "🧑" : "🤖"}</div>
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="timestamp">{msg.timestamp}</span>
              {msg.sender === "bot" && (
                <div className="bot-tools">
                  <FaCopy onClick={() => handleCopy(msg.text)} className="icon" title="Copy" />
                  <FaSync
                    onClick={() => handleRegenerate(chat[index - 1]?.text)}
                    className="icon"
                    title="Regenerate"
                  />
                  {isSpeaking ? (
                    <FaVolumeMute onClick={handleStopSpeech} className="icon" title="Stop" />
                  ) : (
                    <FaVolumeUp onClick={() => handleReadAloud(msg.text)} className="icon" title="Read Aloud" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a question about this article..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <FaPaperPlane
          onClick={handleAsk}
          className={`icon send-icon ${loading ? "disabled" : ""}`}
          title="Send"
        />
      </div>

      {loading && (
        <div className="loading-overlay">
          <PuffLoader color="#007bff" size={40} />
        </div>
      )}
    </div>
  );
};

export default ChatBotComponent;
