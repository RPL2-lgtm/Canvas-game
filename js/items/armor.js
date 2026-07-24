// js/items/armor.js
// Sistem armor set: tiap set (Crimson/Obsidian/Amethyst/Golden) punya 3 piece
// (Zirah Dada, Sepatu, Cincin) dan efek stat sendiri-sendiri. Dapet piece yang SAMA
// lagi -> stack effect-nya nambah. Punya ke-3 piece dalam 1 set -> dapet bonus tambahan.
window.G = window.G || {};
G.items = G.items || {};

G.items.ARMOR_SETS = {
  crimson: {
    name: 'Crimson', color: '#e74c3c',
    statKey: 'atk', mode: 'percent',
    pieceBase: 0.20, pieceStack: 0.02, setBonus: 0.10
  },
  obsidian: {
    name: 'Obsidian', color: '#6c5ce7',
    statKey: 'def', mode: 'flat',
    pieceBase: 5, pieceStack: 1, setBonus: 10
  },
  amethyst: {
    name: 'Amethyst', color: '#b15cff',
    statKey: 'critChance', mode: 'flat',
    pieceBase: 0.05, pieceStack: 0.01, setBonus: 0.05
  },
  golden: {
    name: 'Golden', color: '#f1c40f',
    statKey: 'maxHP', mode: 'flat',
    pieceBase: 20, pieceStack: 5, setBonus: 30
  }
};

const PIECE_LABEL = { chest: 'Zirah Dada', boots: 'Sepatu Zirah', ring: 'Cincin' };
const PIECE_SYMBOL = { chest: '🥋', boots: '👢', ring: '💍' };

function makeArmor(id, setId, pieceType, rect) {
  const set = G.items.ARMOR_SETS[setId];
  const desc = set.mode === 'percent'
    ? `+${Math.round(set.pieceBase * 100)}% ${set.statKey} basic attack (stack +${Math.round(set.pieceStack * 100)}%/duplikat)`
    : `+${set.pieceBase} ${set.statKey} (stack +${set.pieceStack}/duplikat)`;

  G.items.register({
    id,
    name: `${PIECE_LABEL[pieceType]} ${set.name}`,
    type: 'armor_set',
    rarity: (setId === 'crimson' || setId === 'obsidian') ? 'rare' : 'epic',
    iconKey: null,
    iconSheet: 'armour',
    iconRect: rect,
    symbol: PIECE_SYMBOL[pieceType],
    description: desc,
    setId,
    pieceType,
    apply(player) {
      player.pickupArmor(id, setId, pieceType);
    }
  });
}

makeArmor('armor_crimson_chest',  'crimson',  'chest', { x: 64, y: 64,  w: 32, h: 32 });
makeArmor('armor_crimson_boots',  'crimson',  'boots', { x: 32, y: 96,  w: 32, h: 32 });
makeArmor('armor_crimson_ring',   'crimson',  'ring',  { x: 96, y: 96,  w: 32, h: 32 });

makeArmor('armor_obsidian_chest', 'obsidian', 'chest', { x: 32, y: 64,  w: 32, h: 32 });
makeArmor('armor_obsidian_boots', 'obsidian', 'boots', { x: 96, y: 128, w: 32, h: 32 });
makeArmor('armor_obsidian_ring',  'obsidian', 'ring',  { x: 0,  y: 96,  w: 32, h: 32 });

makeArmor('armor_amethyst_chest','amethyst', 'chest', { x: 64, y: 160, w: 32, h: 32 });
makeArmor('armor_amethyst_boots','amethyst', 'boots', { x: 96, y: 160, w: 32, h: 32 });
makeArmor('armor_amethyst_ring', 'amethyst', 'ring',  { x: 0,  y: 192, w: 32, h: 32 });

makeArmor('armor_golden_chest',  'golden',   'chest', { x: 64, y: 192, w: 32, h: 32 });
makeArmor('armor_golden_boots',  'golden',   'boots', { x: 96, y: 192, w: 32, h: 32 });
makeArmor('armor_golden_ring',   'golden',   'ring',  { x: 32, y: 224, w: 32, h: 32 });