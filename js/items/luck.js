// js/items/luck.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'clover_luck',
  name: 'Semanggi Beruntung',
  type: 'passive',
  rarity: 'legendary',
  iconKey: 'clover',
  symbol: '🍀',
  description: '+10% Crit Chance secara permanen',
  apply(player) {
    player.stats.bonus.critChance += 0.10;
  }
});

G.items.register({
  id: 'coin_stack',
  name: 'Tumpukan Koin',
  type: 'consumable',
  rarity: 'common',
  iconKey: 'coin',
  symbol: '🪙',
  description: '+25 Gold',
  apply(player) {
    player.gold += 25;
  }
});
