const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// プレイヤー
const player = {
  x: 180,
  y: 520,
  width: 40,
  height: 40,
  speed: 6
};

// 敵
let enemies = [];
let enemyTimer = 0;

// 状態
let score = 0;
let gameOver = false;

// 入力
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: 3 + Math.random() * 3
  });
}

function update() {
  if (gameOver) return;

  // プレイヤー移動
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

  // 敵生成
  enemyTimer++;
  if (enemyTimer > 30) {
    createEnemy();
    enemyTimer = 0;
  }

  // 敵更新
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

  // 画面外削除
  enemies = enemies.filter(e => e.y < canvas.height + 50);

  score++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー
  ctx.fillStyle = "#4af";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 敵
  ctx.fillStyle = "#f44";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));

  // スコア
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 30);

  // ゲームオーバー
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "32px sans-serif";
    ctx.fillText("GAME OVER", 90, 300);
    ctx.font = "18px sans-serif";
    ctx.fillText("リロードで再スタート", 100, 340);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
