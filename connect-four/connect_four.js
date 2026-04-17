// =========================
// GAME VARIABLES
// =========================
let currentPlayer = "red"; // whose turn it is
let gameWon = false; // has someone won

const rowCount = 5;
const colCount = 7;

// 2D array storing game state
const board = Array.from({ length: rowCount }, () => Array(colCount).fill(null));

// scores from storage
let redPlayerScore = Number(localStorage.getItem("redPlayerScore")) || 0;
let yellowPlayerScore = Number(localStorage.getItem("yellowPlayerScore")) || 0;


// =========================
// UI ELEMENT VARIABLES
// =========================
let playerInput; // popup
let scoreboard; // draggable box
let scoreboardHeader; // drag handle


// =========================
// DRAG VARIABLES
// =========================
let dragOffsetX = 0; // mouse X offset
let dragOffsetY = 0; // mouse Y offset
let isDragging = false; // dragging state


// =======================
// DOM ELEMENTS
// =======================
const grid = document.getElementById("grid"); // grid container
const discLayer = document.getElementById("disc-layer"); // where discs sit
const cells = document.querySelectorAll(".cell"); // all grid cells


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("playerForm").addEventListener("submit", savePlayerNames);

    scoreboard = document.getElementById("scoreboard");
    scoreboardHeader = document.getElementById("scoreboardHeader");
    playerInput = document.getElementById("playerInput");

    // get saved player names
    const savedRedPlayerName = localStorage.getItem("redPlayerName");
    const savedYellowPlayerName = localStorage.getItem("yellowPlayerName");

    loadPlayerNames(); // load names into UI
    updateScoreboard(); // show scores

    // show popup if no names saved
    if (!savedRedPlayerName || !savedYellowPlayerName) {
        openPlayerInput();
    }

    document.getElementById("changePlayersBtn").addEventListener("click", openPlayerInput);

    // enable dragging scoreboard
    scoreboardHeader.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
});


// =============================
// PAGE SETUP / EVENT LISTENERS
// =============================

function openPlayerInput() {
    // load saved names into form
    const savedRed = localStorage.getItem("redPlayerName") || "";
    const savedYellow = localStorage.getItem("yellowPlayerName") || "";

    document.getElementById("redPlayerName").value = savedRed;
    document.getElementById("yellowPlayerName").value = savedYellow;

    playerInput.classList.add("open-popup"); // show popup
}

function closePlayerInput() {
    playerInput.classList.remove("open-popup"); // hide popup
}

function savePlayerNames(e) {
    e.preventDefault(); // stop reload

    // get input values
    const redPlayerName = document.getElementById("redPlayerName").value || "Red";
    const yellowPlayerName = document.getElementById("yellowPlayerName").value || "Yellow";

    // update labels
    document.getElementById("redPlayerLabel").textContent = redPlayerName;
    document.getElementById("yellowPlayerLabel").textContent = yellowPlayerName;

    // save to storage
    localStorage.setItem("redPlayerName", redPlayerName);
    localStorage.setItem("yellowPlayerName", yellowPlayerName);

    closePlayerInput();
}

function loadPlayerNames() {
    // load names or defaults
    const redPlayerName = localStorage.getItem("redPlayerName") || "Red";
    const yellowPlayerName = localStorage.getItem("yellowPlayerName") || "Yellow";

    document.getElementById("redPlayerLabel").textContent = redPlayerName;
    document.getElementById("yellowPlayerLabel").textContent = yellowPlayerName;
}


// =======================
// CLICK EVENT (drop disc)
// =======================
grid.addEventListener("click", (e) => {
    const clickedCell = e.target.closest(".cell");
    if (!clickedCell || gameWon) return;

    const col = Number(clickedCell.dataset.col);

    // find lowest empty row (gravity)
    for (let row = rowCount - 1; row >= 0; row--) {
        if (!board[row][col]) {

            board[row][col] = currentPlayer; // update game state

            const targetCell = document.getElementById(`${col}_${row}`);

            const gridRect = grid.getBoundingClientRect();
            const cellRect = targetCell.getBoundingClientRect();

            // create disc
            const disc = document.createElement("div");
            disc.className = `disc ${currentPlayer}`;

            // position disc above grid
            disc.style.left = `${cellRect.left - gridRect.left}px`;
            disc.style.top = `-80px`;

            discLayer.appendChild(disc);

            // animate drop
            requestAnimationFrame(() => {
                disc.style.top = `${cellRect.top - gridRect.top}px`;
            });

            // store player in cell (hidden)
            targetCell.dataset.player = currentPlayer;

            // check win
            if (checkGameBoard()) {
                if (currentPlayer === "red") {
                    redPlayerScore++;
                } else {
                    yellowPlayerScore++;
                }

                updateScoreboard();
                return;
            }

            // check draw
            if (checkDraw()) {
                return;
            }

            // switch player
            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            break;
        }
    }
});


// =======================
// SCOREBOARD FUNCTIONS
// =======================
function updateScoreboard() {
    // update UI
    document.getElementById("playerRed").textContent = redPlayerScore;
    document.getElementById("playerYellow").textContent = yellowPlayerScore;

    // save scores
    localStorage.setItem("redPlayerScore", redPlayerScore);
    localStorage.setItem("yellowPlayerScore", yellowPlayerScore);
}

function resetScore() {
    redPlayerScore = 0;
    yellowPlayerScore = 0;
    updateScoreboard();
}


// =======================
// GAMEPLAY FUNCTIONS
// =======================
function restartGame() {
    currentPlayer = "red";
    gameWon = false;

    // clear board + cell data
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            board[row][col] = null;

            const cell = document.getElementById(`${col}_${row}`);
            cell.dataset.player = "";
        }
    }

    discLayer.innerHTML = ""; // remove discs
}


// =======================
// CHECK WIN / DRAW
// =======================
function getCellValue(col, row) {
    return document.getElementById(`${col}_${row}`).dataset.player || "";
}

function checkWinner(a, b, c, d) {
    return a !== "" && a === b && b === c && c === d;
}

function checkGameBoard() {
    // horizontal
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col <= colCount - 4; col++) {
            if (checkWinner(
                getCellValue(col, row),
                getCellValue(col + 1, row),
                getCellValue(col + 2, row),
                getCellValue(col + 3, row)
            )) {
                gameWon = true;
                alert(`${currentPlayer} wins!`);
                return true;
            }
        }
    }

    // vertical
    for (let col = 0; col < colCount; col++) {
        for (let row = 0; row <= rowCount - 4; row++) {
            if (checkWinner(
                getCellValue(col, row),
                getCellValue(col, row + 1),
                getCellValue(col, row + 2),
                getCellValue(col, row + 3)
            )) {
                gameWon = true;
                alert(`${currentPlayer} wins!`);
                return true;
            }
        }
    }

    // diagonal down-right
    for (let row = 0; row <= rowCount - 4; row++) {
        for (let col = 0; col <= colCount - 4; col++) {
            if (checkWinner(
                getCellValue(col, row),
                getCellValue(col + 1, row + 1),
                getCellValue(col + 2, row + 2),
                getCellValue(col + 3, row + 3)
            )) {
                gameWon = true;
                alert(`${currentPlayer} wins!`);
                return true;
            }
        }
    }

    // diagonal up-right
    for (let row = 3; row < rowCount; row++) {
        for (let col = 0; col <= colCount - 4; col++) {
            if (checkWinner(
                getCellValue(col, row),
                getCellValue(col + 1, row - 1),
                getCellValue(col + 2, row - 2),
                getCellValue(col + 3, row - 3)
            )) {
                gameWon = true;
                alert(`${currentPlayer} wins!`);
                fireworkConfetti();
                return true;
            }
        }
    }

    return false;
}

function checkDraw() {
    if (gameWon) return false;

    // check if any empty cells remain
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            if (getCellValue(col, row) === "") {
                return false;
            }
        }
    }

    alert("It's a draw... Rematch?");
    return true;
}
