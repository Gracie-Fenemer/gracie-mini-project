var currentPlayer = "O";
var won = false;


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
    if(first != "" && first == second && first == third) {
        alert("The winner is... " + first + "! Winner winner chicken dinner!");
        won = true;

        // 🎉 Confetti on win
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





// // Confetti effect
//     const restartBtn = document.getElementById("restart");
//     const colors = ["#FFF5EE", "#E0BFB8", "#FAA0A0", "#E37383"];
    
//     for (let i = 0; i < 50; i++) {
//         const confetti = document.createElement('div');
//         const color = colors[Math.floor(Math.random() * colors.length)];
//         confetti.classList.add('confetti'); // optional class if you want CSS styling
//         confetti.style.background = color;
//         confetti.style.boxShadow = `0 0 2px 1.5px ${color}`; // glow
//         confetti.style.position = 'absolute';
//         confetti.style.width = '8px';
//         confetti.style.height = '8px';
//         confetti.style.borderRadius = '50%';
//         confetti.style.top = `${restartBtn.offsetTop}px`;
//         confetti.style.left = `${restartBtn.offsetLeft + restartBtn.offsetWidth/2}px`;
//         confetti.style.opacity = 1;
//         confetti.style.transition = 'all 1s ease-out';
//         document.body.appendChild(confetti);

//         // Animate confetti to random positions
//         setTimeout(() => {
//             confetti.style.top = `${Math.random() * window.innerHeight}px`;
//             confetti.style.left = `${Math.random() * window.innerWidth}px`;
//         }, 10);

//         // Remove confetti after 1 second
//         setTimeout(() => confetti.remove(), 1000);
//     }
