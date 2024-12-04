import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleFeedbackSubmit = async (feedback) => {
    try {
      // Send feedback to the backend API
      const response = await fetch("http://localhost:8000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      const result = await response.json();
      if (result.success) {
        // Apply the predicted UI adjustments
        applyUIChanges(result.feedback); // Use the feedback from the backend
      } else {
        alert("Failed to apply UI changes.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const applyUIChanges = (adjustments) => {
    // Apply the predicted adjustments to the current webpage
    document.body.style.fontSize = adjustments.fontSize;
    document.body.style.color = adjustments.fontColor;
    document.body.style.textAlign = adjustments.alignment;

    // Apply color scheme
    if (adjustments.colorScheme === "dark") {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  };

  return (
    <div>
      <h1>Chrome Extension: UI Personalization</h1>
      <button onClick={() => setShowForm(true)}>Give Feedback</button>

      {showForm && <FeedbackForm onSubmit={handleFeedbackSubmit} />}
    </div>
  );
}

export default App;
