import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [summaryType, setSummaryType] = useState("points");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const pageUrl = tab.url;

    try {
      const response = await axios.post("http://127.0.0.1:8000/summarize", {
        url: pageUrl,
        type: summaryType,
      });

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px", width: "300px" }}>
      <h2>Medium AI Summary</h2>
      <label>Summary Type:</label>
      <select value={summaryType} onChange={(e) => setSummaryType(e.target.value)}>
        <option value="points">Points</option>
        <option value="short">Short</option>
        <option value="long">Long</option>
      </select>
      <button onClick={handleGenerateSummary} disabled={loading}>
        {loading ? "Generating..." : "Generate Summary"}
      </button>
      <p>{summary}</p>
    </div>
  );
};

export default App;
