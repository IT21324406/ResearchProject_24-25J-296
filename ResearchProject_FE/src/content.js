let zoomLevel = 100;

// Track zoom events
window.addEventListener("resize", () => {
  zoomLevel = Math.round(window.devicePixelRatio * 100);
  console.log("Zoom Level: ", zoomLevel);
});

// Track user font interactions
document.addEventListener("click", (event) => {
  const computedStyle = window.getComputedStyle(event.target);
  const fontSize = computedStyle.fontSize;
  const fontColor = computedStyle.color;

  // Send the data to the backend
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
