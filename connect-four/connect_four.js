// =======================
// GAME SETUP (variables)
// =======================

const rows = 5; // number of rows
const cols = 7; // number of columns

// Creates empty board to keep track of which cells are picked
const board = Array.from({ length: rows }, () => Array(cols).fill(null));

// Starting player
let currentPlayer = "red";


// =======================
// DOM ELEMENTS
// =======================

// Getting HTML elements for the grid (different layers for disc placement/animation)
const gridFront = document.getElementById("grid");
const discLayer = document.getElementById("disc-layer");
const cells = document.querySelectorAll(".cell");


// =======================
// CLICK EVENT (drop disc)
// =======================

gridFront.addEventListener("click", (e) => {

  // Find clicked cell
  const cell = e.target.closest(".cell");
  if (!cell) return;

  const col = Number(cell.dataset.col);

  // Find lowest empty row (gravity aspect of game)
  for (let row = rows - 1; row >= 0; row--) {

    if (!board[row][col]) {

      // Save cell selection
      board[row][col] = currentPlayer;

      // Show correct cell on screen
      const targetCell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );

      // HTML DOM - gets positions and size of elements from browser so discs can match
      // line 59 for reference
      const gridRect = gridFront.getBoundingClientRect();
      const cellRect = targetCell.getBoundingClientRect();

      // create disc
      const disc = document.createElement("div");
      disc.className = `disc ${currentPlayer}`;

      // Starting position (above grid for drop animation)
      disc.style.left = `${cellRect.left - gridRect.left}px`;
      disc.style.top = `-80px`;

      // Add to page
      discLayer.appendChild(disc);

      // Drop animation
      requestAnimationFrame(() => {
        disc.style.top = `${cellRect.top - gridRect.top}px`;
      });

      // Switch player - if current is red, change to yellow, otherwise change to red
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";

      break;
    }
  }
});


// =======================
// HOVER EFFECT (column highlight)
// =======================

cells.forEach(cell => {

  // Find which cell mouse enters and returns column of cell 
  cell.addEventListener("mouseenter", () => {
    const col = cell.dataset.col;

    // Highlight whole column 
    document.querySelectorAll(`.cell[data-col="${col}"]`)
      .forEach(c => c.classList.add("hover-col"));
  });

  // Mouse leaves cell
  cell.addEventListener("mouseleave", () => {

    // Remove highlight when mouse leaves
    document.querySelectorAll(".cell")
      .forEach(c => c.classList.remove("hover-col"));
  });
});
