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

  spriteIconHtml(sheetUrl, sheetW, sheetH, rect, scale = 2) {
    const bgW = sheetW * scale;
    const bgH = sheetH * scale;
    const posX = -(rect.x * scale);
    const posY = -(rect.y * scale);
    const w = rect.w * scale;
    const h = rect.h * scale;
    return `<span class="sprite-icon" style="width:${w}px;height:${h}px;background-image:url('assets/items/${sheetUrl}');background-size:${bgW}px ${bgH}px;background-position:${posX}px ${posY}px;"></span>`;
  },

  itemIconHtml(item) {
    if (item.iconSheet === 'armour') {
      return this.spriteIconHtml('armour.png', G.CONST.ARMOUR_SHEET.w, G.CONST.ARMOUR_SHEET.h, item.iconRect);
    }
    if (item.iconSheet === 'potion') {
      return this.spriteIconHtml('potion.png', G.CONST.POTION_SHEET.w, G.CONST.POTION_SHEET.h, item.iconRect);
    }
    return `<span class="loot-icon">${item.symbol}</span>`;
  },

  render(player) {
    if (!this.el) return;

    const armorHtml = this.renderArmorSection(player);

    if (player.inventory.length === 0) {
      this.el.innerHTML = `<h3>Inventory</h3><p class="empty-note">Belum ada item. Buka chest untuk mendapatkan item!</p>${armorHtml}`;
      return;
    }

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
          ${this.itemIconHtml(item)}
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

    this.el.innerHTML = `<h3>Inventory</h3><div class="inv-list">${comboHtml}${rows}</div>${armorHtml}`;

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

  renderArmorSection(player) {
    const sets = Object.entries(G.items.ARMOR_SETS).map(([setId, set]) => {
      const pieces = G.items.registry.filter((it) => it.type === 'armor_set' && it.setId === setId);
      const complete = player.hasFullArmorSet(setId);
      const pieceHtml = pieces
        .map((p) => {
          const stacks = player.armorStacks[p.id] || 0;
          const owned = stacks > 0;
          return `<div class="armor-piece ${owned ? 'owned' : 'missing'}">
            ${this.itemIconHtml(p)}
            <small>${p.pieceType}${stacks > 1 ? ` ×${stacks}` : ''}</small>
          </div>`;
        })
        .join('');
      const total = player.getArmorSetTotal(setId);
      const totalLabel = set.mode === 'percent' ? `+${Math.round(total * 100)}%` : `+${total.toFixed(2)}`;
      return `<div class="armor-set-card ${complete ? 'set-complete' : ''}">
        <div class="armor-set-head">
          <strong style="color:${set.color}">${set.name}</strong>
          ${complete ? '<span class="set-complete-tag">✅ Lengkap</span>' : ''}
          <span class="armor-set-total">${totalLabel} ${set.statKey}</span>
        </div>
        <div class="armor-piece-list">${pieceHtml}</div>
      </div>`;
    }).join('');

    return `<div class="armor-section"><h4>Armor Sets</h4>${sets}</div>`;
  },

  onItemUsed: null,

  useItem(player, index) {
    const id = player.inventory[index];
    const item = G.items.getById(id);
    if (!item || item.type !== 'consumable') return;
    item.useOn(player);
    player.inventory.splice(index, 1);
    this.render(player);
    if (this.onItemUsed) this.onItemUsed(item);
  },

  useCombo(player) {
    const greenIdx = player.inventory.indexOf('potion_green');
    const redIdx = player.inventory.indexOf('potion_red');
    if (greenIdx === -1 || redIdx === -1) return;

    G.items.getById('potion_green').useOn(player);
    G.items.getById('potion_red').useOn(player);

    player.inventory.splice(player.inventory.indexOf('potion_green'), 1);
    player.inventory.splice(player.inventory.indexOf('potion_red'), 1);

    this.render(player);
    if (this.onItemUsed) this.onItemUsed({ name: 'Ramuan Gabungan' });
  }
};