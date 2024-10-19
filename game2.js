// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load dragon image
const dragonImage = new Image();
dragonImage.src = 'Python_Baby_(DV).webp'; 

// Variables for the player (dragon)
const playerWidth = 80;
const playerHeight = 80;
let playerX = 100;
let playerY = canvas.height - playerHeight;
let playerYVelocity = 0;
const gravity = 1;
const jumpHeight = -20;

// Variables for obstacles
let obstacleX = canvas.width;
let obstacleY = canvas.height - 30;
let obstacleRadius = 30;
let obstacleSpeed = 5;
let obstacleType = "circle"; // Can be "circle" or "rectangle"

// Score and game state
let score = 0;
let gameActive = true;
let questionAsked = false;
let correctAnswer = false;
let timer;
let timeLeft = 10; // 10 seconds for answering

// Physiotherapy Questions
const questions = [
    { question: "What is the primary goal of physiotherapy?", answer: "improve mobility" },
    { question: "Which therapy helps in muscle strengthening?", answer: "exercise therapy" },
    { question: "What is hydrotherapy?", answer: "water-based therapy" },
    { question: "What is manual therapy?", answer: "hands-on treatment" },
    { question: "What does a physiotherapist do?", answer: "treat physical issues" },
    { question: "What is the role of ultrasound in physiotherapy?", answer: "pain relief" },
    { question: "What type of exercise is good for flexibility?", answer: "stretching" },
    { question: "What is the purpose of heat therapy?", answer: "reduce pain" },
    { question: "What is posture correction?", answer: "aligning the body" },
    { question: "What is sports physiotherapy?", answer: "rehabilitation for athletes" },
];

let currentQuestion = randomQuestion();

// DOM Elements for the question and popup
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const popup = document.getElementById("popup");
const losePopup = document.getElementById("lose-popup");
const playAgainButton = document.getElementById("play-again");
const jumpButton = document.getElementById("jump-button");
const timeLeftDisplay = document.getElementById("time-left");

// Helper function to get random question
function randomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
}

// Function to handle jumping
function jump() {
    if (playerY === canvas.height - playerHeight) {
        playerYVelocity = jumpHeight;
    }
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameActive) {
        // Player controls and gravity
        playerYVelocity += gravity;
        playerY += playerYVelocity;
        if (playerY > canvas.height - playerHeight) {
            playerY = canvas.height - playerHeight;
            playerYVelocity = 0;
        }

        // Draw the player (dragon)
        ctx.drawImage(dragonImage, playerX, playerY, playerWidth, playerHeight);

        // Move and draw obstacle
        obstacleX -= obstacleSpeed;
        if (obstacleX < -obstacleRadius * 2) {
            obstacleX = canvas.width;
            score++;
            correctAnswer = false;  // Reset for new obstacle
            obstacleType = Math.random() > 0.5 ? "circle" : "rectangle";  // Randomize obstacle type
        }

        // Draw the obstacle
        if (obstacleType === "circle") {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(obstacleX, obstacleY, obstacleRadius, 0, Math.PI * 2);
            ctx.fill();
        } else if (obstacleType === "rectangle") {
            ctx.fillStyle = "red";
            ctx.fillRect(obstacleX, obstacleY - 40, 60, 40);
        }

        // Collision detection
        if (
            playerX < obstacleX + obstacleRadius &&
            playerX + playerWidth > obstacleX - obstacleRadius &&
            playerY + playerHeight > canvas.height - 60 &&
            !correctAnswer
        ) {
            gameActive = false;
            questionAsked = true;
            displayQuestion();
        }

        // Display score
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }

    requestAnimationFrame(gameLoop);
}

// Function to display a question
function displayQuestion() {
    currentQuestion = randomQuestion(); // Get a new question
    questionText.textContent = currentQuestion.question;
    answerInput.value = '';
    questionContainer.style.display = "block";
    startTimer();
}

// Start timer
function startTimer() {
    timeLeft = 30; // Reset timer to 10 seconds
    timeLeftDisplay.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;

        // Blink effect
        if (timeLeft <= 3) {
            timeLeftDisplay.style.color = timeLeft % 2 === 0 ? "red" : "black"; // Blink effect
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            questionContainer.style.display = "none";
            losePopup.style.display = "block";
            document.body.style.backgroundColor = "red"; // Change background color on lose
        }
    }, 1000);
}

// Handle answer submission
document.getElementById("submit-answer").addEventListener("click", () => {
    const answer = answerInput.value.trim().toLowerCase();
    if (answer === currentQuestion.answer.toLowerCase()) {
        correctAnswer = true;
        questionContainer.style.display = "none";
        popup.style.display = "block";
        document.body.style.backgroundColor = "black"; // Change background color on win
        clearInterval(timer); // Stop the timer
    } else {
        answerInput.value = ''; // Clear input on wrong answer
    }
});

// Restart the game
playAgainButton.addEventListener("click", () => {
    score = 0;
    gameActive = true;
    questionAsked = false;
    losePopup.style.display = "none";
    document.body.style.backgroundColor = "#f0f0f0"; // Reset background color
    gameLoop();
    startTimer();
});

// Jump control for keyboard
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

// Jump control for mobile
jumpButton.addEventListener("click", () => {
    jump();
    jumpButton.style.display = "none"; // Hide button after jumping
});

// Show jump button on mobile
function checkMobile() {
    if (window.innerWidth <= 600) {
        jumpButton.style.display = "block"; // Show jump button
    }
}

checkMobile(); // Initial check
window.addEventListener("resize", checkMobile); // Check on resize

// Start the game
gameLoop();
