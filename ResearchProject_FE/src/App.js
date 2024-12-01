// /*global chrome*/
// import React, { useState } from 'react';
// import FeedbackForm from './FeedbackForm';
// import './App.css';

// function App() {
//   const [showForm, setShowForm] = useState(false);

//   const handleFeedbackSubmit = async (feedback) => {
//     // Send the feedback to the backend and apply the UI changes
//     const response = await fetch('http://localhost:5000/api/feedback', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(feedback),
//     });

//     const result = await response.json();
//     if (result.success) {
//       // Apply the UI changes dynamically based on feedback
//       applyUIChanges(result.feedback);
      
//       // Send the feedback to the background script for applying to the webpage
//       submitFeedback(result.feedback);
//     } else {
//       alert('Error in applying UI changes');
//     }
//   };

//   const applyUIChanges = (feedback) => {
//     // Apply dynamic changes based on the feedback
//     document.body.style.fontSize = feedback.fontSize;
//     document.body.style.color = feedback.fontColor;
//     document.body.style.textAlign = feedback.alignment;

//     // Toggle dark mode
//     if (feedback.colorScheme === 'dark') {
//       document.body.classList.add('dark-mode');
//     } else {
//       document.body.classList.remove('dark-mode');
//     }
//   };

//   const submitFeedback = (feedback) => {
//     // Send the feedback to the background script to apply it to the current webpage
//     chrome.runtime.sendMessage({
//       type: 'applyFeedback',
//       feedback: feedback,
//     });
//   };

//   return (
//     <div>
//       <h1>Chrome Extension: UI Personalization</h1>
//       <button onClick={() => setShowForm(true)}>Give Feedback</button>

//       {showForm && <FeedbackForm onSubmit={handleFeedbackSubmit} />}
      
//       <button onClick={() => alert('Feature 3: Visually Impaired UI')}>
//         Feature 3: Visually Impaired UI
//       </button>
//     </div>
//   );
// }

// export default App;

/* global chrome */
import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleFeedbackSubmit = (feedback) => {
    // Send feedback to the background script
    chrome.runtime.sendMessage(
      { type: "applyFeedback", feedback: feedback },
      (response) => {
        if (response.success) {
          alert("UI changes applied to the current webpage!");
        } else {
          alert("Failed to apply UI changes.");
        }
      }
    );
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
