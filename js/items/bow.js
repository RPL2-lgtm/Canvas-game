// js/items/bow.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'bow_hunter',
  name: 'Busur Pemburu',
  type: 'weapon',
  rarity: 'rare',
  iconKey: 'bow',
  symbol: '🏹',
  description: '+7 ATK, +8% Speed',
  apply(player) {
    player.stats.bonus.atk += 7;
    player.stats.bonus.speed += Math.round(player.stats.speed * 0.08);
    player.equippedWeapon = 'bow';
  }
});
