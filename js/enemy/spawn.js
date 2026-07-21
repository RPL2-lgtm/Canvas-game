// js/enemy/spawn.js
window.G = window.G || {};
G.enemy = G.enemy || {};

G.enemy.spawn = {
  // Menentukan titik spawn di luar layar, di sekitar posisi player, dalam batas dunia.
  randomEdgePosition(player, worldW, worldH, margin = 60) {
    const side = G.core.rng.int(0, 3);
    const camRange = 500; // jarak spawn dari player
    let x, y;
    switch (side) {
      case 0: x = player.x - camRange; y = player.y + G.core.rng.range(-camRange, camRange); break;
      case 1: x = player.x + camRange; y = player.y + G.core.rng.range(-camRange, camRange); break;
      case 2: x = player.x + G.core.rng.range(-camRange, camRange); y = player.y - camRange; break;
      default: x = player.x + G.core.rng.range(-camRange, camRange); y = player.y + camRange; break;
    }
    x = G.utils.math.clamp(x, margin, worldW - margin);
    y = G.utils.math.clamp(y, margin, worldH - margin);
    return { x, y };
  },

  create(type, x, y, waveNumber, hpMult, dmgMult) {
    if (type === 'goblin') return new G.enemy.Goblin(x, y, hpMult, dmgMult);
    if (type === 'archer') return new G.enemy.Archer(x, y, hpMult, dmgMult);
    if (type === 'poison') return new G.enemy.PoisonEnemy(x, y, hpMult, dmgMult);
    if (type === 'boss') return new G.enemy.Boss(x, y, waveNumber);
    return new G.enemy.Goblin(x, y, hpMult, dmgMult);
  }
};
