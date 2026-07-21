// js/chest/chestDrop.js
window.G = window.G || {};
G.chest = G.chest || {};

G.chest.chestDrop = {
  generateLoot(chestTier = 1) {
    const rolls = 1 + (chestTier > 1 ? 1 : 0);
    const loot = [];
    for (let i = 0; i < rolls; i++) {
      const rarity = G.chest.chestRNG.rollRarity();
      const item = G.chest.chestRNG.rollItemForRarity(rarity);
      loot.push(item);
    }
    // sedikit gold selalu ikut drop
    const gold = G.core.rng.int(5, 15) * chestTier;
    return { items: loot, gold };
  }
};
