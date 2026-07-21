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

    // cek apakah punya kombo Ramuan Hijau + Ramuan Merah
    const hasGreen = player.inventory.includes('potion_green');
    const hasRed = player.inventory.includes('potion_red');
    const comboHtml = (hasGreen && hasRed)
      ? `<div class="inv-item combo-card">
          <span class="loot-icon">🟢🔴</span>
          <div class="inv-item-info">
            <strong>Ramuan Gabungan</strong>
            <small>Hilangkan racun + pulihkan 30% HP sekaligus</small>
          </div>
          <button class="btn-use-item btn-combo" id="btn-use-combo">Gunakan Kombo</button>
        </div>`
      : '';

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
    this.el.innerHTML = `<h3>Inventory</h3><div class="inv-list">${comboHtml}${rows}</div>`;

    // pasang listener ke tiap tombol "Gunakan" (consumable saja, kombo dikecualikan)
    this.el.querySelectorAll('.btn-use-item:not(.btn-combo)').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        this.useItem(player, index);
        btn.blur();
        document.getElementById('game-canvas').focus();
      });
    });

    const comboBtn = document.getElementById('btn-use-combo');
    if (comboBtn) {
      comboBtn.addEventListener('click', () => {
        this.useCombo(player);
        comboBtn.blur();
        document.getElementById('game-canvas').focus();
      });
    }
  },

  onItemUsed: null, // optional callback(item), di-set dari game.js untuk feedback visual

  useItem(player, index) {
    const id = player.inventory[index];
    const item = G.items.getById(id);
    if (!item || item.type !== 'consumable') return;
    item.useOn(player);
    player.inventory.splice(index, 1);
    this.render(player);
    if (this.onItemUsed) this.onItemUsed(item);
  },

  // pakai Ramuan Hijau + Merah sekaligus: hilangin racun DAN pulihkan 30% HP dalam satu aksi
  useCombo(player) {
    const greenIdx = player.inventory.indexOf('potion_green');
    const redIdx = player.inventory.indexOf('potion_red');
    if (greenIdx === -1 || redIdx === -1) return;

    G.items.getById('potion_green').useOn(player);
    G.items.getById('potion_red').useOn(player);

    // hapus satu instance masing-masing (index dicari ulang karena splice pertama bisa geser posisi)
    player.inventory.splice(player.inventory.indexOf('potion_green'), 1);
    player.inventory.splice(player.inventory.indexOf('potion_red'), 1);

    this.render(player);
    if (this.onItemUsed) this.onItemUsed({ name: 'Ramuan Gabungan' });
  }
};
