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
      player.attackTimer = this.cooldown * (player.attackCooldownMult || 1);
      player.isSwinging = true;
      player.swingTimer = 0.18;
    }
  },

  performAttack(player, enemies, onHit) {
    const dir = DIR_VECTOR[player.animator.direction] || DIR_VECTOR.down;
    const range = 46;
    const hitX = player.x + dir.x * range * 0.6;
    const hitY = player.y + dir.y * range * 0.6;

    let dmgMult = 1;

    if (player.hasPassive('human')) {
      if (player.awakeningActive && player.awakeningType === 'human') {
        dmgMult += 1.3;
      } else {
        const hpPct = player.stats.hp / player.stats.totalMaxHP;
        dmgMult += (1 - hpPct) * 1.3;
      }
    }
    if (player.hasPassive('demon')) {
      dmgMult *= 1 + player.demonKillStacks * 0.0005;
    }

    enemies.forEach((enemy) => {
      if (enemy.dead) return;
      const dist = G.utils.math.distance(hitX, hitY, enemy.x, enemy.y);
      if (dist < range) {
        const isCrit = Math.random() < player.stats.totalCrit;
        const dmg = Math.round(player.stats.totalAtk * (isCrit ? 1.8 : 1) * dmgMult);
        enemy.takeDamage(dmg);

        player.chargeAwakening(dmg * G.CONST.AWAKENING.chargeFromDamageDealt);

        if (player.hasPassive('vampire')) {
          const lifestealPct = 0.15 + (player.awakeningActive && player.awakeningType === 'vampire' ? player._awakenVampireBonus : 0);
          player.heal(dmg * lifestealPct);
        }

        if (onHit) onHit(enemy, dmg, isCrit);
      }
    });
  }
};