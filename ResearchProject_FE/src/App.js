import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>UI Personalization Extension</h1>
      <button onClick={() => alert('Feature 1: User Feedback Form')}>Feature 1: Feedback Form</button>
      <button onClick={() => alert('Feature 2: Behavior-Based UI Change')}>Feature 2: Behavior-Based UI</button>
      <button onClick={() => alert('Feature 3: UI for Visually Impaired Users')}>Feature 3: Visually Impaired UI</button>
    </div>
  );
}

export default App;
