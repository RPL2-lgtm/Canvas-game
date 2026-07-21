// js/utils/helper.js
window.G = window.G || {};
G.utils = G.utils || {};

G.utils.helper = {
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error('Gagal load asset: ' + src));
      img.src = src;
    });
  },

  async loadImages(map) {
    const entries = Object.entries(map);
    const loaded = await Promise.all(entries.map(([key, src]) => this.loadImage(src)));
    const out = {};
    entries.forEach(([key], i) => (out[key] = loaded[i]));
    return out;
  },

  rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  },

  circleOverlap(ax, ay, ar, bx, by, br) {
    const dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy) < ar + br;
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }
};
