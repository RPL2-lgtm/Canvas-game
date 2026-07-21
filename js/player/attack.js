// js/player/attack.js
window.G = window.G || {};
G.player = G.player || {};

const DIR_VECTOR = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

G.player.attack = {
  cooldown: 0.35,

  update(player, input, dt, enemies, onHit) {
    if (player.attackTimer > 0) player.attackTimer -= dt;
    if (player.swingTimer > 0) {
      player.swingTimer -= dt;
      if (player.swingTimer <= 0) player.isSwinging = false;
    }

    const wantsAttack = input.isDown('Space') || input.mouse.justClicked;
    if (wantsAttack && player.attackTimer <= 0) {
      this.performAttack(player, enemies, onHit);
      player.attackTimer = this.cooldown;
      player.isSwinging = true;
      player.swingTimer = 0.18;
    }
  },

  performAttack(player, enemies, onHit) {
    const dir = DIR_VECTOR[player.animator.direction] || DIR_VECTOR.down;
    const range = 46;
    const hitX = player.x + dir.x * range * 0.6;
    const hitY = player.y + dir.y * range * 0.6;

    enemies.forEach((enemy) => {
      if (enemy.dead) return;
      const dist = G.utils.math.distance(hitX, hitY, enemy.x, enemy.y);
      if (dist < range) {
        const isCrit = Math.random() < player.stats.totalCrit;
        const dmg = Math.round(player.stats.totalAtk * (isCrit ? 1.8 : 1));
        enemy.takeDamage(dmg);
        if (onHit) onHit(enemy, dmg, isCrit);
      }
    });
  }
};
