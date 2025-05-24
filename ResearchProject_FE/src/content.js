let zoomLevel = Math.round(window.devicePixelRatio * 100);
let lastScrollTop = 0;
let lastScrollTime = Date.now();
let inactivityTime = 0;
let isUserActive = true;
let scrollSpeed = 0;

// Track zoom level
window.addEventListener("resize", () => {
  zoomLevel = Math.round(window.devicePixelRatio * 100);
});

// Track scrolling behavior
window.addEventListener("scroll", () => {
  let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
  let currentTime = Date.now();
  let timeDiff = currentTime - lastScrollTime;

  scrollSpeed = Math.abs((currentScrollTop - lastScrollTop) / (timeDiff || 1));
  lastScrollTop = currentScrollTop;
  lastScrollTime = currentTime;

  sendBehaviorSnapshot();
});

// Track inactivity every 10 seconds
setInterval(() => {
  if (!isUserActive) {
    inactivityTime += 10;
  }
  isUserActive = false; // Reset for next check
  sendBehaviorSnapshot();
}, 10000);

// Detect interaction (resets inactivity and captures font details)
document.addEventListener("mousemove", () => (isUserActive = true));
document.addEventListener("keypress", () => (isUserActive = true));

document.addEventListener("click", (event) => {
  isUserActive = true;
  inactivityTime = 0;

  const computedStyle = window.getComputedStyle(event.target);
  const fontSize = computedStyle.fontSize;
  const fontColor = computedStyle.color;

  sendBehaviorSnapshot(fontSize, fontColor);
});

// Detect tab visibility changes
document.addEventListener("visibilitychange", () => {
  isUserActive = !document.hidden;
});

// Send all behavior data in one place
function sendBehaviorSnapshot(fontSize = null, fontColor = null) {
  const data = {
    zoomLevel,
    scrollSpeed,
    inactivityTime,
    isUserActive,
  };

  if (fontSize && fontColor) {
    data.fontSize = fontSize;
    data.fontColor = fontColor;
  }

  fetch("http://127.0.0.1:5000/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server error");
      }
      return response.json();
    })
    .then((data) => console.log("Behavior tracked:", data))
    .catch((error) => {
      console.error("Tracking failed:", error);
      // Optional: redirect or handle error UI here
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "applyPreferences" && request.preferences) {
    const { font_size, zoom_level, font_color } = request.preferences;

    console.log("Applying preferences:", { font_size, zoom_level, font_color });

    document.querySelectorAll("*").forEach((element) => {
      if (font_size) element.style.fontSize = `${font_size}px`;
      if (font_color) element.style.color = font_color;
    });

    sendResponse({ status: "Preferences applied successfully!" });
    return true; // This line is important for async or delayed responses
  }
});


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "applyPreferences" && request.preferences) {
//     const { font_size, zoom_level, font_color } = request.preferences;

//     document.querySelectorAll("*").forEach((element) => {
//       if (font_size) element.style.fontSize = `${font_size}px`;
//       if (font_color) element.style.color = font_color;
//     });

//     sendResponse({ status: "Preferences applied successfully!" });
//     return true;
//   }

//   // 🔄 Reset preferences
//   if (request.action === "resetPreferences") {
//     document.querySelectorAll("*").forEach((element) => {
//       element.style.fontSize = ""; // Reset to default
//       element.style.color = "";    // Reset to default
//     });

//     sendResponse({ status: "Preferences removed!" });
//     return true;
//   }
// });


   
