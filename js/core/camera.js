// js/core/camera.js
window.G = window.G || {};
G.core = G.core || {};

class Camera {
  constructor(viewW, viewH, worldW, worldH) {
    this.x = 0;
    this.y = 0;
    this.viewW = viewW;
    this.viewH = viewH;
    this.worldW = worldW;
    this.worldH = worldH;
  }

  follow(targetX, targetY, smooth = 0.12) {
    const desiredX = targetX - this.viewW / 2;
    const desiredY = targetY - this.viewH / 2;
    this.x += (desiredX - this.x) * smooth;
    this.y += (desiredY - this.y) * smooth;

    this.x = G.utils.math.clamp(this.x, 0, Math.max(0, this.worldW - this.viewW));
    this.y = G.utils.math.clamp(this.y, 0, Math.max(0, this.worldH - this.viewH));
  }

  worldToScreen(x, y) {
    return { x: x - this.x, y: y - this.y };
  }

  isVisible(x, y, margin = 64) {
    return (
      x > this.x - margin &&
      x < this.x + this.viewW + margin &&
      y > this.y - margin &&
      y < this.y + this.viewH + margin
    );
  }
}

G.core.Camera = Camera;
