// js/core/timer.js
window.G = window.G || {};
G.core = G.core || {};

class Timer {
  constructor(duration, onComplete = null, loop = false) {
    this.duration = duration;
    this.elapsed = 0;
    this.onComplete = onComplete;
    this.loop = loop;
    this.done = false;
  }
  update(dt) {
    if (this.done) return;
    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      if (this.loop) {
        this.elapsed = 0;
      } else {
        this.done = true;
      }
      if (this.onComplete) this.onComplete();
    }
  }
  reset(newDuration = null) {
    if (newDuration !== null) this.duration = newDuration;
    this.elapsed = 0;
    this.done = false;
  }
  get progress() {
    return Math.min(1, this.elapsed / this.duration);
  }
  get remaining() {
    return Math.max(0, this.duration - this.elapsed);
  }
  isDone() {
    return this.done;
  }
}

G.core.Timer = Timer;
