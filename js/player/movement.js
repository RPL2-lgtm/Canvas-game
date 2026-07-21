// js/player/movement.js
window.G = window.G || {};
G.player = G.player || {};

G.player.movement = {
  update(player, input, dt, worldW, worldH) {
    const axis = input.getAxis();
    const norm = G.utils.math.normalize(axis.x, axis.y);
    const moving = norm.x !== 0 || norm.y !== 0;

    const speed = player.stats.totalSpeed;
    player.x += norm.x * speed * dt;
    player.y += norm.y * speed * dt;

    G.core.collision.clampToWorld(player, worldW, worldH);

    // tentukan arah hadap berdasarkan sumbu dominan
    let direction = player.animator.direction;
    if (moving) {
      if (Math.abs(axis.x) > Math.abs(axis.y)) {
        direction = axis.x > 0 ? 'right' : 'left';
      } else {
        direction = axis.y > 0 ? 'down' : 'up';
      }
    }
    player.animator.setState(direction, moving);
    player.isMoving = moving;
  }
};
