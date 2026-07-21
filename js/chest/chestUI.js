// js/chest/chestUI.js
window.G = window.G || {};
G.chest = G.chest || {};

G.chest.chestUI = {
  el: null,

  init() {
    this.el = document.getElementById('chest-popup');
  },

  show(loot) {
    if (!this.el) return;
    const itemsHtml = loot.items
      .map((it) => `<div class="loot-item rarity-${it.rarity}"><span class="loot-icon">${it.symbol || '?'}</span><span>${it.name}</span></div>`)
      .join('');
    this.el.innerHTML = `
      <div class="chest-popup-inner">
        <h3>Chest Terbuka!</h3>
        <div class="loot-list">${itemsHtml}</div>
        <div class="loot-gold">+${loot.gold} Gold</div>
        <button id="chest-popup-close">Tutup</button>
      </div>
    `;
    this.el.classList.add('visible');
    document.getElementById('chest-popup-close').onclick = () => this.hide();
    clearTimeout(this._autoHide);
    this._autoHide = setTimeout(() => this.hide(), 3500);
  },

  hide() {
    if (this.el) this.el.classList.remove('visible');
  }
};
