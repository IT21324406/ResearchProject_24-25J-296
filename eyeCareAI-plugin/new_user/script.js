
document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners
    document.getElementById("startTestBtn").addEventListener("click", startTest);
    document.getElementById("submitDataBtn").addEventListener("click", submitUserData);
});

document.getElementById("infoForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    // Get user input
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const ageGroup = document.getElementById("ageGroup").value;
    const gender = document.getElementById("gender").value;

    // Store user information in a global object (optional)
    window.userInfo = {
        name: name,
        email: email,
        age: ageGroup,
        gender: gender
    };

    // Hide the form and show the test sections
    document.getElementById("userForm").style.display = "none"; // Correct form ID
    document.getElementById("startScreen").style.display = "block"; // Show start screen
});


let colorBlindImages = [
    "cb1.png", "cb3.png", "cb4.png", "cb7.png", "cb8.png", "cb9.png",
    "cbh1.png", "cbh2.png", "cbh7.png", "cbh9.png"
];

let currentImageIndex = 0;
let correctAnswers = 0;
let shortSightedCorrect = 0;
let shortSightedAttempts = 0;
let nearVisionSize = 12;
let nearVisionScore = 20;
let nearVisionAttempts = 0;
const nearVisionSteps = [12, 15, 18, 21];

let distanceVisionSize = 24;
let distanceVisionScore = 20;
const distanceVisionSteps = [24, 20, 16, 12, 8];
let distanceVisionAttempts = 0;

// Start the test
function startTest() {
    document.getElementById("startScreen").style.display = "none"; // Hide the start screen
    showSection("colorBlindTest");
    loadColorBlindImage();
}


// Show the correct test section
function showSection(testId) {
    document.querySelectorAll('.test-section').forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(testId).style.display = "block";
}


// Load Color Blind Test
function loadColorBlindImage() {
    if (currentImageIndex >= colorBlindImages.length) {
        showSection("shortSightedTest");
        loadShortSightedTest();
        return;
    }

    let imgName = colorBlindImages[currentImageIndex];
    document.getElementById("colorBlindImage").src = `img/${imgName}`;
    let correctNumber = imgName.replace(/\D/g, "");

    let numberOptionsDiv = document.getElementById("numberOptions");
    numberOptionsDiv.innerHTML = "";

    for (let i = 0; i <= 9; i++) {
        let btn = createButton(i, "btn-outline-primary", () => checkColorBlindAnswer(i, correctNumber));
        numberOptionsDiv.appendChild(btn);
    }
}

// Check Color Blind Answer
function checkColorBlindAnswer(userAnswer, correctNumber) {
    if (userAnswer == correctNumber) {
        correctAnswers++;
    }
    currentImageIndex++;
    loadColorBlindImage();
}

// Load Short-Sighted Test
function loadShortSightedTest() {
    let letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ123456789";
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById("randomLetter").innerText = randomLetter;

    let letterOptionsDiv = document.getElementById("letterOptions");
    letterOptionsDiv.innerHTML = "";

    let choices = new Set([randomLetter]);
    while (choices.size < 5) {
        choices.add(letters[Math.floor(Math.random() * letters.length)]);
    }

    Array.from(choices).sort(() => Math.random() - 0.5).forEach(option => {
        let btn = createButton(option, "btn-outline-primary", () => checkShortSightedAnswer(option, randomLetter));
        letterOptionsDiv.appendChild(btn);
    });
}

// Check Short-Sighted Answer
function checkShortSightedAnswer(userAnswer, correctLetter) {
    shortSightedAttempts++;
    if (userAnswer === correctLetter) shortSightedCorrect++;

    if (shortSightedAttempts < 5) {
        loadShortSightedTest();
    } else {
        // Show results after 5 attempts
        showSection("nearVisionTest");
        loadNearVisionTest();
    }
}


// Load Near Vision Test
function loadNearVisionTest() {
    document.getElementById("nearVisionText").style.fontSize = nearVisionSize + "px";
    document.getElementById("nearVisionOptions").innerHTML = "";
    document.getElementById("nearVisionOptions").appendChild(createButton("Yes, I can read it.", "btn-outline-primary", recordNearVisionScore));
    document.getElementById("nearVisionOptions").appendChild(createButton("No, make it larger.", "btn-outline-primary", increaseNearVisionSize));

}

// Record Near Vision Score & Move to Distance Vision Test
function recordNearVisionScore() {
    showSection("distanceVisionTest");
    loadDistanceVisionTest();
}

// Increase Font Size in Near Vision Test
function increaseNearVisionSize() {
    nearVisionAttempts++;

    if (nearVisionAttempts < nearVisionSteps.length) {
        nearVisionSize = nearVisionSteps[nearVisionAttempts];
        nearVisionScore -= 5;
        loadNearVisionTest();
    } else {
        nearVisionScore = 5;  // Minimum score
        showSection("distanceVisionTest");
        loadDistanceVisionTest();
    }
}

// Load Distance Vision Test
function loadDistanceVisionTest() {
    document.getElementById("distanceVisionText").style.fontSize = distanceVisionSize + "px";
    document.getElementById("distanceVisionOptions").innerHTML = "";
    document.getElementById("distanceVisionOptions").appendChild(createButton("Yes, I can read it.", "btn-outline-primary", recordDistanceVisionScore));
    document.getElementById("distanceVisionOptions").appendChild(createButton("No, make it smaller.", "btn-outline-primary", reduceDistanceVisionSize));
    
}

// Record Distance Vision Score & Finish Test
function recordDistanceVisionScore() {
    showResults();
}

// Reduce Font Size in Distance Vision Test
function reduceDistanceVisionSize() {
    distanceVisionAttempts++;

    if (distanceVisionAttempts < distanceVisionSteps.length) {
        distanceVisionSize = distanceVisionSteps[distanceVisionAttempts];
        distanceVisionScore -= 5;
        loadDistanceVisionTest();
    } else {
        distanceVisionScore = 5;  // Minimum score
        showResults();
    }
}

// Show Results
function showResults() {
    showSection("results");

    let colorBlindScore = (correctAnswers / colorBlindImages.length) * 100;
    let shortSightedScore = (shortSightedCorrect / shortSightedAttempts) * 100;

    let colorBlindResult = colorBlindScore < 60 ? "Color Blind: Yes" : "Color Blind: No";
    let shortSightedResult = shortSightedScore < 60 ? "Short-Sighted: Yes" : "Short-Sighted: No";
    let nearVisionResult = nearVisionScore < 20 ? "Needs Larger Text" : "Good Near Vision";
    let distanceVisionResult = distanceVisionScore < 20 ? "Difficulty with Large text" : "Good Distance Vision";

    window.testInfo = {
        color_blind: colorBlindScore < 60 ? 1 : 0,
        short_sighted: shortSightedScore < 60 ? 1 : 0,
        near_vision: nearVisionScore,
        distance_vision: distanceVisionScore,
        color_discrimination: colorBlindScore < 80 ? 1 : 0,

    };

    document.getElementById("resultText").innerHTML = `
        <strong>Color Blind Test Score:</strong> ${colorBlindScore.toFixed(2)}% - ${colorBlindResult} <br>
        <strong>Short-Sighted Test Score:</strong> ${shortSightedScore.toFixed(2)}% - ${shortSightedResult} <br>
        <strong>Near Vision Test Score:</strong> ${nearVisionScore} - ${nearVisionResult} <br>
        <strong>Distance Vision Test Score:</strong> ${distanceVisionScore} - ${distanceVisionResult}
    `;
}


// Utility: Create Button
function createButton(text, className, onClick) {
    let btn = document.createElement("button");
    btn.className = `btn ${className}`;
    btn.innerText = text;
    btn.addEventListener("click", onClick);
    return btn;
}
function submitUserData() {
    const data = {
        "name": window.userInfo.name,
        "email": window.userInfo.email,
        "Age": window.userInfo.age,
        "Gender": window.userInfo.gender,
        "Color Blind": window.testInfo.color_blind,
        "Short-Sighted": window.testInfo.short_sighted,
        "Distance Vision": window.testInfo.distance_vision,
        "Near Vision": window.testInfo.near_vision,
        "Color Discrimination": window.testInfo.color_discrimination
    };

    fetch('http://192.168.1.7:5001/theme_suggestion_services', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.status === 200) {
                return response.json(); // Return the JSON if the status is 200
            } else {
                throw new Error('Failed to insert user data into database.');
            }
        })
        .then(data => {
            console.log(data); // Handle the response here
            alert("Your data has been saved successfully. Please open the plugin.");
            window.close();  // Close the current tab
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Can't save data. Existing user found. Please check your records from the plugin.");
            window.close();  // Close the current tab
        });
}
