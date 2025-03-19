document.addEventListener("DOMContentLoaded", function () {
    const userSelect = document.getElementById("user-select");
    const applyThemeBtn = document.getElementById("apply-theme-btn");
    const newUserBtn = document.getElementById("new-user-btn");
    const deleteUserBtn = document.getElementById("delete-user-btn");
    const themeInfoDiv = document.getElementById("theme-info");

    let selectedUserThemeDetails = null;

    // Fetch users from backend
    fetch("http://192.168.1.6:5000/get_user_email")
        .then(response => response.json())
        .then(data => {
            data["User Emails"].forEach(email => {
                let option = document.createElement("option");
                option.value = email;
                option.textContent = email;
                userSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching users:", error));

    // Fetch and display theme details
    function loadThemeDetails(email) {
        fetch("http://192.168.1.6:5000/get_user_data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(userData => {
            if (!userData) return console.error("No user data found.");

            selectedUserThemeDetails = userData["Theme Details"];

            const { Condition, "Screen Zoom Level": Zoom, "Color Scheme": Scheme, "Font Size": FontSize, "Live Caption": Caption, "Live Translate": Translate, Theme_URL } = selectedUserThemeDetails;

            // Build theme details with conditional settings links
            themeInfoDiv.innerHTML = `
                <p><strong>Condition:</strong> ${Condition}</p>
                <p><strong>Screen Zoom Level:</strong> ${Zoom}%</p>
                <p><strong>Color Scheme:</strong> ${Scheme}</p>
                <p><strong>Font Size:</strong> ${FontSize} 
                    ${FontSize !== "Medium" ? '<a href="#" class="ms-2 text-primary font-size-link"><i class="fa-solid fa-sliders"></i></a>' : ""}
                </p>
                <p><strong>Live Caption:</strong> ${Caption}</p>
                <p><strong>Live Translate:</strong> ${Translate} 
                    ${(Caption === "Yes" || Translate === "Yes") ? '<a href="#" class="ms-2 text-primary accessibility-link"><i class="fa-solid fa-sliders"></i></a>' : ""}
                </p>
            `;

            // Adjust font size
            document.body.style.fontSize = FontSize === "Very Large" ? "22px" : FontSize === "Large" ? "18px" : "14px";

            // Add event listeners for settings links
            document.querySelectorAll(".font-size-link").forEach(link => {
                link.addEventListener("click", () => openSettings("appearance"));
            });
            document.querySelectorAll(".accessibility-link").forEach(link => {
                link.addEventListener("click", () => openSettings("accessibility"));
            });
        })
        .catch(error => console.error("Error fetching user data:", error));
    }

    // Listen for user selection
    userSelect.addEventListener("change", function () {
        if (userSelect.value) loadThemeDetails(userSelect.value);
    });

    // Open theme URL
    applyThemeBtn.addEventListener("click", function () {
        if (selectedUserThemeDetails?.Theme_URL) {
            window.open(selectedUserThemeDetails.Theme_URL, "_blank");
            alert(`Theme applied: ${selectedUserThemeDetails.Theme_URL}`);
        } else {
            alert("No theme URL found.");
        }
    });

    // Function to send a message to background.js to open settings
    function openSettings(type) {
        chrome.runtime.sendMessage({ action: "openSettings", setting: type });
    }

    // Open new user creation
    newUserBtn.addEventListener("click", function () {
        chrome.tabs.create({ url: "new_user/index.html" });
    });

    // Delete user
    deleteUserBtn.addEventListener("click", function () {
        const email = userSelect.value;
        if (!email) return alert("Please select a user to delete.");

        fetch("http://192.168.1.6:5000/delete_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(() => {
            alert("User deleted successfully.");
            location.reload();
        })
        .catch(error => console.error("Error deleting user:", error));
    });
});
