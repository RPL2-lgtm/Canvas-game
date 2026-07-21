// js/player/player.js
window.G = window.G || {};
G.player = G.player || {};

class Player {
  constructor(x, y, image, raceId = 'human', mimicRaceId = null) {
    this.x = x;
    this.y = y;
    this.radius = 14;

    this.raceId = raceId;
    this.mimicRaceId = mimicRaceId; // dipakai khusus Anomaly buat "copy" passive race lain
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
    this.inventory = []; // list item id yang sudah dipungut
    this.gold = 0;

    this.invulnTimer = 0; // jeda kebal sesaat setelah kena hit

    // status racun: dps = damage per detik, timeLeft = sisa durasi racun aktif
    this.poison = { active: false, dps: 0, timeLeft: 0, tickTimer: 0 };

    // state khusus passive race
    this.demonKillStacks = 0;     // Demon: +0.05% damage tiap kill, menumpuk
    this.reviveReady = this.hasPassive('undead');
    this.reviveCooldown = 0;      // Undead: revive tiap 120 detik
  }

  // true kalau race player ATAU race yang di-mimic (khusus Anomaly) cocok
  hasPassive(raceId) {
    return this.raceId === raceId || this.mimicRaceId === raceId;
  }

  update(dt, input, enemies, worldW, worldH, callbacks = {}) {
    G.player.movement.update(this, input, dt, worldW, worldH);
    this.animator.update(dt);
    G.player.attack.update(this, input, dt, enemies, callbacks.onHitEnemy);

    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    this.updatePoison(dt);
    this.updateRevive(dt);
  }

  // Undead: hitung mundur cooldown revive selama belum "siap"
  updateRevive(dt) {
    if (!this.hasPassive('undead') || this.reviveReady) return;
    this.reviveCooldown -= dt;
    if (this.reviveCooldown <= 0) this.reviveReady = true;
  }

  // dipanggil dari game.js pas player mau mati; return true kalau berhasil revive
  tryRevive() {
    if (!this.hasPassive('undead') || !this.reviveReady) return false;
    this.stats.hp = Math.round(this.stats.totalMaxHP * 0.5);
    this.reviveReady = false;
    this.reviveCooldown = 120;
    return true;
  }

  // dipanggil tiap ada musuh mati (dipakai buat stacking damage Demon)
  registerKill() {
    this.demonKillStacks += 1;
  }

  // Semua efek heal (potion dsb) harus lewat sini, bukan langsung stats.heal(),
  // biar modifier race (Undead -50%, Elf +15%) otomatis kepakai di mana pun.
  heal(amount) {
    let final = amount;
    if (this.hasPassive('undead')) final *= 0.5;  // trade-off: efek heal berkurang
    if (this.hasPassive('elf')) final *= 1.15;     // efek potion +15%
    this.stats.heal(final);
  }

  // racun damage-nya tetap jalan walau lagi invulnerable (racun bukan hit langsung,
  // jadi gak kena mekanisme kebal sesaat)
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
    // Vampire weakness: racun 2x lebih parah
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
    return dealt;
  }

  grantExp(amount) {
    // XP Gain star race dikalikan di sini
    return this.levelSystem.grantExp(Math.round(amount * this.expMultiplier));
  }

  addItem(itemId) {
    this.inventory.push(itemId);
  }

  draw(ctx, camera) {
    const screen = camera.worldToScreen(this.x, this.y);

    // indikator status racun
    if (this.poison.active) {
      ctx.save();
      ctx.globalAlpha = 0.35 + Math.sin(performance.now() / 150) * 0.1;
      ctx.fillStyle = '#7cd66b';
      ctx.beginPath();
      ctx.arc(screen.x, screen.y + 14, this.radius + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // efek kedip saat invulnerable
    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    this.animator.draw(ctx, screen.x, screen.y);
    ctx.globalAlpha = 1;

    // ayunan senjata sederhana: icon senjata muncul di sisi arah hadap saat menyerang
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
