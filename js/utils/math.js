// js/utils/math.js
window.G = window.G || {};
G.utils = G.utils || {};

G.utils.math = {
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  },
  lerp(a, b, t) {
    return a + (b - a) * t;
  },
  distance(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
  },
  angle(ax, ay, bx, by) {
    return Math.atan2(by - ay, bx - ax);
  },
  normalize(x, y) {
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
  },
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
};
