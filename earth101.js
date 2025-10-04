const gameWidth = 400;
const gameHeight = 600;
const rocketWidth = 40;
const rocketHeight = 60;
const circleRadius = 20;
const totalToWin = 101;

let rocketX = gameWidth / 2 - rocketWidth / 2;
let rocketY = gameHeight - rocketHeight - 10;
let circles = [];
let avoided = 0;
let gameOver = false;

const gameContainer = document.createElement("div");
gameContainer.style.position = "relative";
gameContainer.style.width = gameWidth + "px";
gameContainer.style.height = gameHeight + "px";
gameContainer.style.background = "#222";
gameContainer.style.margin = "40px auto";
gameContainer.style.overflow = "hidden";
document.body.appendChild(gameContainer);

const counter = document.createElement("div");
counter.style.color = "white";
counter.style.fontSize = "24px";
counter.style.position = "absolute";
counter.style.top = "10px";
counter.style.left = "10px";
counter.innerText = `Avoided: 0`;
gameContainer.appendChild(counter);

function drawRocket() {
  let rocket = document.getElementById("rocket");
  if (!rocket) {
    rocket = document.createElement("div");
    rocket.id = "rocket";
    rocket.style.position = "absolute";
    rocket.style.width = rocketWidth + "px";
    rocket.style.height = rocketHeight + "px";
    rocket.style.background = "linear-gradient(to bottom, #fff 60%, #f00 100%)";
    rocket.style.borderRadius = "20px 20px 10px 10px";
    rocket.style.zIndex = 2;
    gameContainer.appendChild(rocket);
  }
  rocket.style.left = rocketX + "px";
  rocket.style.top = rocketY + "px";
}

const maxSpeed = 25; // You can adjust this value

function spawnCircle() {
  const minRadius = 8;
  const radius = Math.random() * (circleRadius - minRadius) + minRadius;
  const x = Math.random() * (gameWidth - radius * 2);
  // Generate two random colors for the gradient
  const color1 = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
  const color2 = `hsl(${Math.floor(Math.random() * 360)}, 80%, 40%)`;
  const speed = Math.random() * (maxSpeed - 2) + 8; // Random speed between 2 and maxSpeed
  circles.push({ x, y: -radius * 2, radius, color1, color2, speed });
}

function drawCircles() {
  // Remove old circles
  document.querySelectorAll(".circle").forEach((c) => c.remove());
  circles.forEach((circle) => {
    const c = document.createElement("div");
    c.className = "circle";
    c.style.position = "absolute";
    c.style.width = circle.radius * 2 + "px";
    c.style.height = circle.radius * 2 + "px";
    c.style.left = circle.x + "px";
    c.style.top = circle.y + "px";
    c.style.background = `linear-gradient(135deg, ${circle.color1}, ${circle.color2})`;
    c.style.borderRadius = "50%";
    c.style.zIndex = 1;
    gameContainer.appendChild(c);
  });
}

function moveCircles() {
  circles.forEach((circle) => {
    circle.y += circle.speed;
  });
  // Remove circles that have gone past the rocket
  circles = circles.filter((circle) => {
    if (circle.y > gameHeight) {
      avoided++;
      counter.innerText = `Avoided: ${avoided}`;
      return false;
    }
    return true;
  });
}

function showEndScreen(message) {
  endScreen = document.createElement("div");
  endScreen.style.position = "absolute";
  endScreen.style.top = "0";
  endScreen.style.left = "0";
  endScreen.style.width = "100%";
  endScreen.style.height = "100%";
  endScreen.style.background = "rgba(0,0,0,0.85)";
  endScreen.style.display = "flex";
  endScreen.style.flexDirection = "column";
  endScreen.style.justifyContent = "center";
  endScreen.style.alignItems = "center";
  endScreen.style.zIndex = "10";
  endScreen.innerHTML = `
    <h1 style="color:white;">${message}</h1>
    <button id="restart-btn" style="font-size:2rem;padding:1rem 2rem;">Restart</button>
  `;
  gameContainer.appendChild(endScreen);

  document.getElementById("restart-btn").onclick = () => {
    endScreen.remove();
    resetGame();
    holdingScreen.style.display = "flex";
  };
}

function resetGame() {
  rocketX = gameWidth / 2 - rocketWidth / 2;
  rocketY = gameHeight - rocketHeight - 10;
  circles = [];
  avoided = 0;
  gameOver = false;
  counter.innerText = `Avoided: 0`;
  drawRocket();
  drawCircles();
}

// --- Modify game over and win logic ---
function checkCollision() {
  for (let circle of circles) {
    const distX = Math.abs(
      circle.x + circle.radius - (rocketX + rocketWidth / 2)
    );
    const distY = Math.abs(
      circle.y + circle.radius - (rocketY + rocketHeight / 2)
    );
    if (
      distX < rocketWidth / 2 + circle.radius &&
      distY < rocketHeight / 2 + circle.radius
    ) {
      gameOver = true;
      showEndScreen("Game Over! 🚀");
      break;
    }
  }
}

function checkWin() {
  if (avoided >= totalToWin) {
    gameOver = true;
    showEndScreen("You made it to Earth! 🚀");
  }
}

// --- Holding Screen ---
const holdingScreen = document.createElement("div");
holdingScreen.style.position = "absolute";
holdingScreen.style.top = "0";
holdingScreen.style.left = "0";
holdingScreen.style.width = "100%";
holdingScreen.style.height = "100%";
holdingScreen.style.background = "rgba(0,0,0,0.85)";
holdingScreen.style.display = "flex";
holdingScreen.style.flexDirection = "column";
holdingScreen.style.justifyContent = "center";
holdingScreen.style.alignItems = "center";
holdingScreen.style.zIndex = "10";
holdingScreen.innerHTML = `
  <h1 style="color:white;">Earth 101</h1>
  <button id="play-btn" style="font-size:2rem;padding:1rem 2rem;">Play</button>
`;
gameContainer.appendChild(holdingScreen);

let gameStarted = false;
function gameLoop() {
  if (!gameStarted || gameOver) return;
  if (Math.random() < 0.03) spawnCircle();
  moveCircles();
  drawRocket();
  drawCircles();
  checkCollision();
  checkWin();
  requestAnimationFrame(gameLoop);
}

document.getElementById("play-btn").onclick = () => {
  holdingScreen.style.display = "none";
  gameStarted = true;
  resetGame();
  gameLoop();
};

// --- Prevent game from starting automatically ---
drawRocket();
drawCircles();

window.addEventListener("keydown", (e) => {
  if (!gameStarted || gameOver) return;
  if (e.key === "ArrowLeft") {
    rocketX = Math.max(0, rocketX - 20);
  }
  if (e.key === "ArrowRight") {
    rocketX = Math.min(gameWidth - rocketWidth, rocketX + 20);
  }
  if (e.key === "ArrowUp") {
    rocketY = Math.max(0, rocketY - 20);
  }
  if (e.key === "ArrowDown") {
    rocketY = Math.min(gameHeight - rocketHeight, rocketY + 20);
  }
});
