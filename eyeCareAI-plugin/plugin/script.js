// 1. Fetch emails of existing users
function fetchUserEmails() {
    fetch('http://192.168.1.7:5001/get_user_email')
        .then(response => response.json())
        .then(data => {
            const userSelect = document.getElementById('existingUsers');
            const deleteSelect = document.getElementById('deleteUser');
            userSelect.innerHTML = `<option value="">--Select--</option>`; // Reset options
            deleteSelect.innerHTML = `<option value="">--Select--</option>`; // Reset options

            data.emails.forEach(email => {
                const option = document.createElement('option');
                option.value = email;
                option.textContent = email;
                userSelect.appendChild(option);
                deleteSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching user emails:', error);
        });
}

// 2. Fetch User Data by Email
function fetchUserData(email) {
    const data = { "email": email };

    fetch('http://192.168.1.7:5001/get_user_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('User data:', data);
        applyTheme(data["Theme Details"]);
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
}

// 3. Apply Theme based on User Condition
function applyTheme(themeDetails) {
    const condition = themeDetails["Condition"];
    const themeAdjustments = themeDetails["Theme Adjustments"];
    const label = themeDetails["Label"];

    console.log(`Condition: ${condition}`);
    console.log(`Theme Adjustments: ${themeAdjustments}`);

    // Apply the theme based on the condition
    switch (label) {
        case 0:
            setTheme({
                backgroundColor: '#ffffff', 
                color: '#000000', 
                fontSize: '16px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Standard theme with default fonts and colors.'
            });
            break;
        case 1:
            setTheme({
                backgroundColor: '#f5f5f5', 
                color: '#000000', 
                fontSize: '16px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Minor color adjustments for color-blind users (e.g., deuteranopia-friendly palette).'
            });
            break;
        case 2:
            setTheme({
                backgroundColor: '#000000', 
                color: '#FFFFFF', 
                fontSize: '16px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Strong contrast and monochrome-friendly theme.'
            });
            break;
        case 3:
            setTheme({
                backgroundColor: '#ffffff', 
                color: '#000000', 
                fontSize: '18px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Slightly enlarged font (+2px) with mild contrast boost for mild short-sightedness.'
            });
            break;
        case 4:
            setTheme({
                backgroundColor: '#ffffff', 
                color: '#000000', 
                fontSize: '20px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Larger fonts (+4px), stronger contrast for moderate short-sightedness.'
            });
            break;
        case 5:
            setTheme({
                backgroundColor: '#ffffff', 
                color: '#000000', 
                fontSize: '24px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Extra-large fonts (+6px or more), simplified UI with less visual clutter for severe short-sightedness.'
            });
            break;
        case 6:
            setTheme({
                backgroundColor: '#f5f5f5', 
                color: '#000000', 
                fontSize: '18px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Color-blind-friendly palette with enlarged text for hybrid (Mild) short-sightedness.'
            });
            break;
        case 7:
            setTheme({
                backgroundColor: '#000000', 
                color: '#FFFFFF', 
                fontSize: '24px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'High-contrast UI with extra-large fonts and adjusted colors for hybrid (Severe) color blindness & short-sightedness.'
            });
            break;
        case 8:
            setTheme({
                backgroundColor: '#f5f5f5', 
                color: '#000000', 
                fontSize: '22px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Large fonts with high contrast for aging vision (presbyopia).'
            });
            break;
        case 9:
            setTheme({
                backgroundColor: '#f5f5f5', 
                color: '#000000', 
                fontSize: '20px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Adjusted zoom levels and focus-friendly UI for distance vision impairment.'
            });
            break;
        case 10:
            setTheme({
                backgroundColor: '#f5f5f5', 
                color: '#000000', 
                fontSize: '18px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Enlarged text for menus and content-heavy areas for near vision impairment.'
            });
            break;
        case 11:
            setTheme({
                backgroundColor: '#000000', 
                color: '#FFFFFF', 
                fontSize: '24px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Highest contrast, extra-large fonts, optional text-to-speech settings for total vision assistance.'
            });
            break;
        default:
            setTheme({
                backgroundColor: '#ffffff', 
                color: '#000000', 
                fontSize: '16px', 
                fontFamily: 'Arial, sans-serif',
                themeDescription: 'Standard theme with default fonts and colors.'
            });
            break;
    }
}

// Apply CSS changes dynamically
function setTheme(styles) {
    document.body.style.backgroundColor = styles.backgroundColor;
    document.body.style.color = styles.color;
    document.body.style.fontSize = styles.fontSize;
    document.body.style.fontFamily = styles.fontFamily;

    // Display theme description in the console or in a UI element
    console.log(`Theme Applied: ${styles.themeDescription}`);
}

// 4. Handle New User Button
document.getElementById('newUserBtn').addEventListener('click', () => {
    window.location.href = 'new_user/index.html';
});

// 5. Handle Delete User Button
document.getElementById('deleteUserBtn').addEventListener('click', () => {
    const selectedEmail = document.getElementById('deleteUser').value;
    if (selectedEmail) {
        const data = { "email": selectedEmail };

        fetch('http://192.168.1.7:5001/delete_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User deleted successfully!');
                fetchUserEmails();  // Refresh the dropdown
            } else {
                alert('Failed to delete user.');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }
});

// Initialize by fetching user emails when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchUserEmails();
});
