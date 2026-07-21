// js/enemy/archer.js
window.G = window.G || {};
G.enemy = G.enemy || {};

class Archer extends G.enemy.Enemy {
  constructor(x, y, hpMult = 1, dmgMult = 1) {
    super(x, y, {
      radius: 11,
      speed: 60,
      hp: Math.round(10 * hpMult),
      damage: Math.round(3 * dmgMult),
      expReward: 5,
      color: '#8e44ad',
      type: 'archer',
      attackCooldown: 1.6
    });
    this.preferredDist = 160;
  }

  update(dt, player, spawnProjectile) {
    super.update(dt, player);
    G.enemy.ai.keepDistance(this, player, this.preferredDist, this.speed, dt);

    const dist = G.utils.math.distance(this.x, this.y, player.x, player.y);
    if (dist < 260 && this.attackTimer <= 0) {
      this.attackTimer = this.attackCooldown;
      const dir = G.utils.math.normalize(player.x - this.x, player.y - this.y);
      spawnProjectile({
        x: this.x, y: this.y,
        vx: dir.x * 180, vy: dir.y * 180,
        damage: this.damage,
        owner: 'enemy',
        radius: 4
      });
    }
  }
}

G.enemy.Archer = Archer;