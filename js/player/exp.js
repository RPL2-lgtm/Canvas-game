// js/player/exp.js
window.G = window.G || {};
G.player = G.player || {};

class ExpSystem {
  constructor() {
    this.exp = 0;
    this.expToNext = 30;
  }

  // Mengembalikan jumlah level yang naik (bisa >1 kalau exp-nya banyak sekaligus)
  addExp(amount) {
    this.exp += amount;
    let levelsGained = 0;
    while (this.exp >= this.expToNext) {
      this.exp -= this.expToNext;
      this.expToNext = Math.round(this.expToNext * 1.25 + 10);
      levelsGained++;
    }
    return levelsGained;
  }

  get progress() {
    return this.exp / this.expToNext;
  }
}

G.player.ExpSystem = ExpSystem;
