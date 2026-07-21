// js/items/shield.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'shield_wood',
  name: 'Perisai Kayu',
  type: 'armor',
  rarity: 'common',
  iconKey: 'shield',
  symbol: '🛡️',
  description: '+3 DEF',
  apply(player) {
    player.stats.bonus.def += 3;
  }
});

G.items.register({
  id: 'shield_iron',
  name: 'Perisai Besi',
  type: 'armor',
  rarity: 'rare',
  iconKey: 'shield',
  symbol: '🛡️',
  description: '+7 DEF, +15 Max HP',
  apply(player) {
    player.stats.bonus.def += 7;
    player.stats.bonus.maxHP += 15;
    player.stats.hp += 15;
  }
});
