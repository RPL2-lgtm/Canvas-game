// js/items/axe.js
window.G = window.G || {};
G.items = G.items || {};

G.items.register({
  id: 'axe_heavy',
  name: 'Kapak Berat',
  type: 'weapon',
  rarity: 'rare',
  iconKey: 'axe',
  symbol: '🪓',
  description: '+10 ATK, -5% Speed',
  apply(player) {
    player.stats.bonus.atk += 10;
    player.stats.bonus.speed -= Math.round(player.stats.speed * 0.05);
    player.equippedWeapon = 'axe';
  }
});
