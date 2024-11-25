import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/preferences")
      .then((response) => response.json())
      .then((data) => {
        setPreferences(data.preferences);
        setStatus("Preferences loaded.");
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
        setStatus("Error fetching preferences.");
      });
  }, []);

  const applyPreferences = () => {
    fetch("http://127.0.0.1:5000/apply-preferences", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Apply failed:", error));
  };

  return (
    <div className="App">
      <h1>UI Personalization Extension</h1>
      <button onClick={() => alert("Feature 1: User Feedback Form")}>
        Feature 1: Feedback Form
      </button>

      <button onClick={applyPreferences}>Apply Preferences</button>
      <p>{status}</p>
      {preferences && (
        <div>
          <h2>Your Preferences:</h2>
          <p>Font Size: {preferences.font_size}px</p>
          <p>Zoom Level: {preferences.zoom_level}</p>
          <p>Font Color: {preferences.font_color}</p>
        </div>
      )}

      <button onClick={() => alert("Feature 3: Visually Impaired UI")}>
        Feature 3: Visually Impaired UI
      </button>
    </div>
  );
}

export default App;
