import React, { useState } from 'react';
import './App.css';
import FeedbackForm from './FeedbackForm';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="App">
      <h1>UI Personalization Extension</h1>
      {!showForm ? (
        <>
          <button onClick={() => setShowForm(true)}>Feature 1: Feedback Form</button>
          <button onClick={() => alert('Feature 2: Behavior-Based UI Change')}>Feature 2: Behavior-Based UI</button>
          <button onClick={() => alert('Feature 3: UI for Visually Impaired Users')}>Feature 3: Visually Impaired UI</button>
        </>
      ) : (
        <FeedbackForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

export default App;
