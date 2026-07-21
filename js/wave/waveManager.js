// js/wave/waveManager.js
window.G = window.G || {};
G.wave = G.wave || {};

class WaveManager {
  constructor(worldW, worldH) {
    this.worldW = worldW;
    this.worldH = worldH;
    this.waveNumber = 0;
    this.enemies = [];
    this.state = 'intermission'; // 'intermission' | 'spawning' | 'active' | 'cleared'
    this.betweenTimer = new G.core.Timer(1.5, () => this.startNextWave());
    this.spawnGap = new G.core.Timer(0.35, () => this.spawnNext(), true);
    this.pendingSpawns = [];
    this.currentWave = null;
    this.onWaveStart = null;
    this.onWaveClear = null;
  }

  startNextWave() {
    this.waveNumber++;
    this.currentWave = new G.wave.Wave(this.waveNumber);
    this.pendingSpawns = [...this.currentWave.enemyQueue];
    this.state = 'spawning';

    // penting: makin banyak musuh di 1 wave, makin cepat jeda antar-spawn-nya,
    // supaya total waktu munculnya tetap sekitar spawnWindowSeconds (gak molor berjam-jam)
    const gap = Math.max(0.04, G.CONST.WAVE.spawnWindowSeconds / this.pendingSpawns.length);
    this.spawnGap.reset(gap);

    if (this.onWaveStart) this.onWaveStart(this.waveNumber, this.currentWave.isBoss);
  }

  spawnNext(player) {
    // player di-set lewat closure saat update(); simpan referensi sementara
    if (!this._playerRef || this.pendingSpawns.length === 0) return;
    const type = this.pendingSpawns.shift();
    const pos = G.enemy.spawn.randomEdgePosition(this._playerRef, this.worldW, this.worldH);
    const enemy = G.enemy.spawn.create(
      type, pos.x, pos.y, this.waveNumber,
      this.currentWave.hpMult, this.currentWave.dmgMult
    );
    this.enemies.push(enemy);
    if (this.pendingSpawns.length === 0) this.state = 'active';
  }

  update(dt, player) {
    this._playerRef = player;

    if (this.state === 'intermission') {
      this.betweenTimer.update(dt);
      return;
    }
    if (this.state === 'spawning') {
      this.spawnGap.update(dt);
    }

    // bersihkan musuh mati & cek clear condition
    const beforeCount = this.enemies.length;
    this.enemies = this.enemies.filter((e) => !e.dead);

    if (this.state === 'active' && this.enemies.length === 0) {
      this.state = 'cleared';
      if (this.onWaveClear) this.onWaveClear(this.waveNumber);
      this.betweenTimer.reset(G.CONST.WAVE.timeBetweenWaves);
      this.state = 'intermission';
    }
  }

  begin() {
    this.betweenTimer.reset(0.8);
  }
}

G.wave.WaveManager = WaveManager;
