// js/player/animation.js
// Mengatur pengambilan frame dari assets/player/run_anim_sheet.png
window.G = window.G || {};
G.player = G.player || {};

class Animator {
  constructor(image) {
    this.image = image;
    this.sheet = G.CONST.PLAYER_SHEET;
    this.rowMap = G.CONST.PLAYER_ROW_MAP;

    this.direction = 'down';
    this.moving = false;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 0.1; // detik per frame saat lari
  }

  setState(direction, moving) {
    this.direction = direction;
    this.moving = moving;
  }

  update(dt) {
    if (!this.moving) {
      this.frameIndex = 0;
      return;
    }
    this.frameTimer += dt;
    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.sheet.cols;
    }
  }

  draw(ctx, x, y) {
    const { frameW, frameH, scale } = this.sheet;
    const rowInfo = this.rowMap[this.direction] || this.rowMap.down;
    const row = this.moving ? rowInfo.runRow : rowInfo.idleRow;
    const col = this.moving ? this.frameIndex : 0;

    const sx = col * frameW;
    const sy = row * frameH;
    const drawW = frameW * scale;
    const drawH = frameH * scale;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.image,
      sx, sy, frameW, frameH,
      Math.round(x - drawW / 2), Math.round(y - drawH / 2),
      drawW, drawH
    );
  }
}

G.player.Animator = Animator;
