// js/chest/chestDrop.js
window.G = window.G || {};
G.chest = G.chest || {};

G.chest.chestDrop = {
  generateLoot(chestTier = 1, player = null) {
    const rolls = 3;
    const loot = [];
    for (let i = 0; i < rolls; i++) {
      const rarity = G.chest.chestRNG.rollRarity(player);
      const item = G.chest.chestRNG.rollItemForRarity(rarity);
      loot.push(item);
    }
    const gold = G.core.rng.int(5, 15) * chestTier;
    return { items: loot, gold };
  }
};