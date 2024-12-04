/*global chrome*/
import React, { useState } from 'react';

const FeedbackForm = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState({
    fontSize: '12sp',
    fontColor: 'red',
    alignment: 'justify',
    colorScheme: 'dark',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);

    // Send feedback to background script
    submitFeedback(feedback);
  };

  const submitFeedback = (feedback) => {
    // Send the feedback to the background script to apply it to the current webpage
    chrome.runtime.sendMessage(
      {
        type: 'applyFeedback',
        feedback: feedback,
      },
      (response) => {
        console.log('Feedback applied successfully', response);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Font Size:
        <input
          type="text"
          name="fontSize"
          value={feedback.fontSize}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Font Color:
        <input
          type="text"
          name="fontColor"
          value={feedback.fontColor}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Text Alignment:
        <select
          name="alignment"
          value={feedback.alignment}
          onChange={handleChange}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </label>
      <br />
      <label>
        Color Scheme:
        <select
          name="colorScheme"
          value={feedback.colorScheme}
          onChange={handleChange}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <br />
      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;
