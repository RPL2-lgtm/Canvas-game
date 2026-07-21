// js/items/potion.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'potion_heal',
  name: 'Ramuan Sehat',
  type: 'consumable',
  rarity: 'common',
  iconKey: 'potion',
  symbol: '🧪',
  description: 'Pulihkan 30 HP saat dipakai',
  apply(player) {
    // consumable: langsung dipakai saat dipungut (simpel untuk roguelike singkat)
    player.stats.heal(30);
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
  apply(player) {
    player.stats.heal(player.stats.totalMaxHP);
  }
});
