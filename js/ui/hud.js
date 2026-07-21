// js/ui/hud.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.hud = {
  draw(ctx, player, waveManager) {
    ctx.save();

    // --- HP bar ---
    const hpW = 220, hpH = 16, pad = 16;
    const hpPct = Math.max(0, player.stats.hp / player.stats.totalMaxHP);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, pad, hpW, hpH);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(pad, pad, hpW * hpPct, hpH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, hpW, hpH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(player.stats.hp)} / ${player.stats.totalMaxHP}`, pad + hpW / 2, pad + 12);

    // --- EXP bar ---
    const expY = pad + hpH + 6;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, expY, hpW, 8);
    ctx.fillStyle = '#3498db';
    ctx.fillRect(pad, expY, hpW * player.expSystem.progress, 8);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(pad, expY, hpW, 8);

    // status racun
    if (player.poison.active) {
      ctx.fillStyle = '#7cd66b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`☠ Teracun (${player.poison.timeLeft.toFixed(1)}s)`, pad, expY + 46);
    }

    // --- Level & wave text ---
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Level ${player.levelSystem.level}`, pad, expY + 26);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#bbb';
    const raceLabel = player.mimicRaceId
      ? `${player.race.emoji} ${player.race.name} (copy: ${player.mimicRaceId})`
      : `${player.race.emoji} ${player.race.name}`;
    ctx.fillText(raceLabel, pad, expY + (player.poison.active ? 64 : 44));

    ctx.textAlign = 'right';
    const waveLabel = waveManager.state === 'intermission'
      ? `Wave ${waveManager.waveNumber + 1} datang dalam ${waveManager.betweenTimer.remaining.toFixed(1)}s`
      : `Wave ${waveManager.waveNumber}${waveManager.currentWave && waveManager.currentWave.isBoss ? ' — BOSS' : ''}`;
    ctx.fillText(waveLabel, G.CONST.CANVAS_W - pad, pad + 12);

    // gold
    ctx.fillText(`Gold: ${player.gold}`, G.CONST.CANVAS_W - pad, pad + 30);

    ctx.restore();
  }
};
