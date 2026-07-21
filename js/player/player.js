// js/player/player.js
window.G = window.G || {};
G.player = G.player || {};

class Player {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.radius = 14;

    this.stats = new G.player.Stats(G.CONST.PLAYER_BASE);
    this.expSystem = new G.player.ExpSystem();
    this.levelSystem = new G.player.LevelSystem(this.stats, this.expSystem);
    this.animator = new G.player.Animator(image);

    this.attackTimer = 0;
    this.swingTimer = 0;
    this.isSwinging = false;
    this.isMoving = false;

    this.equippedWeapon = 'sword';
    this.inventory = [];
    this.gold = 0;

    this.invulnTimer = 0;

    this.poison = { active: false, dps: 0, timeLeft: 0, tickTimer: 0 };
  }

  update(dt, input, enemies, worldW, worldH, callbacks = {}) {
    G.player.movement.update(this, input, dt, worldW, worldH);
    this.animator.update(dt);
    G.player.attack.update(this, input, dt, enemies, callbacks.onHitEnemy);

    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    this.updatePoison(dt);
  }

  updatePoison(dt) {
    if (!this.poison.active) return;
    this.poison.timeLeft -= dt;
    this.poison.tickTimer += dt;
    if (this.poison.tickTimer >= 1) {
      this.poison.tickTimer -= 1;
      this.stats.hp = G.utils.math.clamp(this.stats.hp - this.poison.dps, 0, this.stats.totalMaxHP);
    }
    if (this.poison.timeLeft <= 0) this.curePoison();
  }

  applyPoison(dps, duration) {
    this.poison.active = true;
    this.poison.dps = Math.max(this.poison.dps, dps);
    this.poison.timeLeft = Math.max(this.poison.timeLeft, duration);
  }

  curePoison() {
    this.poison.active = false;
    this.poison.dps = 0;
    this.poison.timeLeft = 0;
    this.poison.tickTimer = 0;
  }

  takeDamage(amount) {
    if (this.invulnTimer > 0) return 0;
    const dealt = this.stats.takeDamage(amount);
    this.invulnTimer = 0.6;
    return dealt;
  }

  grantExp(amount) {
    return this.levelSystem.grantExp(amount);
  }

  addItem(itemId) {
    this.inventory.push(itemId);
  }

  draw(ctx, camera) {
    const screen = camera.worldToScreen(this.x, this.y);

    if (this.poison.active) {
      ctx.save();
      ctx.globalAlpha = 0.35 + Math.sin(performance.now() / 150) * 0.1;
      ctx.fillStyle = '#7cd66b';
      ctx.beginPath();
      ctx.arc(screen.x, screen.y + 14, this.radius + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    this.animator.draw(ctx, screen.x, screen.y);
    ctx.globalAlpha = 1;

    if (this.isSwinging) {
      const icon = G.items.iconImage;
      const rect = G.CONST.ICONS[this.equippedWeapon] || G.CONST.ICONS.sword;
      if (icon) {
        const dir = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[this.animator.direction];
        const ox = screen.x + dir[0] * 26;
        const oy = screen.y + dir[1] * 26;
        ctx.drawImage(icon, rect.x, rect.y, rect.w, rect.h, ox - 12, oy - 12, 24, 24);
      }
    }
  }
}

G.player.Player = Player;