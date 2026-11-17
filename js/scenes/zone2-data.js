// Zone 2, quartier Data — « Le Laboratoire » : usine aéro, salle de contrôle, stade.
import { R, bands, layer, glow, disc, ring, hash, stars, text, line, cloud, beam, motes } from './kit.js';

// ---------- Usine aéronautique : tapis roulant + scanner laser ----------
export const aerofactory = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('wall', () => {
      bands(['#aab8cc', '#b8c6d8', '#c8d4e2'], 0, gy);
      for (let i = 0; i < W / 40 + 2; i++) R(i * 40 - 12, 0, 2, gy, '#93a2b8');
      R(-12, gy - 22, W + 24, 2, '#93a2b8');
      // baies vitrées
      for (let i = 0; i < W / 80 + 1; i++) {
        const x = i * 80 + 8;
        R(x - 2, 12, 58, 34, '#7a8aa2'); R(x, 14, 54, 30, '#8ad0f6'); R(x, 34, 54, 10, '#b8e4fa');
        R(x + 26, 14, 2, 30, '#7a8aa2'); R(x + 6, 20, 12, 2, '#ffffff'); R(x + 34, 26, 14, 2, '#ffffff');
      }
    }, px * 3);
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#5a6a80'); R(-12, gy, W + 24, 2, '#7a8aa2');
      for (let i = 0; i < W / 10 + 3; i++) R(i * 10 - 12, gy + 20, 5, 2, i % 2 ? '#f2c14e' : '#2a3040');
    }, px * 8);
    // tapis roulant
    const cy = gy - 6, ox = Math.round(px * 8);
    R(0, cy, W, 6, '#2a3040'); R(0, cy, W, 1, '#4a5468');
    for (let i = 0; i < W / 6 + 2; i++) R(((i * 6 + t * 12) % (W + 6)) - 3, cy + 2, 2, 2, '#6a7488');
    for (let i = 0; i < W / 30 + 1; i++) { R(i * 30 + 6 + ox, cy + 6, 3, gy + 8 - cy, '#3a4458'); R(i * 30 + 4 + ox, gy + 6, 7, 2, '#3a4458'); }
    // portique du scanner
    const sx = Math.round(W * (W >= 250 ? 0.6 : 0.62)) + ox;
    R(sx - 16, cy - 36, 3, 36, '#4a5468'); R(sx + 13, cy - 36, 3, 36, '#4a5468'); R(sx - 18, cy - 40, 36, 6, '#3a4458'); R(sx - 18, cy - 40, 36, 1, '#6a7488');
    R(sx - 4, cy - 34, 8, 3, '#2a3040');
    // pièces (aubes de turbine) : une sur cinq est hors tolérance
    const gap = 34, span = W + gap * 2;
    let flagged = false;
    for (let i = 0; i < span / gap; i++) {
      const x = Math.round(((i * gap + t * 12) % span) - gap), id = Math.floor((i * gap + t * 12) / span) * 13 + i;
      const bad = hash(id, 5) > 0.78, near = Math.abs(x - sx) < 9;
      R(x - 5, cy - 3, 10, 3, '#8a94a8'); R(x - 3, cy - 9, 6, 6, bad ? '#c8a8a8' : '#d8e0ec'); R(x - 2, cy - 12, 4, 3, bad ? '#c8a8a8' : '#d8e0ec'); R(x - 3, cy - 9, 1, 6, '#ffffff');
      if (bad && x > sx - 9) { ring(x, cy - 7, 9, '#ff3a4a'); if (near) flagged = true; }
      else if (!bad && x > sx + 9 && x < sx + 40) { R(x + 5, cy - 14, 1, 1, '#2fd07a'); R(x + 6, cy - 13, 1, 1, '#2fd07a'); R(x + 7, cy - 15, 1, 2, '#2fd07a'); }
    }
    // laser
    const lw = Math.round(Math.sin(t * 6) * 5), lc = flagged ? '255,58,74' : '0,255,224';
    line(sx, cy - 31, sx + lw, cy - 2, flagged ? '#ff3a4a' : '#00ffe0');
    glow(sx + lw, cy - 6, 12, lc, 0.6); glow(sx, cy - 31, 8, lc, 0.5);
    // écran de contrôle : histogramme + seuil z-score
    const mx = Math.round(W * (W >= 250 ? 0.84 : 0.84)) + Math.round(px * 5), my = gy - 62;
    R(mx - 17, my - 2, 34, 24, '#2a3040'); R(mx - 15, my, 30, 20, '#0a1420');
    const bars = [3, 6, 10, 13, 10, 6, 3, 1, 5];
    bars.forEach((b, i) => R(mx - 13 + i * 3, my + 17 - b, 2, b, i === 8 ? '#ff3a4a' : '#00ffe0'));
    for (let y = my + 2; y < my + 18; y += 2) R(mx + 9, y, 1, 1, '#f2c14e');
    R(mx - 1, my + 22, 2, 6, '#2a3040');
    beam(W * 0.3, 0, W * 0.3, gy, 6, 50, '255,255,255', 0.1);
  },
};

// ---------- Salle de contrôle cyber : écrans d'alertes ----------
export const cyber = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('room', () => {
      bands(['#05070f', '#080c1c', '#0c1228'], 0, gy);
      for (let i = 0; i < W / 16 + 2; i++) R(i * 16 - 12, 0, 1, gy, '#0f1630');
    }, px * 2);
    // mur d'écrans
    const sw = 26, sh = 17, cols = Math.max(3, Math.floor((W - 10) / (sw + 4))), x0 = Math.round((W - cols * (sw + 4)) / 2) + Math.round(px * 4);
    const rowsN = Math.max(2, Math.min(4, Math.floor((gy - 30) / (sh + 4))));
    const alert = Math.sin(t * 1.1) > 0.2;
    for (let r = 0; r < rowsN; r++) for (let i = 0; i < cols; i++) {
      const x = x0 + i * (sw + 4), y = 8 + r * (sh + 4), k = i + r * 7, red = alert && hash(k, 3) > 0.62;
      R(x - 1, y - 1, sw + 2, sh + 2, '#1a2240'); R(x, y, sw, sh, red ? '#3a0a14' : '#081428');
      const kind = Math.floor(hash(k, 9) * 4);
      if (red) {
        if (Math.sin(t * 7 + k) > -0.2) { text('!', x + 12, y + 3, '#ff3a4a', 2); R(x + 2, y + 2, 6, 1, '#ff3a4a'); R(x + sw - 8, y + sh - 3, 6, 1, '#ff3a4a'); }
      } else if (kind === 0) {                          // courbe
        let py = y + 10;
        for (let j = 0; j < sw - 4; j++) { const ny = y + 9 + Math.round(Math.sin(j * 0.6 + t * 2 + k) * 3 + hash(j, k) * 2); line(x + 2 + j, py, x + 2 + j, ny, '#00ffe0'); py = ny; }
      } else if (kind === 1) {                          // barres (KPI)
        for (let j = 0; j < 7; j++) { const b = 2 + Math.round(hash(j, k) * 9 + Math.sin(t + j) * 1.5); R(x + 3 + j * 3, y + sh - 2 - b, 2, b, j === 5 ? '#f2c14e' : '#3f7bff'); }
      } else if (kind === 2) {                          // file de tickets
        for (let j = 0; j < 4; j++) { R(x + 2, y + 2 + j * 4, 2, 2, ['#2fd07a', '#f2c14e', '#ff3a4a', '#3f7bff'][(j + Math.floor(t + k)) % 4]); R(x + 6, y + 2 + j * 4, 8 + hash(j, k + Math.floor(t)) * 10, 2, '#27407e'); }
      } else {                                          // jauge SLA
        ring(x + 13, y + 11, 7, '#27407e', Math.PI, Math.PI * 2); ring(x + 13, y + 11, 7, '#2fd07a', Math.PI, Math.PI * (1.2 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.6 + k))));
        text('SLA', x + 8, y + 12, '#6aa2ff');
      }
      if (red) glow(x + sw / 2, y + sh / 2, 18, '255,58,74', 0.25);
    }
    glow(W / 2, gy * 0.4, Math.max(100, W * 0.5), alert ? '255,58,74' : '63,123,255', 0.12);
    // sol + pupitres
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#0c1228'); R(-12, gy, W + 24, 1, '#27407e');
      for (let r = 1; r < 8; r++) R(-12, gy + r * r * 1.4, W + 24, 1, '#111a3a');
      const n = Math.max(2, Math.floor(W / 70));
      for (let k = 0; k < n; k++) {
        const x = Math.round((k + 0.5) * W / n);
        R(x - 22, gy - 9, 44, 12, '#1a2240'); R(x - 24, gy - 11, 48, 3, '#27407e'); R(x - 20, gy + 3, 3, 8, '#111a3a'); R(x + 17, gy + 3, 3, 8, '#111a3a');
        R(x - 8, gy - 20, 16, 10, '#111a3a'); R(x - 7, gy - 19, 14, 8, '#0a2a4a'); R(x - 5, gy - 17, 8, 1, '#00ffe0'); R(x - 5, gy - 15, 5, 1, '#3f7bff');
        R(x + 14, gy - 15, 3, 4, '#f2f2f2');           // la tasse de café de l'analyste
      }
    }, px * 8);
    // gyrophare
    const gx = Math.round(W * 0.5 + px * 8);
    R(gx - 3, 2, 6, 4, alert ? '#ff3a4a' : '#5a1a22');
    if (alert) { const a = t * 6; beam(gx, 4, gx + Math.cos(a) * 60, 4 + Math.abs(Math.sin(a)) * 50 + 10, 2, 16, '255,58,74', 0.3); }
    motes(12, 5, t, 0, 0, W, gy, '#27407e', 0.05);
  },
};

// ---------- Stade la nuit ----------
export const stadium = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('sky', () => bands(['#04060f', '#080d24', '#0d163a', '#16245a'], 0, gy));
    stars(30, 33, gy * 0.4, t);
    // tribunes + foule
    const top = Math.round(gy * 0.42);
    layer('stands', () => {
      for (let r = 0; r < gy - top; r++) { const inset = Math.max(0, 24 - r * 1.4); R(-12 + inset, top + r, W + 24 - inset * 2, 1, r % 4 ? '#1a2246' : '#232c58'); }
      for (let i = 0; i < W * (gy - top) / 9; i++) {
        const x = hash(i, 2) * (W + 20) - 10, y = top + 4 + hash(i, 3) * (gy - top - 8);
        R(x, y, 1, 1, ['#e85a6a', '#f2c14e', '#3f7bff', '#d6ecff', '#4ecf8a'][i % 5]);
      }
      R(-12, gy - 5, W + 24, 5, '#0f1630');
      for (let i = 0; i < W / 22 + 2; i++) R(i * 22 - 12, gy - 5, 20, 4, ['#2f5fd0', '#00b8a8', '#b06ae8'][i % 3]);
    }, px * 4);
    // flashs dans la foule
    for (let i = 0; i < 10; i++) {
      const k = Math.floor(t * 3 + i * 0.37), x = hash(k, i + 5) * W, y = top + 4 + hash(k, i + 9) * (gy - top - 12);
      if (((t * 3 + i * 0.37) % 1) < 0.25) { R(x, y, 1, 1, '#ffffff'); glow(x, y, 5, '255,255,255', 0.7); }
    }
    // projecteurs
    const towers = W >= 250 ? [0.08, 0.34, 0.66, 0.92] : [0.12, 0.88];
    towers.forEach((f, i) => {
      const x = Math.round(W * f + px * 5), y = top - 16;
      R(x - 1, y, 2, gy - y - 20, '#3a4468'); R(x - 8, y - 8, 16, 9, '#27305a');
      for (let a = 0; a < 3; a++) for (let b = 0; b < 2; b++) R(x - 7 + a * 5, y - 7 + b * 4, 4, 3, '#fffbe6');
      glow(x, y - 4, 26, '255,250,220', 0.55);
      beam(x, y, W / 2 + (f - 0.5) * W * 0.3, H, 6, 70, '255,250,220', 0.1 + 0.02 * Math.sin(t * 2 + i));
    });
    // tableau d'affichage
    const bx = Math.round(W / 2 + px * 5), by = Math.max(6, top - 30);
    R(bx - 36, by - 2, 72, 24, '#1a2246'); R(bx - 34, by, 68, 20, '#05070f');
    text('NIX', bx - 31, by + 3, '#00ffe0'); text('BUG', bx + 20, by + 3, '#ff5a6a');
    text('3', bx - 9, by + 3, '#f2c14e', 2); text('0', bx + 4, by + 3, '#f2c14e', 2);
    if (Math.sin(t * 3) > 0) { R(bx - 1, by + 5, 2, 2, '#f2c14e'); R(bx - 1, by + 9, 2, 2, '#f2c14e'); }
    const min = 60 + Math.floor(t / 2) % 30;
    text(min + ':' + String(Math.floor(t * 30) % 60).padStart(2, '0'), bx - 9, by + 14, '#d6ecff');
    R(bx - 20, by + 22, 2, top - by - 18, '#27305a'); R(bx + 18, by + 22, 2, top - by - 18, '#27305a');
    // pelouse
    layer('pitch', () => {
      for (let i = 0; i < W / 18 + 3; i++) R(i * 18 - 24, gy, 18, H - gy, i % 2 ? '#2f9a4a' : '#38a854');
      R(-12, gy, W + 24, 1, '#e8f6e8'); R(-12, gy + 12, W + 24, 1, '#e8f6e8');
      for (let y = gy + 12; y < H; y++) R(W / 2, y, 1, 1, '#e8f6e8');
      ring(W / 2, gy + 34, 18, '#e8f6e8');
    }, px * 9);
    // ballon
    const ball = Math.round(W / 2 + Math.sin(t * 0.9) * W * 0.3 + px * 9), bh = Math.abs(Math.sin(t * 2.7)) * 10;
    R(ball - 2, gy + 21, 5, 1, '#1f7a38'); disc(ball, gy + 18 - Math.round(bh), 2, '#ffffff'); R(ball, gy + 18 - Math.round(bh), 1, 1, '#1a1a24');
  },
};
