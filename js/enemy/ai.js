// js/enemy/ai.js
window.G = window.G || {};
G.enemy = G.enemy || {};

G.enemy.ai = {
  chase(entity, target, speed, dt) {
    const dir = G.utils.math.normalize(target.x - entity.x, target.y - entity.y);
    entity.x += dir.x * speed * dt;
    entity.y += dir.y * speed * dt;
  },

  keepDistance(entity, target, minDist, speed, dt) {
    const dist = G.utils.math.distance(entity.x, entity.y, target.x, target.y);
    const dir = G.utils.math.normalize(target.x - entity.x, target.y - entity.y);
    if (dist < minDist) {
      entity.x -= dir.x * speed * dt;
      entity.y -= dir.y * speed * dt;
    } else if (dist > minDist * 1.4) {
      entity.x += dir.x * speed * dt;
      entity.y += dir.y * speed * dt;
    }
  }
};
