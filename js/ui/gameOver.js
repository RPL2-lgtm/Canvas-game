// js/ui/gameOver.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.gameOver = {
  el: null,

  init(callbacks) {
    this.el = document.getElementById('gameover-overlay');
    document.getElementById('btn-gameover-restart').onclick = () => callbacks.onRestart();
  },

  show(waveManager, player) {
    const best = G.core.save.updateHighscore(waveManager.waveNumber, player.levelSystem.level);
    document.getElementById('gameover-stats').innerHTML = `
      <p>Kamu bertahan sampai <strong>Wave ${waveManager.waveNumber}</strong></p>
      <p>Level akhir: <strong>${player.levelSystem.level}</strong></p>
      <p>Gold terkumpul: <strong>${player.gold}</strong></p>
      <hr/>
      <p>Rekor terbaik — Wave: <strong>${best.bestWave}</strong>, Level: <strong>${best.bestLevel}</strong></p>
    `;
    this.el.classList.add('visible');
  },

  hide() {
    this.el.classList.remove('visible');
  }
};
