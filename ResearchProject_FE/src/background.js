chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendDataToBackend") {
    fetch("http://127.0.0.1:5000/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message.data),
    })
      .then((response) => response.json())
      .then((responseData) => console.log("Backend response:", responseData))
      .catch((error) => console.error("Error:", error));
  }
});
