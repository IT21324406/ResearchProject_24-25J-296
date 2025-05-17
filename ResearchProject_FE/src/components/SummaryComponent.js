import React, { useState } from "react";
import axios from "axios";
import { FaCopy, FaSync, FaVolumeUp, FaVolumeMute, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import "./SummaryGenerator.css";

const SummaryComponent = () => {
  const [summaryType, setSummaryType] = useState("points");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummary("");
    setGenerated(false);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const pageUrl = tab.url;

    try {
      const response = await axios.post("http://127.0.0.1:8000/summarize", {
        url: pageUrl,
        type: summaryType,
      });

      setSummary(response.data.summary);
      setGenerated(true);
      saveSummary();
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUserEmail = async () => {
    return new Promise((resolve, reject) => {
      chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, (userInfo) => {
        if (userInfo.email) {
          resolve(userInfo.email);
        } else {
          reject("No email found");
        }
      });
    });
  };

  const saveSummary = async (liked = false, disliked = false) => {
    if (!summary) return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const pageUrl = tab.url;

    try {
      const user_email = await getUserEmail();
      await axios.post("http://127.0.0.1:8000/save-summary", {
        url: pageUrl,
        summary: summary,
        summaryType: summaryType,
        liked: liked,
        disliked: disliked,
        user_email: user_email,
      });

      console.log("Summary saved successfully!");
    } catch (error) {
      console.error("Error getting email or saving summary:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied to clipboard!");
  };

  const handleRegenerate = () => {
    handleGenerateSummary();
  };

  const handleReadAloud = () => {
    if (!summary) return;

    speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(summary);
    setUtterance(newUtterance);

    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(newUtterance);
  };

  const handleStopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleLike = () => {
    setLiked(!liked);
    setDisliked(false);
    saveSummary(true, false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
    saveSummary(false, true);
  };

  return (
    <div className="summary-container">
      <h2>Medium AI Summary</h2>

      {!generated && !loading && (
        <>
          <label>Summary Type:</label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="select-box"
          >
            <option value="points">Points</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
          </select>

          <button onClick={handleGenerateSummary} className="generate-btn">
            Generate Summary
          </button>
        </>
      )}

      {loading && (
        <div className="loading-overlay">
          <PuffLoader color="#007bff" size={50} />
        </div>
      )}

      {summary && !loading && generated && (
        <div className="summary-box">
          <h3>Summary:</h3>

          {summaryType === "points" ? (
            <ul>
              {summary.split("\n").map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <p>{summary}</p>
          )}

          <div className="icon-container">
            <FaCopy onClick={handleCopy} className="icon" title="Copy Summary" />
            <FaSync onClick={handleRegenerate} className="icon" title="Regenerate Summary" />
            {isSpeaking ? (
              <FaVolumeMute onClick={handleStopSpeech} className="icon" title="Stop Reading" />
            ) : (
              <FaVolumeUp onClick={handleReadAloud} className="icon" title="Read Aloud" />
            )}
            <FaThumbsUp
              onClick={handleLike}
              className={`icon ${liked ? "liked" : ""}`}
              title="Like Summary"
            />
            <FaThumbsDown
              onClick={handleDislike}
              className={`icon ${disliked ? "disliked" : ""}`}
              title="Dislike Summary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryComponent;
