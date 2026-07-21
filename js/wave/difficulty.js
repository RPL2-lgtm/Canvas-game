// js/wave/difficulty.js
window.G = window.G || {};
G.wave = G.wave || {};

G.wave.difficulty = {
  // HP musuh naik pelan-pelan biar gak jadi damage sponge yang keterlaluan
  hpMultiplierFor(waveNumber) {
    return 1 + waveNumber * 0.10;
  },
  // damage musuh naik lebih cepat tiap wave — makin lama makin berbahaya walau HP-nya gak segila itu
  dmgMultiplierFor(waveNumber) {
    return 1 + waveNumber * 0.18;
  },
  enemyCountFor(waveNumber) {
    return Math.round(G.CONST.WAVE.baseEnemyCount + waveNumber * G.CONST.WAVE.countPerWave);
  },
  isBossWave(waveNumber) {
    return waveNumber % 5 === 0;
  }
};
