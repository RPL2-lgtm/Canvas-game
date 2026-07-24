// js/items/item.js
window.G = window.G || {};
G.items = G.items || {};
G.items.registry = []; // diisi oleh sword.js, bow.js, axe.js, shield.js, potion.js, luck.js, armor.js
G.items.iconImage = null; // di-set saat asset selesai dimuat (lihat main.js)

class Item {
  constructor(config) {
    const {
      id, name, type, rarity, iconKey, symbol, description, apply, onUse,
      iconSheet, iconRect, setId, pieceType
    } = config;

    this.id = id;
    this.name = name;
    this.type = type; // 'weapon' | 'armor' | 'armor_set' | 'consumable' | 'passive'
    this.rarity = rarity; // 'common' | 'rare' | 'epic' | 'legendary'
    this.iconKey = iconKey; // key ke G.CONST.ICONS (dipakai buat swing icon senjata)
    this.symbol = symbol || '?';
    this.description = description || '';
    this._apply = apply || null; // dipanggil sekali saat equip/pickup (untuk equipment/passive)
    this._onUse = onUse || null; // dipanggil tiap kali dipakai manual (untuk consumable)

    // Field tambahan buat armor set & sprite custom (potion, armor, dll)
    this.iconSheet = iconSheet || null;
    this.iconRect = iconRect || null;
    this.setId = setId || null;
    this.pieceType = pieceType || null;
  }

  applyTo(player) {
    if (this._apply) this._apply(player);
  }

  useOn(player) {
    if (this._onUse) this._onUse(player);
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