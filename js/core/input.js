// js/core/input.js
window.G = window.G || {};
G.core = G.core || {};

class Input {
  constructor() {
    this.keys = new Set();
    this.justPressed = new Set();
    this.mouse = { x: 0, y: 0, down: false, justClicked: false };
    this._canvas = null;
  }

  init(canvas) {
    this._canvas = canvas;
    const GAME_KEYS = new Set([
      'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyI', 'KeyC', 'Escape'
    ]);

    window.addEventListener('keydown', (e) => {
      if (GAME_KEYS.has(e.code)) {
        e.preventDefault();

        // PENTING: apapun yang lagi fokus (tombol mana pun), langsung lepas.
        // Ini titik pusat fix-nya — jadi gak perlu blur() manual di tiap file lagi,
        // dan gak akan "kadang gagal" lagi karena cuma ada satu tempat yang ngatur ini.
        const active = document.activeElement;
        if (active && active !== document.body && active.tagName !== 'CANVAS') {
          active.blur();
        }
      }
      if (!this.keys.has(e.code)) this.justPressed.add(e.code);
      this.keys.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      if (GAME_KEYS.has(e.code)) e.preventDefault();
      this.keys.delete(e.code);
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      this.mouse.y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    });
    canvas.addEventListener('mousedown', () => {
      this.mouse.down = true;
      this.mouse.justClicked = true;
    });
    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });
  }

  isDown(code) {
    return this.keys.has(code);
  }
  wasPressed(code) {
    return this.justPressed.has(code);
  }

  endFrame() {
    this.justPressed.clear();
    this.mouse.justClicked = false;
  }

  getAxis() {
    let x = 0, y = 0;
    if (this.isDown('KeyA') || this.isDown('ArrowLeft')) x -= 1;
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) x += 1;
    if (this.isDown('KeyW') || this.isDown('ArrowUp')) y -= 1;
    if (this.isDown('KeyS') || this.isDown('ArrowDown')) y += 1;
    return { x, y };
  }
}

G.core.Input = Input;
G.core.input = new Input();