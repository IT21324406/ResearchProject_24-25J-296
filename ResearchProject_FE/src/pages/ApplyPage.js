/* global chrome */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "./PreferencesContext";
import config from "../config";

const ApplyPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { preferences, setPreferences } = usePreferences();

  useEffect(() => {
    const hideButtons = () => {
      const feature1 = document.getElementById("feature1");
      const feature2 = document.getElementById("feature2");
      const feature3 = document.getElementById("feature3");
      if (feature1) feature1.style.display = "none";
      if (feature2) feature2.style.display = "none";
      if (feature3) feature3.style.display = "none";
    };
    hideButtons();
  }, []);

  const applyPreferences = () => {
    setLoading(true);

    fetch(`${config.SECOND_API_URL}/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'include'
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch preferences: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received from backend:", data);
        if (!data.preferences) {
          alert("No preferences found.");
          setLoading(false);
          navigate("/error");
          return;
        }
        
        setPreferences(data.preferences); 
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) {
            console.error("No active tab found.");
            setLoading(false);
            navigate("/error");
            return;
          }

          const tabId = tabs[0].id;
          const message = { action: "applyPreferences", preferences: data.preferences };

          // Retry sending message until it succeeds or max attempts are hit
          let attempts = 0;
          const maxAttempts = 5;
          const interval = 300;

          const trySendMessage = () => {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                files: ["content.js"],
              },
              () => {
                chrome.tabs.sendMessage(tabId, message, (response) => {
                  if (chrome.runtime.lastError) {
                    attempts++;
                    if (attempts < maxAttempts) {
                      setTimeout(trySendMessage, interval);
                    } else {
                      console.error("Chrome error:", chrome.runtime.lastError.message);
                      setLoading(false);
                      navigate("/error");
                    }
                  } else {
                    // Message sent successfully
                    setLoading(false);
                    navigate("/success");
                  }
                });
              }
            );
          };

          trySendMessage();
        });
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
        setLoading(false);
        navigate("/error");
      });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      backgroundColor: "#f9fafb"
    }}>
      {loading ? (
        <>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #ccc",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ marginTop: "12px", color: "#374151" }}>Applying Preferences...</p>
        </>
      ) : (
        <button
          onClick={applyPreferences}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "320px"
          }}
        >
          Apply Preferences
        </button>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ApplyPage;
