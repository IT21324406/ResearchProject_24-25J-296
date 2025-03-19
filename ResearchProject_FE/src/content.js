let zoomLevel = 100;

// Track zoom events
window.addEventListener("resize", () => {
  zoomLevel = Math.round(window.devicePixelRatio * 100);
  console.log("Zoom Level: ", zoomLevel);
});

// Track user interactions
document.addEventListener("click", (event) => {
  const computedStyle = window.getComputedStyle(event.target);
  const fontSize = computedStyle.fontSize;
  const fontColor = computedStyle.color;

  // Send interaction data to the backend
  fetch("http://127.0.0.1:5000/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fontSize: fontSize,
      fontColor: fontColor,
      zoomLevel: zoomLevel,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Data tracked:", data))
    .catch((error) => console.error("Tracking failed:", error));
});

// // Listen for preferences from background or popup
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "applyPreferences" && message.preferences) {
//     const { averageFontSize, averageZoomLevel, averageFontColor } =
//       message.preferences;

//     console.log("Applying preferences:", message.preferences);

//     const elements = document.querySelectorAll("*");

//     elements.forEach((element) => {
//       const computedStyle = window.getComputedStyle(element);
//       const currentFontSize = parseFloat(computedStyle.fontSize);

//       // Apply font size
//       if (currentFontSize) {
//         const newFontSize = averageFontSize;
//         element.style.fontSize = `${newFontSize.toFixed(2)}px`;
//       }

//       // Apply font color
//       element.style.color = averageFontColor;
//     });

//     // Adjust zoom level
//     document.body.style.transform = `scale(${averageZoomLevel / 100})`;
//     document.body.style.transformOrigin = "0 0";

//     sendResponse({ message: "Preferences applied successfully." });
//   } else {
//     sendResponse({ message: "No preferences to apply." });
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyPreferences" && message.preferences) {
    const { font_size, zoom_level, font_color } = message.preferences;

    console.log("Applying preferences:", { font_size, zoom_level, font_color });
    // Apply font size to the body and all child elements
    document.querySelectorAll("*").forEach((element) => {
      element.style.fontSize = `${font_size}px`;
    });

    // Apply zoom level to the body
    // if (zoom_level) {
    //   document.body.style.transform = `scale(${zoom_level / 100})`;
    //   document.body.style.transformOrigin = "0 0"; // Maintain alignment
    // }

    // Apply font color to the body and all text elements
    document.querySelectorAll("*").forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.color) {
        element.style.color = font_color;
      }
    });

    // Send a response back to confirm
    sendResponse({ status: "Preferences applied successfully!" });
  } else {
    console.error("No valid preferences received:", message);
    sendResponse({ status: "Failed to apply preferences." });
  }
});
