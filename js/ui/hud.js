// js/ui/hud.js
window.G = window.G || {};
G.ui = G.ui || {};

G.ui.hud = {
  draw(ctx, player, waveManager) {
    ctx.save();

    const pad = 16;
    const barW = 220;
    let y = pad;

    const hpH = 16;
    const hpPct = Math.max(0, player.stats.hp / player.stats.totalMaxHP);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, y, barW, hpH);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(pad, y, barW * hpPct, hpH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, y, barW, hpH);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(player.stats.hp)} / ${player.stats.totalMaxHP}`, pad + barW / 2, y + 12);
    y += hpH + 6;

    const expH = 8;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, y, barW, expH);
    ctx.fillStyle = '#3498db';
    ctx.fillRect(pad, y, barW * player.expSystem.progress, expH);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(pad, y, barW, expH);
    y += expH + 8;

    ctx.textAlign = 'left';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Level ${player.levelSystem.level}`, pad, y + 12);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#bbb';
    const raceLabel = player.mimicRaceIds && player.mimicRaceIds.length
      ? `${player.race.emoji} ${player.race.name} (copy: ${player.mimicRaceIds.join(' + ')})`
      : `${player.race.emoji} ${player.race.name}`;
    ctx.fillText(raceLabel, pad + 90, y + 12);
    y += 22;

    if (player.poison.active) {
      ctx.fillStyle = '#7cd66b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`☠ Teracun (${player.poison.timeLeft.toFixed(1)}s)`, pad, y + 10);
      y += 20;
    }

    if (player.awakeningEligible) {
      const pct = player.awakeningActive ? 1 : player.awakeningMeter / G.CONST.AWAKENING.max;
      const ready = !player.awakeningActive && pct >= 1;

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = player.awakeningActive ? '#ff5fd1' : (ready ? '#ffd75e' : '#c9a6ff');
      const label = player.awakeningActive
        ? `⚡ AWAKENING AKTIF! (${player.awakeningTimer.toFixed(1)}s)`
        : (ready ? '⚡ Tekan F untuk Awakening!' : `⚡ Awakening ${Math.floor(pct * 100)}%`);
      ctx.fillText(label, pad, y + 9);
      y += 12;

      const barH = 8;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(pad, y, barW, barH);
      ctx.fillStyle = player.awakeningActive ? '#ff5fd1' : (ready ? '#ffd75e' : '#8b5cf6');
      ctx.fillRect(pad, y, barW * pct, barH);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(pad, y, barW, barH);
      y += barH + 6;
    }

    ctx.textAlign = 'right';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#fff';
    const waveLabel = waveManager.state === 'intermission'
      ? `Wave ${waveManager.waveNumber + 1} datang dalam ${waveManager.betweenTimer.remaining.toFixed(1)}s`
      : `Wave ${waveManager.waveNumber}${waveManager.currentWave && waveManager.currentWave.isBoss ? ' — BOSS' : ''}`;
    ctx.fillText(waveLabel, G.CONST.CANVAS_W - pad, pad + 12);
    ctx.fillText(`Gold: ${player.gold}`, G.CONST.CANVAS_W - pad, pad + 30);

    ctx.restore();
  }
};