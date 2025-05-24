function isMediumArticle() {
    return new Promise((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentUrl = tabs[0].url;
            resolve(currentUrl.includes('medium.com'));
        });
    });
}

function navigateToUI() {
    isMediumArticle().then(isMedium => {
        if (!isMedium) {
            showMediumOnlyMessage();
            return;
        }
        // TODO: Implement UI personalization navigation
        alert('UI Personalization coming soon!');
    });
}

function navigateToContent() {
    isMediumArticle().then(isMedium => {
        if (!isMedium) {
            showMediumOnlyMessage();
            return;
        }
        window.location.href = 'index.html';
    });
}

function showMediumOnlyMessage() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="medium-only-message">
            <div class="icon">📚</div>
            <h2>Medium Articles Only</h2>
            <p>This extension works exclusively with Medium articles. Please navigate to a Medium article to use this extension.</p>
        </div>
    `;
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a Medium article
    isMediumArticle().then(isMedium => {
        if (!isMedium) {
            showMediumOnlyMessage();
            return;
        }

        document.querySelector('.ui-button').addEventListener('click', navigateToUI);
        document.querySelector('.content-button').addEventListener('click', navigateToContent);
    });
}); 