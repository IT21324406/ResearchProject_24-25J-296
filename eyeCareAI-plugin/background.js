chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openSettings") {
        const setting = message.setting;
        
        // Open the appropriate settings page
        if (setting === "appearance") {
            chrome.tabs.create({ url: "chrome://settings/appearance" });
        } else if (setting === "accessibility") {
            chrome.tabs.create({ url: "chrome://settings/accessibility" });
        }
    }
});
