// js/ui/inventory.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.inventory = {
  el: null,
  visible: false,
  onItemUsed: null, // optional callback(item), bisa di-set dari game.js untuk feedback visual

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
      .map((id, index) => {
        const item = G.items.getById(id);
        if (!item) return '';
        const isConsumable = item.type === 'consumable';
        return `<div class="inv-item rarity-${item.rarity}">
          <span class="loot-icon">${item.symbol}</span>
          <div class="inv-item-info">
            <strong>${item.name}</strong>
            <small>${item.description}</small>
          </div>
          ${isConsumable
            ? `<button class="btn-use-item" data-index="${index}">Gunakan</button>`
            : `<small class="equipped-tag">Terpasang</small>`}
        </div>`;
      })
      .join('');
    this.el.innerHTML = `<h3>Inventory</h3><div class="inv-list">${rows}</div>`;

    this.el.querySelectorAll('.btn-use-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        this.useItem(player, index);
      });
    });
  },

  useItem(player, index) {
    const id = player.inventory[index];
    const item = G.items.getById(id);
    if (!item || item.type !== 'consumable') return;
    item.useOn(player);
    player.inventory.splice(index, 1);
    this.render(player);
    if (this.onItemUsed) this.onItemUsed(item);
  }
};