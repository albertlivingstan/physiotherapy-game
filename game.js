// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

// DOM Elements for the question and popup
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const popup = document.getElementById("popup");
const losePopup = document.getElementById("lose-popup");
const playAgainButton = document.getElementById("play-again");
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
        ctx.fillStyle = "blue";
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

        // Move and draw obstacle
        obstacleX -= obstacleSpeed;
        if (obstacleX < -obstacleRadius * 2) {
            obstacleX = canvas.width;
            score++;
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
            playerY + playerHeight > canvas.height - 60
        ) {
            gameActive = false;
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
    const currentQuestion = randomQuestion(); // Get a new question each time
    questionText.textContent = currentQuestion.question;
    questionContainer.style.display = "block";
    answerInput.focus();
    startTimer(currentQuestion);
}

// Start the timer for answering the question
function startTimer(currentQuestion) {
    timeLeft = 30; // Reset time to 10 seconds
    timeLeftDisplay.textContent = timeLeft;
    timeLeftDisplay.style.color = "black"; // Reset color

    timer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        
        // Change the color to red and blink for the last 3 seconds
        if (timeLeft <= 3) {
            timeLeftDisplay.style.color = timeLeft % 2 === 0 ? "red" : "black"; // Blink effect
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            loseGame(); // Call lose game when time is up
        }
    }, 1000);
}

// Lose game and show lose popup
function loseGame() {
    clearInterval(timer); // Stop the timer
    questionContainer.style.display = "none"; // Hide the question container
    losePopup.style.display = "block"; // Show the lose popup
    gameActive = false;
}

// Event listener for jump
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// Handle answer submission
document.getElementById("submit-answer").addEventListener("click", () => {
    clearInterval(timer); // Stop the timer when answering
    const answer = answerInput.value.toLowerCase();
    const currentQuestionText = questionText.textContent; // Get the question text

    // Find the question object
    const questionObj = questions.find(q => q.question === currentQuestionText);
    
    if (questionObj && answer === questionObj.answer.toLowerCase()) {
        // Change background color to black
        document.body.style.backgroundColor = "black";
        questionContainer.style.display = "none";
        showCongratulationsPopup();
        setTimeout(() => {
            popup.style.display = "none";
            resetGame();
        }, 2000);
    } else {
        loseGame(); // Call lose game if the answer is incorrect
    }
});

// Show the congratulations popup message
function showCongratulationsPopup() {
    popup.textContent = "Congratulations! You answered correctly.";
    popup.style.display = "block";
}

// Reset game state for a new round
function resetGame() {
    gameActive = true;
    obstacleX = canvas.width;
    playerY = canvas.height - playerHeight; // Reset player position
    playerYVelocity = 0; // Reset player velocity
    score = 0; // Reset score
    answerInput.value = "";
    timeLeftDisplay.textContent = "10"; // Reset timer display
    losePopup.style.display = "none"; // Hide the lose popup
    questionContainer.style.display = "none"; // Hide question container
    document.body.style.backgroundColor = ""; // Reset background color
    gameLoop(); // Restart the game loop
}

// Play again button functionality
playAgainButton.addEventListener("click", () => {
    resetGame();
});

// Start the game
gameLoop();
