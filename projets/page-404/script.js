const board = document.getElementById("board");
const status = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let cells = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    if (cell) {
      div.textContent = cell;
      div.classList.add("taken");
    } else {
      div.addEventListener("click", () => handleClick(index, div));
    }
    board.appendChild(div);
  });
}

function handleClick(index, cellDiv) {
  if (cells[index] || gameOver) return;

  cells[index] = currentPlayer;
  cellDiv.textContent = currentPlayer;
  cellDiv.classList.add("taken", "clicked");
  setTimeout(() => cellDiv.classList.remove("clicked"), 300);

  if (checkWin(currentPlayer)) {
    status.textContent = `Le joueur ${currentPlayer} a gagné !`;
    gameOver = true;
    return;
  }

  if (cells.every((cell) => cell)) {
    status.textContent = "Match nul !";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    status.textContent = "Tour de l'IA...";
    setTimeout(aiMove, 500);
  } else {
    status.textContent = "À ton tour !";
  }
}

function aiMove() {
  if (gameOver) return;

  const bestMove = getBestMove();
  cells[bestMove] = "O";

  const cellDiv = board.children[bestMove];
  cellDiv.textContent = "O";
  cellDiv.classList.add("taken", "clicked");
  setTimeout(() => cellDiv.classList.remove("clicked"), 300);

  if (checkWin("O")) {
    status.textContent = "L'IA a gagné !";
    gameOver = true;
    return;
  }

  if (cells.every((cell) => cell)) {
    status.textContent = "Match nul !";
    gameOver = true;
    return;
  }

  currentPlayer = "X";
  status.textContent = "À ton tour !";
}

function getBestMove() {
  // 1. Win if possible
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = "O";
      if (checkWin("O")) {
        cells[i] = null;
        return i;
      }
      cells[i] = null;
    }
  }
  // 2. Block player
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = "X";
      if (checkWin("X")) {
        cells[i] = null;
        return i;
      }
      cells[i] = null;
    }
  }
  // 3. Take center
  if (!cells[4]) return 4;

  // 4. Random move
  const empty = cells.map((c, i) => (!c ? i : null)).filter((i) => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWin(player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winCombos.some((combo) =>
    combo.every((index) => cells[index] === player)
  );
}

resetBtn.addEventListener("click", () => {
  cells = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  status.textContent = "Joueur X commence";
  renderBoard();
});

renderBoard();
