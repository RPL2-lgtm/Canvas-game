// js/items/potion.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'potion_green',
  name: 'Ramuan Hijau',
  type: 'consumable',
  rarity: 'common',
  iconKey: 'potion',
  iconSheet: 'potion',
  iconRect: { x: 32, y: 32, w: 16, h: 32 },
  symbol: '🟢',
  description: 'Pulihkan 30% dari Max HP',
  onUse(player) {
    const amount = Math.round(player.stats.totalMaxHP * 0.3);
    player.heal(amount);
  }
});

G.items.register({
  id: 'potion_red',
  name: 'Ramuan Merah',
  type: 'consumable',
  rarity: 'common',
  iconKey: 'heart',
  iconSheet: 'potion',
  iconRect: { x: 0, y: 0, w: 16, h: 32 },
  symbol: '🔴',
  description: 'Hilangkan efek racun',
  onUse(player) {
    player.curePoison();
  }
});

G.items.register({
  id: 'potion_greater',
  name: 'Ramuan Besar',
  type: 'consumable',
  rarity: 'rare',
  iconKey: 'heart',
  symbol: '❤️',
  description: 'Pulihkan 100% HP',
  onUse(player) {
    player.heal(player.stats.totalMaxHP);
  }
});