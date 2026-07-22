// js/game.js
window.G = window.G || {};

class Game {
  constructor(canvas, assets, raceId = 'human', mimicRaceIds = []) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;
    this.raceId = raceId;
    this.mimicRaceIds = mimicRaceIds;

    this.worldW = G.CONST.CANVAS_W * 2.2;
    this.worldH = G.CONST.CANVAS_H * 2.2;

    this.camera = new G.core.Camera(G.CONST.CANVAS_W, G.CONST.CANVAS_H, this.worldW, this.worldH);
    this.input = G.core.input;

    this.projectiles = [];
    this.chests = [];
    this.floatingTexts = [];

    this.running = false;
    this.lastTime = 0;

    this._setupPlayer();
    this._setupWaveManager();
    this._setupUI();
  }

  _setupPlayer() {
    this.player = new G.player.Player(this.worldW / 2, this.worldH / 2, this.assets.playerSheet, this.raceId, this.mimicRaceIds);
    G.items.iconImage = this.assets.iconsSheet;
    // starter weapon supaya player tidak kosong tangan
    const starter = G.items.getById('sword_iron');
    starter.applyTo(this.player);
    this.player.addItem(starter.id);
  }

  _setupWaveManager() {
    this.waveManager = new G.wave.WaveManager(this.worldW, this.worldH);
    this.waveManager.onWaveClear = (waveNum) => {
      const tier = waveNum % 5 === 0 ? 2 : 1;
      this.chests.push(new G.chest.Chest(this.player.x + G.core.rng.range(-80, 80), this.player.y + G.core.rng.range(-80, 80), tier));
      this.pushFloatingText(this.player.x, this.player.y - 40, `Wave ${waveNum} Selesai!`, '#f1c40f');
    };
    this.waveManager.begin();
  }

  _setupUI() {
    G.ui.hud;
    G.ui.inventory.init();
    G.ui.inventory.onItemUsed = (item) => {
      this.pushFloatingText(this.player.x, this.player.y - 40, `Pakai ${item.name}`, '#6ee08a');
    };
    G.ui.statsMenu.init();
    G.chest.chestUI.init();
    G.ui.pause.init({
      onRestart: () => this.restart(), // restart dari pause: pakai race yang sama
      onSave: () => {
        G.core.save.write({
          bestWave: Math.max(this.waveManager.waveNumber, (G.core.save.read() || {}).bestWave || 0),
          bestLevel: Math.max(this.player.levelSystem.level, (G.core.save.read() || {}).bestLevel || 1)
        });
        this.pushFloatingText(this.player.x, this.player.y - 40, 'Game disimpan', '#2ecc71');
      }
    });
    G.ui.gameOver.init({ onRestart: () => this.restart() });
  }

  pushFloatingText(x, y, text, color) {
    this.floatingTexts.push({ x, y, text, color, life: 1.2, vy: -30 });
  }

  spawnProjectile(config) {
    this.projectiles.push({ ...config, life: 4 });
  }

  handleGlobalKeys() {
    if (this.input.wasPressed('Escape')) G.ui.pause.toggle();
    if (this.input.wasPressed('KeyI')) G.ui.inventory.toggle(this.player);
    if (this.input.wasPressed('KeyC')) G.ui.statsMenu.toggle(this.player);
    if (this.input.wasPressed('KeyE')) this.tryOpenChest();
  }

  tryOpenChest() {
    for (const chest of this.chests) {
      if (!chest.opened && chest.playerNearby(this.player)) {
        // kirim this.player biar Dwarf (Legendary Drop +15%) bisa dihitung
        const loot = chest.open(this.player);
        if (loot) {
          loot.items.forEach((item) => {
            // consumable (potion, dsb) cuma disimpan, baru aktif saat di-klik "Gunakan" di inventory
            if (item.type !== 'consumable') item.applyTo(this.player);
            this.player.addItem(item.id);
          });
          this.player.gold += loot.gold;
          G.chest.chestUI.show(loot);

          // penting: kalau panel inventory lagi kebuka, langsung refresh isinya
          // biar item baru langsung kelihatan tanpa harus tutup-buka lagi
          if (G.ui.inventory.visible) G.ui.inventory.render(this.player);
        }
        break;
      }
    }
  }

  updateProjectiles(dt) {
    this.projectiles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });

    // proyektil musuh vs player
    this.projectiles.forEach((p) => {
      if (p.owner !== 'enemy' || p.life <= 0) return;
      const dist = G.utils.math.distance(p.x, p.y, this.player.x, this.player.y);
      if (dist < p.radius + this.player.radius) {
        this.player.takeDamage(p.damage);
        p.life = 0;
      }
    });

    this.projectiles = this.projectiles.filter((p) => p.life > 0);
  }

  update(dt) {
    if (G.ui.pause.paused) return;

    this.handleGlobalKeys();

    this.player.update(dt, this.input, this.waveManager.enemies, this.worldW, this.worldH, {
      onHitEnemy: (enemy, dmg, isCrit) => {
        this.pushFloatingText(enemy.x, enemy.y - 16, `${dmg}${isCrit ? '!' : ''}`, isCrit ? '#f39c12' : '#fff');
        if (enemy.dead) {
          this.player.registerKill(); // dipakai buat stacking damage Demon
          const levels = this.player.grantExp(enemy.expReward);
          if (levels > 0) this.pushFloatingText(this.player.x, this.player.y - 30, 'LEVEL UP!', '#2ecc71');
        }
      }
    });

    this.waveManager.update(dt, this.player);
    this.waveManager.enemies.forEach((enemy) => {
      if (enemy.type === 'archer') {
        enemy.update(dt, this.player, (cfg) => this.spawnProjectile(cfg));
      } else if (enemy.type === 'boss') {
        enemy.update(dt, this.player, (cfg) => this.spawnProjectile(cfg), () => {});
      } else {
        enemy.update(dt, this.player, () => {});
      }
    });

    // pisahkan antar enemy biar tidak numpuk total
    const enemies = this.waveManager.enemies;
    for (let i = 0; i < enemies.length; i++) {
      for (let j = i + 1; j < enemies.length; j++) {
        G.core.collision.resolveCircle(enemies[i], enemies[j]);
      }
    }

    this.updateProjectiles(dt);

    this.floatingTexts.forEach((f) => {
      f.y += f.vy * dt;
      f.life -= dt;
    });
    this.floatingTexts = this.floatingTexts.filter((f) => f.life > 0);

    this.camera.follow(this.player.x, this.player.y);

    if (this.player.stats.isDead()) {
      // Undead: coba revive dulu sebelum beneran game over
      if (this.player.tryRevive()) {
        this.pushFloatingText(this.player.x, this.player.y - 40, 'REVIVE!', '#c48bf5');
      } else {
        this.running = false;
        G.ui.gameOver.show(this.waveManager, this.player);
      }
    }
  }

  drawBackground() {
    const ctx = this.ctx;
    ctx.fillStyle = '#1c2b1e';
    ctx.fillRect(0, 0, G.CONST.CANVAS_W, G.CONST.CANVAS_H);

    // grid tanah sederhana biar ada rasa "dunia" tanpa perlu tileset
    const tile = G.CONST.TILE_SIZE;
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    const offsetX = -this.camera.x % tile;
    const offsetY = -this.camera.y % tile;
    for (let x = offsetX; x < G.CONST.CANVAS_W; x += tile) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, G.CONST.CANVAS_H); ctx.stroke();
    }
    for (let y = offsetY; y < G.CONST.CANVAS_H; y += tile) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(G.CONST.CANVAS_W, y); ctx.stroke();
    }
  }

  draw() {
    const ctx = this.ctx;
    this.drawBackground();

    this.chests.forEach((c) => c.draw(ctx, this.camera, c.playerNearby(this.player)));

    // urutkan entitas by Y biar ada efek depth sederhana
    const drawables = [...this.waveManager.enemies, this.player].sort((a, b) => a.y - b.y);
    drawables.forEach((d) => d.draw(ctx, this.camera));

    // proyektil
    ctx.fillStyle = '#f1c40f';
    this.projectiles.forEach((p) => {
      const s = this.camera.worldToScreen(p.x, p.y);
      ctx.beginPath();
      ctx.arc(s.x, s.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // floating text (damage numbers, dsb)
    this.floatingTexts.forEach((f) => {
      const s = this.camera.worldToScreen(f.x, f.y);
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.fillStyle = f.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f.text, s.x, s.y);
      ctx.globalAlpha = 1;
    });

    G.ui.hud.draw(ctx, this.player, this.waveManager);
  }

  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000 || 0);
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();
    this.input.endFrame();

    requestAnimationFrame((t) => this.loop(t));
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  // raceId/mimicRaceId opsional: kalau gak dikasih (misal restart dari pause menu),
  // pakai race yang lagi aktif sekarang, jangan direset ke default.
  restart(raceId, mimicRaceIds) {
    G.ui.pause.hide();
    G.ui.gameOver.hide();
    this.raceId = raceId || this.raceId;
    this.mimicRaceIds = mimicRaceIds !== undefined ? mimicRaceIds : this.mimicRaceIds;

    this.waveManager = new G.wave.WaveManager(this.worldW, this.worldH);
    this._setupWaveManager();
    this._setupPlayer();
    this.chests = [];
    this.projectiles = [];
    this.floatingTexts = [];
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }
}

G.Game = Game;
