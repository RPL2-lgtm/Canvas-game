// js/player/player.js
window.G = window.G || {};
G.player = G.player || {};

class Player {
  constructor(x, y, image, raceId = 'human', mimicRaceId = null) {
    this.x = x;
    this.y = y;
    this.radius = 14;

    this.raceId = raceId;
    this.mimicRaceId = mimicRaceId;
    this.race = G.player.RACES.find((r) => r.id === raceId) || G.player.RACES[0];

    const base = G.player.buildStatsFromRace(this.race);
    this.stats = new G.player.Stats(base);
    this.expMultiplier = base.expMultiplier;
    this.attackCooldownMult = base.attackCooldownMult;

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

    this.demonKillStacks = 0;
    this.reviveReady = this.hasPassive('undead');
    this.reviveCooldown = 0;

    this.awakeningType = this.computeAwakeningType();
    this.awakeningEligible = this.awakeningType !== null;
    this.awakeningMeter = 0;
    this.awakeningActive = false;
    this.awakeningTimer = 0;
    this._awakenVampireBonus = 0;
    this._awakenAnomalyBonus = null;
  }

  hasPassive(raceId) {
    return this.raceId === raceId || this.mimicRaceId === raceId;
  }

  computeAwakeningType() {
    if (this.hasPassive('human')) return 'human';
    if (this.hasPassive('vampire')) return 'vampire';
    if (this.raceId === 'anomaly') return 'anomaly';
    return null;
  }

  update(dt, input, enemies, worldW, worldH, callbacks = {}) {
    G.player.movement.update(this, input, dt, worldW, worldH);
    this.animator.update(dt);
    G.player.attack.update(this, input, dt, enemies, callbacks.onHitEnemy);

    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    this.updatePoison(dt);
    this.updateRevive(dt);
    this.updateAwakening(dt, input);
  }

  chargeAwakening(amount) {
    if (!this.awakeningEligible || this.awakeningActive) return;
    this.awakeningMeter = Math.min(G.CONST.AWAKENING.max, this.awakeningMeter + amount);
  }

  canActivateAwakening() {
    return this.awakeningEligible && !this.awakeningActive && this.awakeningMeter >= G.CONST.AWAKENING.max;
  }

  updateAwakening(dt, input) {
    if (input.wasPressed('KeyF') && this.canActivateAwakening()) {
      this.activateAwakening();
    }
    if (this.awakeningActive) {
      this.awakeningTimer -= dt;
      if (this.awakeningTimer <= 0) this.deactivateAwakening();
    }
  }

  activateAwakening() {
    this.awakeningActive = true;
    this.awakeningTimer = G.CONST.AWAKENING.duration;
    this.awakeningMeter = 0;

    if (this.awakeningType === 'vampire') {
      this._awakenVampireBonus = 0.35;
    }
    if (this.awakeningType === 'anomaly') {
      const bonus = {
        atk: Math.round(this.stats.totalAtk * 0.3),
        def: Math.round(this.stats.totalDef * 0.3),
        speed: Math.round(this.stats.totalSpeed * 0.3),
        critChance: 0.1
      };
      this._awakenAnomalyBonus = bonus;
      this.stats.bonus.atk += bonus.atk;
      this.stats.bonus.def += bonus.def;
      this.stats.bonus.speed += bonus.speed;
      this.stats.bonus.critChance += bonus.critChance;
    }
  }

  deactivateAwakening() {
    this.awakeningActive = false;
    this.awakeningTimer = 0;

    if (this.awakeningType === 'vampire') {
      this._awakenVampireBonus = 0;
    }
    if (this.awakeningType === 'anomaly' && this._awakenAnomalyBonus) {
      const b = this._awakenAnomalyBonus;
      this.stats.bonus.atk -= b.atk;
      this.stats.bonus.def -= b.def;
      this.stats.bonus.speed -= b.speed;
      this.stats.bonus.critChance -= b.critChance;
      this._awakenAnomalyBonus = null;
    }
  }

  updateRevive(dt) {
    if (!this.hasPassive('undead') || this.reviveReady) return;
    this.reviveCooldown -= dt;
    if (this.reviveCooldown <= 0) this.reviveReady = true;
  }

  tryRevive() {
    if (!this.hasPassive('undead') || !this.reviveReady) return false;
    this.stats.hp = Math.round(this.stats.totalMaxHP * 0.5);
    this.reviveReady = false;
    this.reviveCooldown = 120;
    return true;
  }

  registerKill() {
    this.demonKillStacks += 1;
  }

  heal(amount) {
    let final = amount;
    if (this.hasPassive('undead')) final *= 0.5;
    if (this.hasPassive('elf')) final *= 1.15;
    this.stats.heal(final);
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
    const finalDps = this.hasPassive('vampire') ? dps * 2 : dps;
    this.poison.active = true;
    this.poison.dps = Math.max(this.poison.dps, finalDps);
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
    this.chargeAwakening(dealt * G.CONST.AWAKENING.chargeFromDamageTaken);
    return dealt;
  }

  grantExp(amount) {
    return this.levelSystem.grantExp(Math.round(amount * this.expMultiplier));
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

    if (this.awakeningActive) {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(performance.now() / 100) * 0.15;
      ctx.strokeStyle = '#ff5fd1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, this.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
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