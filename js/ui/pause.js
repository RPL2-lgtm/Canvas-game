// js/ui/pause.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.pause = {
  el: null,
  paused: false,

  init(callbacks) {
    this.el = document.getElementById('pause-overlay');
    const btnResume = document.getElementById('btn-resume');
    const btnRestart = document.getElementById('btn-restart');
    const btnSave = document.getElementById('btn-save');
    const canvas = document.getElementById('game-canvas');

    btnResume.onclick = () => { btnResume.blur(); canvas.focus(); this.hide(); };
    btnRestart.onclick = () => { btnRestart.blur(); canvas.focus(); callbacks.onRestart(); };
    btnSave.onclick = () => { btnSave.blur(); canvas.focus(); callbacks.onSave(); };
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
