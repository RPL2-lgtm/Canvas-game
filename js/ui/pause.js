// js/ui/pause.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.pause = {
  el: null,
  paused: false,

  init(callbacks) {
    this.el = document.getElementById('pause-overlay');
    document.getElementById('btn-resume').onclick = () => this.hide();
    document.getElementById('btn-restart').onclick = () => callbacks.onRestart();
    document.getElementById('btn-save').onclick = () => callbacks.onSave();
  },

  toggle() {
    this.paused ? this.hide() : this.show();
  },
  show() {
    this.paused = true;
    this.el.classList.add('visible');
  },
  hide() {
    this.paused = false;
    this.el.classList.remove('visible');
  }
};
