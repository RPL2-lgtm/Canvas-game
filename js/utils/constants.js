// js/utils/constants.js
// Konfigurasi global game. Ubah nilai di sini untuk tuning cepat.

window.G = window.G || {};
G.utils = G.utils || {};

G.CONST = {
  CANVAS_W: 960,
  CANVAS_H: 540,
  TILE_SIZE: 32,

  // --- Player sprite sheet (assets/player/run_anim_sheet.png) ---
  // Sheet terdeteksi berukuran 64x128 = grid 4 kolom x 8 baris, tiap frame 16x16.
  // Asumsi mapping baris: tiap arah pakai 2 baris (idle di baris genap, run di baris ganjil).
  // Kalau posisi karakter kelihatan salah arah, tinggal ubah PLAYER_ROW_MAP di bawah.
  PLAYER_SHEET: {
    frameW: 16,
    frameH: 16,
    cols: 4,
    rows: 8,
    scale: 2.5 // ukuran render di canvas = 16*2.5 = 40px
  },
  PLAYER_ROW_MAP: {
    down:  { idleRow: 0, runRow: 1 },
    left:  { idleRow: 2, runRow: 3 },
    right: { idleRow: 4, runRow: 5 },
    up:    { idleRow: 6, runRow: 7 }
  },

  // --- Icon sheet (assets/items/icons_sheet.png) ---
  // Berisi weapon icons (kiri, grid 16x16) & item icons (kanan, grid lebih besar ~16-24px).
  // Rect di bawah adalah perkiraan (x, y, w, h) hasil crop manual — silakan geser dikit
  // kalau meleset, tinggal edit angkanya saja, tidak usah sentuh kode lain.
  ICONS: {
    sword:   { x: 16,  y: 32, w: 16, h: 16 },
    dagger:  { x: 16,  y: 96, w: 16, h: 16 },
    axe:     { x: 0,   y: 16, w: 16, h: 16 }, // pickaxe dipakai sbg placeholder axe
    bow:     { x: 32,  y: 96, w: 16, h: 16 },
    shield:  { x: 176, y: 48, w: 16, h: 16 },
    potion:  { x: 224, y: 48, w: 16, h: 16 },
    gem:     { x: 208, y: 0,  w: 16, h: 16 },
    key:     { x: 240, y: 0,  w: 16, h: 16 },
    heart:   { x: 224, y: 128,w: 16, h: 16 },
    coin:    { x: 176, y: 0,  w: 16, h: 16 },
    clover:  { x: 240, y: 128,w: 16, h: 16 } // untuk item "luck"
  },

  DIRECTIONS: ['down', 'left', 'right', 'up'],

  PLAYER_BASE: {
    maxHP: 100,
    atk: 10,
    def: 2,
    speed: 140, // px/detik
    critChance: 0.05
  },

  WAVE: {
    baseEnemyCount: 4,
    countPerWave: 1.4,
    timeBetweenWaves: 4 // detik jeda setelah wave clear
  },

  STORAGE_KEY: 'canvas_game_save_v1'
};
