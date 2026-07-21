// js/ui/statsMenu.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.statsMenu = {
  el: null,
  visible: false,

  init() {
    this.el = document.getElementById('stats-panel');
  },

  toggle(player) {
    this.visible = !this.visible;
    if (this.visible) this.render(player);
    this.el.classList.toggle('visible', this.visible);
  },

  render(player) {
    if (!this.el) return;
    const s = player.stats;
    this.el.innerHTML = `
      <h3>Statistik</h3>
      <ul class="stats-list">
        <li>Level <span>${player.levelSystem.level}</span></li>
        <li>HP <span>${Math.ceil(s.hp)} / ${s.totalMaxHP}</span></li>
        <li>ATK <span>${s.totalAtk}</span></li>
        <li>DEF <span>${s.totalDef}</span></li>
        <li>Speed <span>${Math.round(s.totalSpeed)}</span></li>
        <li>Crit Chance <span>${Math.round(s.totalCrit * 100)}%</span></li>
        <li>Gold <span>${player.gold}</span></li>
      </ul>
    `;
  }
};
