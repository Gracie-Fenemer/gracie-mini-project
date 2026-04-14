// Variables

var currentPlayer = "O";
var won = false;

let scoreX = localStorage.getItem("scoreX") || 0;
let scoreO = localStorage.getItem("scoreO") || 0;

scoreX = parseInt(scoreX);
scoreO = parseInt(scoreO);

const scoreboard = document.getElementById("scoreboard");
const header = document.getElementById("scoreboardHeader");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;


// Functions

function updateScoreboard() {
    document.getElementById("scoreX").textContent = scoreX;
    document.getElementById("scoreO").textContent = scoreO;

    localStorage.setItem("scoreX", scoreX);
    localStorage.setItem("scoreO", scoreO);
}


function place(box) {
    if(box.innerText != "" || won) return;

    box.innerText = currentPlayer;

    // Trigger pulse animation
    box.classList.add("pulse");
    setTimeout(() => box.classList.remove("pulse"), 400); // remove after animation

    currentPlayer == "O" ? 
    currentPlayer = "X" : 
    currentPlayer = "O";
    checkGameBoard();   
    checkDraw();

    // Show the "Next player!" message
    const msg = document.getElementById("message");
    msg.style.display = "block";

    // Hide it after 5 seconds
    setTimeout(() => {
        msg.style.display = "none";
    }, 1000);
}    


function checkGameBoard() {
    for(var i = 0; i <= 2; i++) {
        checkWinner(document.getElementById(i + "_0").innerText,
            document.getElementById(i + "_1").innerText,
            document.getElementById(i + "_2").innerText);
        checkWinner(document.getElementById("0_" + i).innerText,
            document.getElementById("1_" + i).innerText,
            document.getElementById("2_" + i).innerText);
    }
        checkWinner(document.getElementById("0_0").innerText,
            document.getElementById("1_1").innerText,
            document.getElementById("2_2").innerText);
        checkWinner(document.getElementById("0_2").innerText,
            document.getElementById("1_1").innerText,
            document.getElementById("2_0").innerText);
}


function checkWinner(first, second, third) {
    if (won) return; // prevents double scoring

    if (first != "" && first == second && first == third) {

        won = true;

        alert("The winner is... " + first + "! Winner winner chicken dinner!");

        // 🏆 update score based on winner
        if (first === "X") {
            scoreX++;
            updateScoreboard();
        } else if (first === "O") {
            scoreO++;
            updateScoreboard();
        }

        // 🎉 confetti
        fireworkConfetti();
    }
}


function checkDraw() {
    if (won) return; // don't show draw if someone already won

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
    

function restartGame() {
    currentPlayer = "O";
    won = false;

    // Clear grid
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            document.getElementById(i + "_" + j).innerText = "";
        }
    }
    const msg = document.getElementById("message");
    msg.style.display = "none";
}


function fireworkConfetti() {
    var duration = 2 * 1000;
    var animationEnd = Date.now() + duration;

    const colors = ["#FFF5EE", "#E0BFB8", "#FAA0A0", "#E37383"];

    var defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        colors: colors
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);

        // Left burst
        confetti({
            ...defaults,
            particleCount,
            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            }
        });

        // Right burst
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


header.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", stopDrag);

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

    scoreboard.style.transform = "none"; // cancel centering
}

function stopDrag() {
    isDragging = false;
}



