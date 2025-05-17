import React, { useState } from "react";
import SummaryComponent from "./SummaryComponent";
import ChatBotComponent from "./ChatBotComponent";
import MindMapComponent from "./MindMapComponent"; // <-- new component
import "./SummaryGenerator.css";

const SummaryGenerator = () => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="summary-container">
      <div className="tab-toggle">
        <button 
          className={activeTab === "summary" ? "active" : ""} 
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button 
          className={activeTab === "chat" ? "active" : ""} 
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button 
          className={activeTab === "mindmap" ? "active" : ""} 
          onClick={() => setActiveTab("mindmap")}
        >
          Mind Map
        </button>
      </div>

      {activeTab === "summary" && <SummaryComponent />}
      {activeTab === "chat" && <ChatBotComponent />}
      {activeTab === "mindmap" && <MindMapComponent />}
    </div>
  );
};

export default SummaryGenerator;
