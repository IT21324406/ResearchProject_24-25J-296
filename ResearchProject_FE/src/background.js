chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

chrome.action.onClicked.addListener((tab) => {
  fetch("http://127.0.0.1:5000/preferences")
    .then((res) => res.json())
    .then((data) => {
      if (data.preferences) {
        chrome.tabs.sendMessage(tab.id, {
          action: "applyPreferences",
          preferences: data.preferences,
        });
      } else {
        console.warn("No preferences available.");
      }
    })
    .catch((error) => console.error("Failed to fetch preferences:", error));
});
