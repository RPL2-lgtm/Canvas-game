// js/core/collision.js
window.G = window.G || {};
G.core = G.core || {};

G.core.collision = {
  // Circle vs circle, dipakai untuk player/enemy/projectile (lebih murah dari AABB utk sprite bulat).
  checkCircle(a, b) {
    return G.utils.helper.circleOverlap(a.x, a.y, a.radius, b.x, b.y, b.radius);
  },

  // Dorong dua entitas circle supaya tidak overlap (dipakai antar enemy biar gak numpuk).
  resolveCircle(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    const overlap = a.radius + b.radius - dist;
    if (overlap > 0) {
      const nx = dx / dist, ny = dy / dist;
      a.x -= nx * overlap * 0.5;
      a.y -= ny * overlap * 0.5;
      b.x += nx * overlap * 0.5;
      b.y += ny * overlap * 0.5;
    }
  },

  clampToWorld(entity, worldW, worldH) {
    entity.x = G.utils.math.clamp(entity.x, entity.radius, worldW - entity.radius);
    entity.y = G.utils.math.clamp(entity.y, entity.radius, worldH - entity.radius);
  }
};
