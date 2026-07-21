// js/ui/inventory.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.inventory = {
  el: null,
  visible: false,

  init() {
    this.el = document.getElementById('inventory-panel');
  },

  toggle(player) {
    this.visible = !this.visible;
    if (this.visible) this.render(player);
    this.el.classList.toggle('visible', this.visible);
  },

  render(player) {
    if (!this.el) return;
    if (player.inventory.length === 0) {
      this.el.innerHTML = `<h3>Inventory</h3><p class="empty-note">Belum ada item. Buka chest untuk mendapatkan item!</p>`;
      return;
    }
    const rows = player.inventory
      .map((id) => {
        const item = G.items.getById(id);
        if (!item) return '';
        return `<div class="inv-item rarity-${item.rarity}">
          <span class="loot-icon">${item.symbol}</span>
          <div class="inv-item-info">
            <strong>${item.name}</strong>
            <small>${item.description}</small>
          </div>
        </div>`;
      })
      .join('');
    this.el.innerHTML = `<h3>Inventory</h3><div class="inv-list">${rows}</div>`;
  }
};
