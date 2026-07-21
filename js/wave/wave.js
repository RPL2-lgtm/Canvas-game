// js/wave/wave.js
window.G = window.G || {};
G.wave = G.wave || {};

class Wave {
  constructor(number) {
    this.number = number;
    this.hpMult = G.wave.difficulty.hpMultiplierFor(number);
    this.dmgMult = G.wave.difficulty.dmgMultiplierFor(number);
    this.isBoss = G.wave.difficulty.isBossWave(number);
    this.enemyQueue = this.buildQueue();
  }

  rollEnemyType() {
    const roll = G.core.rng.next();
    if (roll < 0.35) return 'poison';
    if (roll < 0.35 + 0.325) return 'goblin';
    return 'archer';
  }

  buildQueue() {
    const queue = [];
    if (this.isBoss) {
      queue.push('boss');
      const companions = Math.min(20, 6 + this.number);
      for (let i = 0; i < companions; i++) queue.push(this.rollEnemyType());
      return queue;
    }
    const count = G.wave.difficulty.enemyCountFor(this.number);
    for (let i = 0; i < count; i++) {
      queue.push(this.rollEnemyType());
    }
    return queue;
  }
}

G.wave.Wave = Wave;