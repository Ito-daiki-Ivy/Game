const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ===== スマホ画面対応 ===== */
function resizeCanvas() {
  const scale = Math.min(
    window.innerWidth / 400,
    window.innerHeight / 600
  );
  canvas.style.width = 400 * scale + "px";
  canvas.style.height = 600 * scale + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ===== プレイヤー ===== */
const player = {
  x: 180,
  y: 520,
  width: 40,
  height: 40,
  speed: 6
};

/* ===== ゲーム状態 ===== */
let enemies = [];
let enemyTimer = 0;
let score = 0;
let gameOver = false;

/* ===== 入力（PC） ===== */
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* ===== 入力（スマホ：スライド） ===== */
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touchX = e.touches[0].clientX - rect.left;
  player.x = touchX - player.width / 2;
}, { passive: false });

/* ===== タップ・クリックでリスタート ===== */
canvas.addEventListener("click", () => {
  if (gameOver) restartGame();
});

canvas.addEventListener("touchstart", e => {
  if (gameOver) {
    e.preventDefault();
    restartGame();
  }
}, { passive: false });

function restartGame() {
  enemies = [];
  enemyTimer = 0;
  score = 0;
  gameOver = false;
  player.x = 180;
}

/* ===== 敵生成 ===== */
function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: 3 + Math.random() * 3
  });
}

/* ===== 更新 ===== */
function update() {
  if (gameOver) return;

  // プレイヤー移動（PC）
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  // 敵生成
  enemyTimer++;
  if (enemyTimer > 30) {
    createEnemy();
    enemyTimer = 0;
  }

  // 敵移動
  enemies.forEach(e => e.y += e.speed);

  // 当たり判定
  enemies.forEach(e => {
    if (
      player.x < e.x + e.size &&
      player.x + player.width > e.x &&
      player.y < e.y + e.size &&
      player.y + player.height > e.y
    ) {
      gameOver = true;
    }
  });

  enemies = enemies.filter(e => e.y < canvas.height + 50);
  score++;
}

/* ===== 描画 ===== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー
  ctx.fillStyle = "#4af";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 敵
  ctx.fillStyle = "#f44";
  enemies.forEach(e =>
    ctx.fillRect(e.x, e.y, e.size, e.size)
  );

  // スコア
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 30);

  // ゲームオーバー表示
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "32px sans-serif";
    ctx.fillText("GAME OVER", 90, 250);

    ctx.font = "20px sans-serif";
    ctx.fillText("Score: " + score, 140, 290);

    ctx.font = "18px sans-serif";
    ctx.fillText("タップでリスタート", 110, 330);
  }
}

/* ===== ループ ===== */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
