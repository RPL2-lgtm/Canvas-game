// js/chest/chestRNG.js
window.G = window.G || {};
G.chest = G.chest || {};

G.chest.chestRNG = {
  rarityTable: [
    { rarity: 'common', weight: 60 },
    { rarity: 'rare', weight: 30 },
    { rarity: 'epic', weight: 9 },
    { rarity: 'legendary', weight: 1 }
  ],

  rollRarity() {
    return G.core.rng.weightedPick(this.rarityTable).rarity;
  },

  rollItemForRarity(rarity) {
    const pool = G.items.registry.filter((it) => it.rarity === rarity);
    if (pool.length === 0) return G.items.registry[0];
    return G.core.rng.pick(pool);
  }
};
