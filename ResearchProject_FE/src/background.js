import config from './config';

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

chrome.action.onClicked.addListener((tab) => {
  fetch(`${config.SECOND_API_URL}/preferences`)
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
