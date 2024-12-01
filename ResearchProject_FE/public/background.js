// Placeholder background script
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed.');
  });

// // background.js

// // Listen for feedback from the React frontend and apply UI changes
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.type === 'applyFeedback') {
//     const { feedback } = message;
    
//     // Inject CSS changes into the current tab using chrome.scripting.executeScript
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         func: applyStyles,  // Call the function to apply styles
//         args: [feedback]    // Pass feedback as arguments to the function
//       });
//     });

//     // No need to call sendResponse since you don't need to return a value
//   }
// });

// // Function to apply styles to the webpage
// function applyStyles(feedback) {
//   document.body.style.fontSize = feedback.fontSize;
//   document.body.style.color = feedback.fontColor;
//   document.body.style.textAlign = feedback.alignment;

//   if (feedback.colorScheme === 'dark') {
//     document.body.style.backgroundColor = '#121212';
//     document.body.style.color = '#ffffff';
//   } else {
//     document.body.style.backgroundColor = '#ffffff';
//     document.body.style.color = '#000000';
//   }
// }

/* global chrome */

// Listener for feedback messages
// background.js

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'applyFeedback') {
    const { feedback } = message;
    
    // Use chrome.scripting to inject styles into the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: applyStyles,
        args: [feedback] // Pass feedback to the function
      });
    });
  }
});

// Function to apply styles to the webpage
function applyStyles(feedback) {
  // Apply font size, color, and alignment to the webpage's body
  document.body.style.fontSize = feedback.fontSize;
  document.body.style.color = feedback.fontColor;
  document.body.style.textAlign = feedback.alignment;

  // Ensure dark mode styles are applied to the page
  if (feedback.colorScheme === 'dark') {
    // Inject dark mode styles if not already injected
    const darkModeStyle = document.createElement('style');
    darkModeStyle.innerHTML = `
      body.dark-mode {
        background-color: #121212;
        color: white;
      }
    `;
    document.head.appendChild(darkModeStyle);
    
    // Add the dark mode class to body
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}


