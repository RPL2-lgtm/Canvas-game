// js/enemy/goblin.js
window.G = window.G || {};
G.enemy = G.enemy || {};

class Goblin extends G.enemy.Enemy {
  constructor(x, y, hpMult = 1, dmgMult = 1) {
    super(x, y, {
      radius: 11,
      speed: 95,
      hp: Math.round(16 * hpMult),
      damage: Math.round(3 * dmgMult),
      expReward: 4,
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