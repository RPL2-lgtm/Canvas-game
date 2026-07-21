// js/enemy/enemy.js
// Karena tidak ada sprite sheet musuh yang diupload, musuh digambar sebagai
// bentuk vektor sederhana (bisa diganti ke sprite kapan saja lewat drawShape()).
window.G = window.G || {};
G.enemy = G.enemy || {};

class Enemy {
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.radius = config.radius || 12;
    this.speed = config.speed;
    this.maxHP = config.hp;
    this.hp = config.hp;
    this.damage = config.damage;
    this.expReward = config.expReward;
    this.color = config.color || '#c0392b';
    this.type = config.type || 'enemy';
    this.dead = false;
    this.hitFlash = 0;
    this.attackTimer = 0;
    this.attackCooldown = config.attackCooldown || 1;
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 0.15;
    if (this.hp <= 0) this.dead = true;
  }

  update(dt, player) {
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.attackTimer > 0) this.attackTimer -= dt;
  }

  tryAttackPlayer(player, onDamage) {
    const dist = G.utils.math.distance(this.x, this.y, player.x, player.y);
    if (dist < this.radius + player.radius + 4 && this.attackTimer <= 0) {
      const dealt = player.takeDamage(this.damage);
      this.attackTimer = this.attackCooldown;
      if (dealt > 0 && onDamage) onDamage(dealt);
    }
  }

  drawShape(ctx, screen) {
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawHealthBar(ctx, screen) {
    if (this.hp >= this.maxHP) return;
    const w = this.radius * 2;
    const pct = Math.max(0, this.hp / this.maxHP);
    const barY = screen.y - this.radius - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(screen.x - w / 2, barY, w, 4);
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(screen.x - w / 2, barY, w * pct, 4);
  }

  draw(ctx, camera) {
    const screen = camera.worldToScreen(this.x, this.y);
    this.drawShape(ctx, screen);
    this.drawHealthBar(ctx, screen);
  }
}

G.enemy.Enemy = Enemy;
