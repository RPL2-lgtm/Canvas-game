// js/player/stats.js
window.G = window.G || {};
G.player = G.player || {};

class Stats {
  constructor(base) {
    this.maxHP = base.maxHP;
    this.hp = base.maxHP;
    this.atk = base.atk;
    this.def = base.def;
    this.speed = base.speed;
    this.critChance = base.critChance;

    // bonus dari equipment/item, ditambahkan terpisah biar gampang dihitung ulang
    this.bonus = { atk: 0, def: 0, speed: 0, maxHP: 0, critChance: 0 };
  }

  get totalAtk() { return this.atk + this.bonus.atk; }
  get totalDef() { return this.def + this.bonus.def; }
  get totalSpeed() { return this.speed + this.bonus.speed; }
  get totalMaxHP() { return this.maxHP + this.bonus.maxHP; }
  get totalCrit() { return G.utils.math.clamp(this.critChance + this.bonus.critChance, 0, 0.9); }

  applyLevelUp(levelGain) {
    this.maxHP += 8 * levelGain;
    this.atk += 2 * levelGain;
    this.def += 1 * levelGain;
    this.hp = this.totalMaxHP; // full heal saat level up
  }

  takeDamage(rawDamage) {
    const mitigated = Math.max(1, rawDamage - this.totalDef);
    this.hp = G.utils.math.clamp(this.hp - mitigated, 0, this.totalMaxHP);
    return mitigated;
  }

  heal(amount) {
    this.hp = G.utils.math.clamp(this.hp + amount, 0, this.totalMaxHP);
  }

  isDead() {
    return this.hp <= 0;
  }
}

G.player.Stats = Stats;
