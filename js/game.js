// ============================================
// SETUP CANVAS
// ============================================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // biar pixel art tetap tajam, ga blur

// Biar keyboard event ke-capture dengan baik
canvas.setAttribute('tabindex', '0');
window.addEventListener('load', () => canvas.focus());

// ============================================
// ASSET: BACKGROUND
// Taruh file gambar background kamu di: assets/images/bg.png
// ============================================
const bgImg = new Image();
let bgLoaded = false;
bgImg.onload = () => { bgLoaded = true; };
bgImg.src = 'assets/images/bg.png';

// ============================================
// ASSET: SPRITE SHEET KARAKTER (nanti diisi)
// Taruh file sprite kamu di: assets/images/walk_anim_sheet.png
// Ganti FRAME_WIDTH, FRAME_HEIGHT, TOTAL_FRAMES sesuai sprite sheet asli
// ============================================
const walkSheet = new Image();
let walkSheetLoaded = false;
walkSheet.onload = () => { walkSheetLoaded = true; };
walkSheet.src = 'assets/images/walk_anim_sheet.png'; // sesuaikan nama file

const SPRITE = {
  frameWidth: 32,     // TODO: ganti sesuai ukuran 1 frame sprite sheet kamu
  frameHeight: 32,    // TODO: ganti sesuai ukuran 1 frame sprite sheet kamu
  totalFrames: 14,    // TODO: sesuaikan jumlah frame animasi (14 sesuai yang kamu punya)
  frameSpeed: 6,      // makin kecil = animasi makin cepat (dalam tick)
};

let currentFrame = 0;
let frameTimer = 0;

// ============================================
// DOM ELEMENTS
// ============================================
const promptEl = document.getElementById('prompt');
const dialogBox = document.getElementById('dialogBox');
const dialogText = document.getElementById('dialogText');
const choicesEl = document.getElementById('choices');
const goldCountEl = document.getElementById('goldCount');
const floatTextEl = document.getElementById('floatText');

let gold = 0;

// ============================================
// PLAYER
// ============================================
const player = {
  x: 100,
  y: (canvas.height - 28) / 2, // otomatis center vertikal
  w: 28,
  h: 28,
  speed: 3,
  color: '#4fc3f7', // dipakai selama belum ada sprite
  facing: 1,         // 1 = hadap kanan, -1 = hadap kiri
  moving: false,
};

// ============================================
// MONSTER
// ============================================
const monster = {
  x: 420,
  y: (canvas.height - 32) / 2,
  w: 32,
  h: 32,
  color: '#e57373',
  alive: true,
  name: 'Goblin Liar',
};

// ============================================
// INPUT
// ============================================
const keys = {};
let interactionEnabled = false;
let dialogOpen = false;

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;

  // cegah scroll halaman waktu pakai arrow key
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }

  if (e.key.toLowerCase() === 'e' && interactionEnabled && !dialogOpen && monster.alive) {
    openDialog();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// ============================================
// UTIL
// ============================================
function distance(a, b) {
  const dx = (a.x + a.w / 2) - (b.x + b.w / 2);
  const dy = (a.y + a.h / 2) - (b.y + b.h / 2);
  return Math.sqrt(dx * dx + dy * dy);
}

// ============================================
// DIALOG SYSTEM
// ============================================
function openDialog() {
  dialogOpen = true;
  dialogBox.style.display = 'block';
  dialogText.textContent = monster.name + ': "Hei manusia... mau apa kau di sini?"';
  choicesEl.innerHTML = '';

  const talkBtn = document.createElement('button');
  talkBtn.className = 'choiceBtn';
  talkBtn.textContent = 'Bicara';
  talkBtn.onclick = () => choose('talk');

  const fightBtn = document.createElement('button');
  fightBtn.className = 'choiceBtn';
  fightBtn.textContent = 'Bertarung';
  fightBtn.onclick = () => choose('fight');

  choicesEl.appendChild(talkBtn);
  choicesEl.appendChild(fightBtn);
}

function closeDialog() {
  dialogOpen = false;
  dialogBox.style.display = 'none';
  canvas.focus(); // balikin fokus ke game biar keyboard jalan lagi
}

function choose(option) {
  if (option === 'talk') {
    dialogText.textContent = monster.name + ': "Baiklah, pergilah dengan damai."';
    choicesEl.innerHTML = '';
    const okBtn = document.createElement('button');
    okBtn.className = 'choiceBtn';
    okBtn.textContent = 'Oke';
    okBtn.onclick = closeDialog;
    choicesEl.appendChild(okBtn);
  } else if (option === 'fight') {
    closeDialog();
    doFight();
  }
}

// ============================================
// COMBAT
// ============================================
let slash = null; // { x, y, timer, maxTimer }

function doFight() {
  slash = { x: monster.x + monster.w / 2, y: monster.y + monster.h / 2, timer: 0, maxTimer: 18 };
  monster.alive = false;

  const earned = 10 + Math.floor(Math.random() * 15);
  setTimeout(() => {
    gold += earned;
    goldCountEl.textContent = gold;
    showFloatText('+' + earned + ' Gold', monster.x, monster.y);
  }, 250);
}

function showFloatText(text, x, y) {
  floatTextEl.textContent = text;
  floatTextEl.style.left = x + 'px';
  floatTextEl.style.top = y + 'px';
  floatTextEl.style.display = 'block';
  floatTextEl.style.opacity = 1;
  floatTextEl.style.transition = 'none';

  requestAnimationFrame(() => {
    floatTextEl.style.transition = 'all 1s ease-out';
    floatTextEl.style.top = (y - 40) + 'px';
    floatTextEl.style.opacity = 0;
  });

  setTimeout(() => { floatTextEl.style.display = 'none'; }, 1000);
}

// ============================================
// UPDATE (game logic tiap frame)
// ============================================
function update() {
  if (dialogOpen) return;

  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) { dx -= 1; player.facing = -1; }
  if (keys['d'] || keys['arrowright']) { dx += 1; player.facing = 1; }

  player.moving = (dx !== 0 || dy !== 0);

  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  player.x += (dx / len) * player.speed;
  player.y += (dy / len) * player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

  // animasi sprite jalan
  if (player.moving) {
    frameTimer++;
    if (frameTimer > SPRITE.frameSpeed) {
      currentFrame = (currentFrame + 1) % SPRITE.totalFrames;
      frameTimer = 0;
    }
  } else {
    currentFrame = 0;
    frameTimer = 0;
  }

  if (monster.alive) {
    const d = distance(player, monster);
    interactionEnabled = d < 70;
    if (interactionEnabled) {
      promptEl.style.left = (monster.x + monster.w / 2) + 'px';
      promptEl.style.top = (monster.y - 8) + 'px';
      promptEl.style.display = 'block';
    } else {
      promptEl.style.display = 'none';
    }
  } else {
    promptEl.style.display = 'none';
  }

  if (slash) {
    slash.timer++;
    if (slash.timer > slash.maxTimer) slash = null;
  }
}

// ============================================
// DRAW
// ============================================
function drawBackground() {
  if (bgLoaded) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(10, 8, 20, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#1e2530';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawSlash() {
  if (!slash) return;
  const progress = slash.timer / slash.maxTimer;
  const alpha = 1 - progress;
  const radius = 26 + progress * 14;

  ctx.save();
  ctx.translate(slash.x, slash.y);
  ctx.rotate(-0.6 + progress * 1.4);
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = 5 - progress * 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius, -0.9, 0.9);
  ctx.stroke();

  ctx.strokeStyle = `rgba(245, 215, 110, ${alpha * 0.8})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, -0.9, 0.9);
  ctx.stroke();
  ctx.restore();
}

function drawPlayer() {
  if (walkSheetLoaded) {
    // --- MODE SPRITE: aktif otomatis begitu walk_anim_sheet.png ketemu ---
    ctx.save();
    if (player.facing === -1) {
      // flip horizontal biar sprite ngadep kiri
      ctx.translate(player.x + player.w, player.y);
      ctx.scale(-1, 1);
      ctx.drawImage(
        walkSheet,
        currentFrame * SPRITE.frameWidth, 0,
        SPRITE.frameWidth, SPRITE.frameHeight,
        0, 0,
        player.w, player.h
      );
    } else {
      ctx.drawImage(
        walkSheet,
        currentFrame * SPRITE.frameWidth, 0,
        SPRITE.frameWidth, SPRITE.frameHeight,
        player.x, player.y,
        player.w, player.h
      );
    }
    ctx.restore();
  } else {
    // --- MODE PLACEHOLDER: dipakai selama sprite belum ada ---
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2 + player.facing * 6, player.y + 8, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (monster.alive) {
    ctx.fillStyle = monster.color;
    ctx.fillRect(monster.x, monster.y, monster.w, monster.h);
    ctx.fillStyle = '#fff';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(monster.name, monster.x + monster.w / 2, monster.y - 12);
  }

  drawPlayer();
  drawSlash();
}

// ============================================
// GAME LOOP
// ============================================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
