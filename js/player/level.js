// js/player/level.js
window.G = window.G || {};
G.player = G.player || {};

class LevelSystem {
  constructor(stats, expSystem) {
    this.level = 1;
    this.stats = stats;
    this.exp = expSystem;
    this.onLevelUp = null; // callback opsional, dipasang dari player.js untuk trigger efek visual
  }

  grantExp(amount) {
    const gained = this.exp.addExp(amount);
    if (gained > 0) {
      this.level += gained;
      this.stats.applyLevelUp(gained);
      if (this.onLevelUp) this.onLevelUp(this.level);
    }
    return gained;
  }
}

G.player.LevelSystem = LevelSystem;
