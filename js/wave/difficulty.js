// js/wave/difficulty.js
window.G = window.G || {};
G.wave = G.wave || {};

G.wave.difficulty = {
  multiplierFor(waveNumber) {
    return 1 + waveNumber * 0.12;
  },
  enemyCountFor(waveNumber) {
    return Math.round(G.CONST.WAVE.baseEnemyCount + waveNumber * G.CONST.WAVE.countPerWave);
  },
  isBossWave(waveNumber) {
    return waveNumber % 5 === 0;
  }
};
