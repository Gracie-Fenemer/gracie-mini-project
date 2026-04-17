// =========================
// GAME VARIABLES
// =========================
let currentPlayer = "O"; // current turn
let won = false; // game state

// get scores from storage (or 0)
let scoreX = Number(localStorage.getItem("scoreX")) || 0;
let scoreO = Number(localStorage.getItem("scoreO")) || 0;


// =========================
// UI ELEMENT VARIABLES
// =========================
let popup; // player name popup
let scoreboard; // scoreboard box
let header; // draggable header


// =========================
// DRAG VARIABLES
// =========================
let offsetX = 0; // mouse offset X
let offsetY = 0; // mouse offset Y
let isDragging = false; // dragging state


// =============================
// PAGE SETUP / EVENT LISTENERS
// =============================
document.addEventListener("DOMContentLoaded", () => {

    // form submit
    document.getElementById("playerForm").addEventListener("submit", savePlayerNames);

    // get elements
    scoreboard = document.getElementById("scoreboard");
    header = document.getElementById("scoreboardHeader");
    popup = document.getElementById("playerInput");

    // get saved names
    const savedX = localStorage.getItem("playerXName");
    const savedO = localStorage.getItem("playerOName");

    loadPlayerNames(); // load names
    updateScoreboard(); // update scores

    // show popup if no names saved
    if (!savedX || !savedO) {
        playerNameInput();
    }

    // change players button
    document.getElementById("changePlayersBtn").addEventListener("click", playerNameInput);

    // drag events
    header.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
});


// =========================
// PLAYER NAME / POPUP FUNCTIONS
// =========================
function playerNameInput() {

    // load saved values into inputs
    const savedX = localStorage.getItem("playerXName") || "";
    const savedO = localStorage.getItem("playerOName") || "";

    document.getElementById("playerXName").value = savedX;
    document.getElementById("playerOName").value = savedO;

    popup.classList.add("open-popup"); 
}

function closePopup() {
    popup.classList.remove("open-popup"); 
}

function savePlayerNames(e) {
    e.preventDefault(); // stop reload

    // Get input values
    const playerX = document.getElementById("playerXName").value || "Player X";
    const playerO = document.getElementById("playerOName").value || "Player O";

    // Update labels
    document.getElementById("playerXLabel").textContent = playerX;
    document.getElementById("playerOLabel").textContent = playerO;

    // Save to storage
    localStorage.setItem("playerXName", playerX);
    localStorage.setItem("playerOName", playerO);

    closePopup();
}

function loadPlayerNames() {

    // Load names (or default)
    const playerX = localStorage.getItem("playerXName") || "Player X";
    const playerO = localStorage.getItem("playerOName") || "Player O";

    document.getElementById("playerXLabel").textContent = playerX;
    document.getElementById("playerOLabel").textContent = playerO;
}


// =========================
// SCOREBOARD FUNCTIONS
// =========================
function updateScoreboard() {

    // update UI
    document.getElementById("scoreX").textContent = scoreX;
    document.getElementById("scoreO").textContent = scoreO;

    // save scores
    localStorage.setItem("scoreX", scoreX);
    localStorage.setItem("scoreO", scoreO);
}

function resetScore() {
    scoreX = 0;
    scoreO = 0;

    updateScoreboard();
}


// =========================
// GAMEPLAY FUNCTIONS
// =========================
function place(box) {

    // Ignores if filled or game ended (doesn't allow play if won)
    if (box.innerText !== "" || won) return;

    // Place move
    box.innerText = currentPlayer; 

    box.classList.add("pulse");
    setTimeout(() => box.classList.remove("pulse"), 400);

    // Switch player
    currentPlayer = currentPlayer === "O" ? "X" : "O";

    checkGameBoard(); 
    checkDraw(); 
    showNextPlayerMessage(); 
}

function restartGame() {
    currentPlayer = "O"; 
    won = false; 

    // Clear board
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            document.getElementById(i + "_" + j).innerText = "";
        }
    }

    // Hides message
    document.getElementById("message").style.display = "none"; 
}


// =========================
// WIN / DRAW CHECKING
// =========================
function checkGameBoard() {

    // check rows and columns
    for (let i = 0; i <= 2; i++) {
        checkWinner(
            document.getElementById(i + "_0").innerText,
            document.getElementById(i + "_1").innerText,
            document.getElementById(i + "_2").innerText
        );

        checkWinner(
            document.getElementById("0_" + i).innerText,
            document.getElementById("1_" + i).innerText,
            document.getElementById("2_" + i).innerText
        );
    }

    // check diagonals
    checkWinner(
        document.getElementById("0_0").innerText,
        document.getElementById("1_1").innerText,
        document.getElementById("2_2").innerText
    );

    checkWinner(
        document.getElementById("0_2").innerText,
        document.getElementById("1_1").innerText,
        document.getElementById("2_0").innerText
    );
}

function checkWinner(first, second, third) {
    if (won) return; // stop if already won

    // check match
    if (first !== "" && first === second && first === third) {
        won = true;

        alert("The winner is... " + first + "! Winner winner chicken dinner!");

        // update score
        if (first === "X") {
            scoreX++;
            updateScoreboard();
        } else if (first === "O") {
            scoreO++;
            updateScoreboard();
        }

        fireworkConfetti(); // celebration
    }
}

function checkDraw() {
    if (won) return;

    let isFull = true;

    // check all cells
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            if (document.getElementById(i + "_" + j).innerText === "") {
                isFull = false;
            }
        }
    }

    if (isFull) {
        alert("It's a draw... Rematch?");
    }
}


// =========================
// MESSAGE FUNCTIONS
// =========================
function showNextPlayerMessage() {
    const msg = document.getElementById("message");

    msg.style.display = "block"; // show

    setTimeout(() => {
        msg.style.display = "none"; // hide after delay
    }, 500);
}


// =========================
// CONFETTI FUNCTIONS
// =========================
function fireworkConfetti() {

    const duration = 2 * 1000; // 2 seconds
    const animationEnd = Date.now() + duration;

    const colors = ["#FFF5EE", "#E0BFB8", "#FAA0A0", "#E37383"];

    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        colors: colors
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {

        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // left side
        confetti({
            ...defaults,
            particleCount,
            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            }
        });

        // right side
        confetti({
            ...defaults,
            particleCount,
            origin: {
                x: randomInRange(0.7, 0.9),
                y: Math.random() - 0.2
            }
        });

    }, 250);
}


// =========================
// SCOREBOARD DRAG FUNCTIONS
// =========================
function startDrag(e) {
    isDragging = true; // start drag

    const rect = scoreboard.getBoundingClientRect();

    offsetX = e.clientX - rect.left; // calculate offset
    offsetY = e.clientY - rect.top;
}

function drag(e) {
    if (!isDragging) return;

    // move element
    scoreboard.style.left = (e.clientX - offsetX) + "px";
    scoreboard.style.top = (e.clientY - offsetY) + "px";
    scoreboard.style.transform = "none";
}

function stopDrag() {
    isDragging = false; // stop drag
}
