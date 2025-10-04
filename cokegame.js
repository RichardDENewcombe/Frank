const gridSize = 50;
const squareSize = 10;
const gameContainer = document.getElementById("game-container");
const resetButton = document.getElementById("reset-button");

// Player state
let player = { x: 0, y: 0 };

// Generate collectibles
let collectibles = [];
for (let i = 0; i < 10; i++) {
  collectibles.push({
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
    id: "c" + i,
  });
}

// Render player and collectibles
function render() {
  gameContainer.innerHTML = "";

  // Player
  const playerDiv = document.createElement("div");
  playerDiv.className = "player";
  playerDiv.style.left = player.x * squareSize + "px";
  playerDiv.style.top = player.y * squareSize + "px";
  gameContainer.appendChild(playerDiv);

  // Collectibles
  collectibles.forEach((c) => {
    const cDiv = document.createElement("div");
    cDiv.className = "collectible";
    cDiv.style.left = c.x * squareSize + "px";
    cDiv.style.top = c.y * squareSize + "px";
    cDiv.id = c.id;
    gameContainer.appendChild(cDiv);
  });
}

// Move player
function movePlayer(dx, dy) {
  player.x = Math.max(0, Math.min(gridSize - 1, player.x + dx));
  player.y = Math.max(0, Math.min(gridSize - 1, player.y + dy));
  render();
  checkCollect();
}

// Check for collectible pickup
function checkCollect() {
  collectibles = collectibles.filter(
    (c) => !(c.x === player.x && c.y === player.y)
  );
  if (collectibles.length === 0) {
    alert("All collectibles collected!");
    resetGame();
  }
}

// Reset game
function resetGame() {
  player = { x: 0, y: 0 };
  collectibles = [];
  for (let i = 0; i < 10; i++) {
    collectibles.push({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
      id: "c" + i,
    });
  }
  render();
}

// Reset button event listener
resetButton.addEventListener("click", resetGame);

// Handle keyboard
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

document
  .getElementById("up-btn")
  .addEventListener("click", () => movePlayer(0, -1));
document
  .getElementById("down-btn")
  .addEventListener("click", () => movePlayer(0, 1));
document
  .getElementById("left-btn")
  .addEventListener("click", () => movePlayer(-1, 0));
document
  .getElementById("right-btn")
  .addEventListener("click", () => movePlayer(1, 0));

// Initial render
render();
