// =========================
// GAME VARIABLES
// =========================
let currentPlayer = "O";
let won = false;

let scoreX = Number(localStorage.getItem("scoreX")) || 0;
let scoreO = Number(localStorage.getItem("scoreO")) || 0;


// =========================
// UI ELEMENT VARIABLES
// =========================
let popup;
let scoreboard;
let header;


// =========================
// DRAG VARIABLES
// =========================
let offsetX = 0;
let offsetY = 0;
let isDragging = false;


// =========================
// PAGE SETUP / EVENT LISTENERS
// =========================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("playerForm").addEventListener("submit", savePlayerNames);

    scoreboard = document.getElementById("scoreboard");
    header = document.getElementById("scoreboardHeader");
    popup = document.getElementById("playerInput");

    const savedX = localStorage.getItem("playerXName");
    const savedO = localStorage.getItem("playerOName");

    loadPlayerNames();
    updateScoreboard();

    if (!savedX || !savedO) {
        playerNameInput();
    }

    document.getElementById("changePlayersBtn").addEventListener("click", playerNameInput);

    header.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
});


// =========================
// PLAYER NAME / POPUP FUNCTIONS
// =========================
function playerNameInput() {
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
    e.preventDefault();

    const playerX = document.getElementById("playerXName").value || "Player X";
    const playerO = document.getElementById("playerOName").value || "Player O";

    document.getElementById("playerXLabel").textContent = playerX;
    document.getElementById("playerOLabel").textContent = playerO;

    localStorage.setItem("playerXName", playerX);
    localStorage.setItem("playerOName", playerO);

    closePopup();
}

function loadPlayerNames() {
    const playerX = localStorage.getItem("playerXName") || "Player X";
    const playerO = localStorage.getItem("playerOName") || "Player O";

    document.getElementById("playerXLabel").textContent = playerX;
    document.getElementById("playerOLabel").textContent = playerO;
}


// =========================
// SCOREBOARD FUNCTIONS
// =========================
function updateScoreboard() {
    document.getElementById("scoreX").textContent = scoreX;
    document.getElementById("scoreO").textContent = scoreO;

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
    if (box.innerText !== "" || won) return;

    box.innerText = currentPlayer;

    box.classList.add("pulse");
    setTimeout(() => box.classList.remove("pulse"), 400);

    currentPlayer = currentPlayer === "O" ? "X" : "O";

    checkGameBoard();
    checkDraw();
    showNextPlayerMessage();
}

function restartGame() {
    currentPlayer = "O";
    won = false;

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            document.getElementById(i + "_" + j).innerText = "";
        }
    }

    document.getElementById("message").style.display = "none";
}


// =========================
// WIN / DRAW CHECKING
// =========================
function checkGameBoard() {
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
    if (won) return;

    if (first !== "" && first === second && first === third) {
        won = true;

        alert("The winner is... " + first + "! Winner winner chicken dinner!");

        if (first === "X") {
            scoreX++;
            updateScoreboard();
        } else if (first === "O") {
            scoreO++;
            updateScoreboard();
        }

        fireworkConfetti();
    }
}

function checkDraw() {
    if (won) return;

    let isFull = true;

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
    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
    }, 1000);
}


// =========================
// CONFETTI FUNCTIONS
// =========================
function fireworkConfetti() {
    const duration = 2 * 1000;
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

        confetti({
            ...defaults,
            particleCount,
            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            }
        });

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
    isDragging = true;

    const rect = scoreboard.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
}

function drag(e) {
    if (!isDragging) return;

    scoreboard.style.left = (e.clientX - offsetX) + "px";
    scoreboard.style.top = (e.clientY - offsetY) + "px";
    scoreboard.style.transform = "none";
}

function stopDrag() {
    isDragging = false;
}
