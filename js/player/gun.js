// js/player/gun.js
window.G = window.G || {};
G.player = G.player || {};

G.player.gun = {
  update(player, dt, enemies, spawnProjectile) {
    if (player.gunTimer === undefined) player.gunTimer = 0;
    if (player.gunTimer > 0) player.gunTimer -= dt;

    if (player.gunTimer <= 0) {
      const target = this.findNearestEnemy(player, enemies);
      if (target) {
        this.fire(player, target, spawnProjectile);
        player.gunTimer = G.CONST.GUN.cooldown * (player.attackCooldownMult || 1);
      }
    }
  },

  findNearestEnemy(player, enemies) {
    let closest = null;
    let closestDist = G.CONST.GUN.range;
    enemies.forEach((e) => {
      if (e.dead) return;
      const d = G.utils.math.distance(player.x, player.y, e.x, e.y);
      if (d < closestDist) {
        closest = e;
        closestDist = d;
      }
    });
    return closest;
  },

  fire(player, target, spawnProjectile) {
    const dir = G.utils.math.normalize(target.x - player.x, target.y - player.y);
    const isPurple = player.levelSystem.level >= G.CONST.GUN.purpleAtLevel;
    const dmg = Math.round(player.stats.totalAtk * G.CONST.GUN.damageMult * player.getArmorAtkMult());

    spawnProjectile({
      x: player.x,
      y: player.y,
      vx: dir.x * G.CONST.GUN.speed,
      vy: dir.y * G.CONST.GUN.speed,
      damage: dmg,
      owner: 'player',
      radius: 6,
      sprite: isPurple ? 'purpleBullet' : 'blueBullet'
    });

    player.chargeAwakening(dmg * G.CONST.AWAKENING.chargeFromDamageDealt);
  }
};