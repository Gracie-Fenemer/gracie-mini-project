const rows = 5;
const cols = 7;
const board = Array.from({ length: rows }, () => Array(cols).fill(null));
let currentPlayer = "red";

const gridFront = document.getElementById("grid");
const discLayer = document.getElementById("disc-layer");

gridFront.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;

  const col = Number(cell.dataset.col);

  for (let row = rows - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;

      const targetCell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );

      const gridRect = gridFront.getBoundingClientRect();
      const cellRect = targetCell.getBoundingClientRect();

      const disc = document.createElement("div");
      disc.className = `disc ${currentPlayer}`;

      disc.style.left = `${cellRect.left - gridRect.left}px`;
      disc.style.top = `-80px`;

      discLayer.appendChild(disc);

      requestAnimationFrame(() => {
        disc.style.top = `${cellRect.top - gridRect.top}px`;
      });

      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      break;
    }
  }
});

const cells = document.querySelectorAll(".cell");

cells.forEach(cell => {
  cell.addEventListener("mouseenter", () => {
    const col = cell.dataset.col;

    document.querySelectorAll(`.cell[data-col="${col}"]`)
      .forEach(c => c.classList.add("hover-col"));
  });

  cell.addEventListener("mouseleave", () => {
    document.querySelectorAll(".cell")
      .forEach(c => c.classList.remove("hover-col"));
  });
});
