// js/main.js
window.G = window.G || {};

(async function () {
  const canvas = document.getElementById('game-canvas');
  canvas.width = G.CONST.CANVAS_W;
  canvas.height = G.CONST.CANVAS_H;

  G.core.input.init(canvas);

  const menuEl = document.getElementById('main-menu');
  const loadingEl = document.getElementById('loading-text');
  const startBtn = document.getElementById('btn-start');

  let assets;
  try {
    assets = await G.utils.helper.loadImages({
      playerSheet: 'assets/player/run_anim_sheet.png',
      iconsSheet: 'assets/items/icons_sheet.png'
    });
    loadingEl.textContent = 'Siap dimainkan!';
    startBtn.disabled = false;
  } catch (err) {
    loadingEl.textContent = 'Gagal memuat asset. Cek console untuk detail.';
    console.error(err);
    return;
  }

  const best = G.core.save.read();
  if (best) {
    document.getElementById('best-score').textContent =
      `Rekor terbaik — Wave ${best.bestWave || 0}, Level ${best.bestLevel || 1}`;
  }

  let game = null;

  startBtn.addEventListener('click', () => {
    menuEl.classList.remove('visible');
    canvas.classList.add('visible');
    document.getElementById('hud-hint').classList.add('visible');

    if (!game) {
      game = new G.Game(canvas, assets);
      game.start();
    } else {
      game.restart();
    }
  });

  // tombol restart di layar game over & pause juga harus kembali sinkron dengan instance game
  document.getElementById('btn-gameover-restart').addEventListener('click', () => {
    if (game) game.restart();
  });
  document.getElementById('btn-restart').addEventListener('click', () => {
    if (game) game.restart();
  });
})();
