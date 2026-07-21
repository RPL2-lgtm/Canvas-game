// js/enemy/goblin.js
window.G = window.G || {};
G.enemy = G.enemy || {};

class Goblin extends G.enemy.Enemy {
  constructor(x, y, difficultyMult = 1) {
    super(x, y, {
      radius: 11,
      speed: 95,
      hp: Math.round(18 * difficultyMult),
      damage: Math.round(6 * difficultyMult),
      expReward: 8,
      color: '#27ae60',
      type: 'goblin',
      attackCooldown: 0.8
    });
  }

  update(dt, player, onPlayerDamage) {
    super.update(dt, player);
    G.enemy.ai.chase(this, player, this.speed, dt);
    this.tryAttackPlayer(player, onPlayerDamage);
  }
}

G.enemy.Goblin = Goblin;
