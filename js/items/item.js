// js/items/item.js
window.G = window.G || {};
G.items = G.items || {};
G.items.registry = []; // diisi oleh sword.js, bow.js, axe.js, shield.js, potion.js, luck.js
G.items.iconImage = null; // di-set saat asset selesai dimuat (lihat main.js)

class Item {
  constructor({ id, name, type, rarity, iconKey, symbol, description, apply, onUse }) {
    this.id = id;
    this.name = name;
    this.type = type; // 'weapon' | 'armor' | 'consumable' | 'passive'
    this.rarity = rarity; // 'common' | 'rare' | 'epic' | 'legendary'
    this.iconKey = iconKey; // key ke G.CONST.ICONS
    this.symbol = symbol || '?';
    this.description = description || '';
    this._apply = apply || null; // dipanggil sekali saat equip/pickup (untuk equipment/passive)
    this._onUse = onUse || null; // dipanggil tiap kali dipakai manual (untuk consumable)
  }

  applyTo(player) {
    if (this._apply) this._apply(player);
  }

  useOn(player) {
    if (this._onUse) this._onUse(player);
  }

  get iconRect() {
    return G.CONST.ICONS[this.iconKey] || G.CONST.ICONS.gem;
  }
}

G.items.Item = Item;

G.items.register = function (config) {
  const item = new Item(config);
  G.items.registry.push(item);
  return item;
};

G.items.getById = function (id) {
  return G.items.registry.find((it) => it.id === id);
};
