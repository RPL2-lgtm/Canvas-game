// js/wave/difficulty.js
window.G = window.G || {};
G.wave = G.wave || {};

G.wave.difficulty = {

  // HP naik eksponensial
  hpMultiplierFor(waveNumber) {
    return Math.pow(2.0, waveNumber);
  },

  // Damage naik sedikit lebih pelan
  dmgMultiplierFor(waveNumber) {
    return Math.pow(1.15, waveNumber);
  },

  // Jumlah musuh
  enemyCountFor(waveNumber) {
    return Math.round(
      G.CONST.WAVE.baseEnemyCount +
      waveNumber * G.CONST.WAVE.countPerWave
    );
  },

  isBossWave(waveNumber) {
    return waveNumber % 5 === 0;
  }

};