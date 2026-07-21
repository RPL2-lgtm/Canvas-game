// js/core/rng.js
window.G = window.G || {};
G.core = G.core || {};

class RNG {
  constructor(seed = Date.now()) {
    this.seed = seed >>> 0;
  }
  // mulberry32
  next() {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(min, max) {
    return this.next() * (max - min) + min;
  }
  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
  chance(p) {
    return this.next() < p;
  }
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }
  weightedPick(items, weightKey = 'weight') {
    const total = items.reduce((s, it) => s + it[weightKey], 0);
    let r = this.next() * total;
    for (const it of items) {
      r -= it[weightKey];
      if (r <= 0) return it;
    }
    return items[items.length - 1];
  }
}

G.core.RNG = RNG;
G.core.rng = new RNG();
