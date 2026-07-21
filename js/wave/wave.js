// js/wave/wave.js
window.G = window.G || {};
G.wave = G.wave || {};

class Wave {
  constructor(number) {
    this.number = number;
    this.difficultyMult = G.wave.difficulty.multiplierFor(number);
    this.isBoss = G.wave.difficulty.isBossWave(number);
    this.enemyQueue = this.buildQueue();
  }

  buildQueue() {
    const queue = [];
    if (this.isBoss) {
      queue.push('boss');
      // tambahan goblin pendamping biar wave boss tetap ramai
      for (let i = 0; i < 2; i++) queue.push('goblin');
      return queue;
    }
    const count = G.wave.difficulty.enemyCountFor(this.number);
    for (let i = 0; i < count; i++) {
      queue.push(G.core.rng.chance(0.35) ? 'archer' : 'goblin');
    }
    return queue;
  }
}

G.wave.Wave = Wave;
