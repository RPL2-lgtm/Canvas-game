// js/items/sword.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'sword_iron',
  name: 'Pedang Besi',
  type: 'weapon',
  rarity: 'common',
  iconKey: 'sword',
  symbol: '🗡️',
  description: '+4 ATK',
  apply(player) {
    player.stats.bonus.atk += 4;
    player.equippedWeapon = 'sword';
  }
});

G.items.register({
  id: 'sword_flame',
  name: 'Pedang Api',
  type: 'weapon',
  rarity: 'epic',
  iconKey: 'dagger',
  symbol: '🔥',
  description: '+12 ATK, +5% Crit',
  apply(player) {
    player.stats.bonus.atk += 12;
    player.stats.bonus.critChance += 0.05;
    player.equippedWeapon = 'dagger';
  }
});
