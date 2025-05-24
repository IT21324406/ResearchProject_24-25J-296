/* global chrome */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FetchPage from "./pages/FetchPage";
import ApplyPage from "./pages/ApplyPage";
import SuccessPage from "./pages/SuccessPage";
import ErrorPage from "./pages/ErrorPage";
import PreferencesPage from "./pages/PreferencesPage";
import { PreferencesProvider } from "./pages/PreferencesContext";
import "./App.css"; 

function App() {
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

  // const applyPreferences = () => {
  //   fetch("http://127.0.0.1:5000/preferences")
  //     .then((response) => {
  //       if (!response.ok) throw new Error("Failed to fetch preferences.");
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data.preferences) {
  //         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //           if (tabs.length > 0) {
  //             chrome.tabs.sendMessage(
  //               tabs[0].id,
  //               { action: "applyPreferences", preferences: data.preferences },
  //               (response) => {
  //                 if (chrome.runtime.lastError) {
  //                   console.error("Error:", chrome.runtime.lastError.message);
  //                 } else {
  //                   alert(
  //                     response.status || "Preferences applied successfully!"
  //                   );
  //                 }
  //               }
  //             );
  //           } else {
  //             console.error("No active tab found.");
  //           }
  //         });
  //       } else {
  //         alert("No preferences found to apply.");
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching preferences:", error));
  // };

  // return (
  //   <div className="App">
  //     <h1>UI Personalization Extension</h1>
  //     <button onClick={() => alert("Feature 1: User Feedback Form")}>
  //       Feature 1: Feedback Form
  //     </button>
  //     <button onClick={applyPreferences}>Apply Preferences</button>
  //     <p>{status}</p>
  //     {preferences ? (
  //       <div>
  //         <h2>Your Preferences:</h2>
  //         <p>Font Size: {preferences.font_size.toFixed(1)}px</p>
  //         <p>Zoom Level: {preferences.zoom_level.toFixed(1)}%</p>
  //         <p>Inactivity Time: {preferences.inactivity_time} seconds</p>
  //         <p>Adjustment: {preferences.adjustment}</p>
  //       </div>
  //     ) : (
  //       <p>Loading preferences...</p>
  //     )}
  //     <button onClick={() => alert("Feature 3: Visually Impaired UI")}>
  //       Feature 3: Visually Impaired UI
  //     </button>
  //   </div>
  // );

   return (
    <Router>
      <div className="button-container-outer">
        <div className="button-container-inner">
          

          <button id="feature1" onClick={() => alert("User Feedback Form")} style={{ marginLeft: "10px" }}>
            SUMMARY
          </button>

          {/* DATA FETCHING button navigates to root "/" */}
          <Link to="/apply">
            <button id="feature2" style={{ marginLeft: "10px" }}>
              DATA FETCHINGR
            </button>
          </Link>

          <button id="feature3" onClick={() => alert("Visually Impaired UI")} style={{ marginLeft: "10px" }}>
            VISUAL IMPAIRED
          </button>
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

// const root = createRoot(document.getElementById("root"));
// root.render(
//   <PreferencesProvider>
//     <App />
//   </PreferencesProvider>
// );

export default App;   