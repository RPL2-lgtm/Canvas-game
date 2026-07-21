// js/chest/chest.js
window.G = window.G || {};
G.chest = G.chest || {};

class Chest {
  constructor(x, y, tier = 1) {
    this.x = x;
    this.y = y;
    this.radius = 14;
    this.tier = tier;
    this.opened = false;
    this.bobPhase = Math.random() * Math.PI * 2;
  }

  playerNearby(player) {
    return G.utils.math.distance(this.x, this.y, player.x, player.y) < this.radius + player.radius + 12;
  }

  open() {
    if (this.opened) return null;
    this.opened = true;
    return G.chest.chestDrop.generateLoot(this.tier);
  }

  draw(ctx, camera, showPrompt) {
    const screen = camera.worldToScreen(this.x, this.y);
    const bob = Math.sin(performance.now() / 400 + this.bobPhase) * 2;

    const icon = G.items.iconImage;
    const rect = G.CONST.ICONS.key; // dipakai sebagai penanda visual chest
    ctx.save();
    ctx.translate(0, this.opened ? 0 : bob);

    // kotak dasar
    ctx.fillStyle = this.opened ? '#7f6a4f' : '#c0862f';
    ctx.strokeStyle = '#4a3417';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(screen.x - 16, screen.y - 12, 32, 22, 4);
    ctx.fill();
    ctx.stroke();

    if (icon && !this.opened) {
      ctx.drawImage(icon, rect.x, rect.y, rect.w, rect.h, screen.x - 8, screen.y - 22, 16, 16);
    }
    ctx.restore();

    if (showPrompt && !this.opened) {
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[E] Buka', screen.x, screen.y - 28);
    }
  }
}

G.chest.Chest = Chest;
