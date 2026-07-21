// js/core/save.js
window.G = window.G || {};
G.core = G.core || {};

G.core.save = {
  write(data) {
    try {
      localStorage.setItem(G.CONST.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Gagal menyimpan save data:', e);
      return false;
    }
  },
  read() {
    try {
      const raw = localStorage.getItem(G.CONST.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Gagal membaca save data:', e);
      return null;
    }
  },
  clear() {
    localStorage.removeItem(G.CONST.STORAGE_KEY);
  },
  updateHighscore(wave, level) {
    const current = this.read() || { bestWave: 0, bestLevel: 1 };
    current.bestWave = Math.max(current.bestWave || 0, wave);
    current.bestLevel = Math.max(current.bestLevel || 1, level);
    this.write(current);
    return current;
  }
};
