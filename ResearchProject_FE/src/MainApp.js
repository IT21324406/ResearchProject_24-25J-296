// MainApp.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FetchPage from "./pages/FetchPage";
import ApplyPage from "./pages/ApplyPage";
import SuccessPage from "./pages/SuccessPage";
import ErrorPage from "./pages/ErrorPage";
import PreferencesPage from "./pages/PreferencesPage";
import "./App.css";

function MainApp() {
  const [status, setStatus] = useState("Loading preferences...");
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/preferences")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch preferences: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.preferences) {
          setPreferences(data.preferences);
          setStatus("Preferences loaded successfully.");
        } else {
          setStatus(data.message || "No preferences found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching preferences:", error);
        setStatus("Error fetching preferences.");
      });
  }, []);

  return (
    <Router>
      <div className="button-container-outer">
        <div className="button-container-inner">
          <Link to="/apply">
            <button id="feature2" style={{ marginLeft: "10px" }}>
              DATA FETCHING
            </button>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<FetchPage status={status} />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainApp;
