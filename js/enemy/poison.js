// js/enemy/poison.js
window.G = window.G || {};
G.enemy = G.enemy || {};

class PoisonEnemy extends G.enemy.Enemy {
  constructor(x, y, hpMult = 1, dmgMult = 1) {
    super(x, y, {
      radius: 11,
      speed: 80,
      hp: Math.round(12 * hpMult),
      damage: Math.round(2 * dmgMult), // damage kontak langsung dibikin kecil, racunnya yang berbahaya
      expReward: 6,
      color: '#e67e22', // oranye, sesuai request
      type: 'poison',
      attackCooldown: 1
    });
    this.poisonDamage = Math.max(1, Math.round(2 * dmgMult));
    this.poisonDuration = 4; // detik racun aktif di player
  }

  update(dt, player, onPlayerDamage) {
    super.update(dt, player);
    G.enemy.ai.chase(this, player, this.speed, dt);
    this.tryAttackPlayer(player, onPlayerDamage);
  }

  // override: selain damage kontak, juga nempelin status racun ke player
  tryAttackPlayer(player, onDamage) {
    const dist = G.utils.math.distance(this.x, this.y, player.x, player.y);
    if (dist < this.radius + player.radius + 4 && this.attackTimer <= 0) {
      const dealt = player.takeDamage(this.damage);
      player.applyPoison(this.poisonDamage, this.poisonDuration);
      this.attackTimer = this.attackCooldown;
      if (onDamage) onDamage(dealt, false, true); // argumen ke-3: kena racun
    }
  }
}

G.enemy.PoisonEnemy = PoisonEnemy;
