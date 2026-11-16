// Zone 6 — « L'Arcade » : chambre d'étudiant, tour d'horloge, plateau télé, far west.
import { R, bands, bricks, ridge, layer, glow, disc, ring, hash, stars, text, line, cloud, beam, motes, gear } from './kit.js';

// ---------- Chambre d'étudiant cosy ----------
export const bedroom = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    const wide = W >= 250;
    layer('wall', () => {
      bands(['#3a2a44', '#4a3450', '#5a3e58'], 0, gy);
      for (let i = 0; i < W / 14 + 2; i++) R(i * 14 - 12, 0, 1, gy, '#44304c');
      R(-12, gy - 6, W + 24, 6, '#2e2036');
      // fenêtre
      const wx = Math.round(W * (wide ? 0.42 : 0.3));
      R(wx - 2, 14, 40, 36, '#2e2036'); R(wx, 16, 36, 32, '#0d1640'); R(wx + 17, 16, 2, 32, '#2e2036'); R(wx, 31, 36, 2, '#2e2036');
      disc(wx + 27, 23, 4, '#fff3c4');
      for (let i = 0; i < 8; i++) R(wx + 2 + hash(i, 2) * 30, 18 + hash(i, 3) * 26, 1, 1, '#d6ecff');
      R(wx - 5, 12, 6, 40, '#7a4a6a'); R(wx + 35, 12, 6, 40, '#7a4a6a');
      // affiche
      const ax = Math.round(W * (wide ? 0.62 : 0.74));
      R(ax, 18, 20, 26, '#f0e6c8'); R(ax + 2, 20, 16, 14, '#2f5fd0'); R(ax + 7, 24, 6, 6, '#6aa2ff'); R(ax + 3, 37, 14, 1, '#5a4a6a'); R(ax + 3, 40, 9, 1, '#5a4a6a');
      // étagère
      const ex = Math.round(W * (wide ? 0.8 : 0.06));
      R(ex, 30, 36, 2, '#8a5a3a');
      [['#e85a6a', 8], ['#4ecf8a', 10], ['#f2c14e', 7], ['#3f7bff', 9], ['#b06ae8', 8]].forEach(([c, h], i) => R(ex + 2 + i * 4, 30 - h, 3, h, c));
      R(ex + 26, 24, 5, 6, '#4ecf8a'); R(ex + 25, 22, 7, 3, '#3aa868');
    }, px * 3);
    layer('floor', () => {
      for (let i = 0; i < (H - gy) / 5 + 1; i++) { R(-12, gy + i * 5, W + 24, 5, i % 2 ? '#7a5238' : '#84593c'); R(-12, gy + i * 5, W + 24, 1, '#6a4630'); }
      const rx = Math.round(W * 0.5);
      R(rx - 40, gy + 12, 80, 22, '#3a5a8a'); R(rx - 36, gy + 15, 72, 16, '#4a70a8'); R(rx - 30, gy + 22, 60, 2, '#d6ecff');
    }, px * 8);
    // bureau + écran
    const dx = Math.round(W * (wide ? 0.6 : 0.66) + px * 8), dy = gy + 4;
    R(dx - 28, dy - 18, 56, 3, '#a8703f'); R(dx - 26, dy - 15, 3, 15, '#8a5a3a'); R(dx + 23, dy - 15, 3, 15, '#8a5a3a'); R(dx + 8, dy - 15, 16, 12, '#96643a'); R(dx + 14, dy - 10, 4, 1, '#5a3a22');
    R(dx - 14, dy - 38, 26, 17, '#1a1a2a'); R(dx - 12, dy - 36, 22, 13, '#0a1428'); R(dx - 3, dy - 21, 4, 3, '#1a1a2a'); R(dx - 7, dy - 19, 12, 1, '#1a1a2a');
    for (let i = 0; i < 5; i++) {                       // plan d'étude qui s'écrit à l'écran
      const w = 4 + hash(i, 7) * 12, shown = ((t * 1.2) % 7) > i;
      if (shown) { R(dx - 11, dy - 35 + i * 2.4, 1, 1, '#f2c14e'); R(dx - 9, dy - 35 + i * 2.4, w, 1, i % 2 ? '#00ffe0' : '#6aa2ff'); }
    }
    glow(dx - 1, dy - 30, 26, '63,160,255', 0.3);
    R(dx - 24, dy - 21, 8, 3, '#f0e6c8'); R(dx - 23, dy - 23, 8, 2, '#e85a6a');    // livres
    R(dx + 16, dy - 23, 4, 5, '#f2f2f2'); if (!s.low) R(dx + 17, dy - 26 - Math.round((t * 3) % 3), 1, 2, 'rgba(255,255,255,0.5)');
    // lampe de bureau
    const lx = dx - 24;
    R(lx - 3, dy - 20, 7, 2, '#3a3a4a'); line(lx, dy - 20, lx - 4, dy - 30, '#5a5a6a'); line(lx - 4, dy - 30, lx + 3, dy - 35, '#5a5a6a');
    R(lx + 1, dy - 38, 8, 4, '#f2c14e'); R(lx + 3, dy - 34, 4, 1, '#fffbe6');
    beam(lx + 5, dy - 33, lx + 12, dy - 16, 2, 20, '255,220,140', 0.4); glow(lx + 5, dy - 33, 30, '255,200,110', 0.35);
    // lit
    if (wide) {
      const bx = Math.round(W * 0.9 + px * 8);
      R(bx - 22, gy - 8, 50, 12, '#8a5a3a'); R(bx - 22, gy - 14, 50, 8, '#d6ecff'); R(bx - 6, gy - 14, 34, 8, '#3f7bff'); R(bx - 20, gy - 17, 12, 5, '#ffffff'); R(bx - 24, gy - 22, 3, 26, '#6a4630');
    }
    motes(8, 4, t, 0, 10, W, gy - 20, '#fff3c4', 0.04);
  },
};

// ---------- Tour d'horloge : engrenages, sablier ----------
export const clocktower = {
  draw(s) {
    const { W, H, gy, cx, t, px } = s;
    layer('wall', () => {
      bricks(-12, 0, W + 24, gy + 2, '#2a3038', '#20262e', 12, 6);
      for (const f of [0.08, 0.92]) { const x = Math.round(W * f); R(x - 5, 0, 10, gy, '#4a3a2a'); R(x - 5, 0, 2, gy, '#6a543a'); }
      R(-12, 8, W + 24, 5, '#4a3a2a'); R(-12, 8, W + 24, 1, '#6a543a');
    }, px * 3);
    // grand cadran rétro-éclairé
    const kx = Math.round(cx + (W >= 250 ? W * 0.14 : 0) + px * 4), ky = Math.round(gy * 0.46), kr = Math.min(34, Math.round(gy * 0.36));
    glow(kx, ky, kr * 2.2, '255,220,150', 0.3);
    disc(kx, ky, kr + 3, '#6a543a'); disc(kx, ky, kr, '#ffeec0'); disc(kx, ky, kr - 3, '#fff6dc');
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; R(kx + Math.cos(a) * (kr - 6) - 1, ky + Math.sin(a) * (kr - 6) - 1, i % 3 ? 1 : 2, i % 3 ? 1 : 2, '#4a3a2a'); }
    const am = t * 0.5 - Math.PI / 2, ah = t * 0.04 - 1;
    line(kx, ky, kx + Math.cos(am) * (kr - 9), ky + Math.sin(am) * (kr - 9), '#2a2018');
    line(kx, ky, kx + Math.cos(ah) * (kr - 17), ky + Math.sin(ah) * (kr - 17), '#2a2018'); line(kx + 1, ky, kx + 1 + Math.cos(ah) * (kr - 17), ky + Math.sin(ah) * (kr - 17), '#2a2018');
    disc(kx, ky, 2, '#b8863a');
    // engrenages
    const gx = Math.round(W * (W >= 250 ? 0.36 : 0.2) + px * 6);
    gear(gx, gy - 46, 13, 10, t * 0.6, '#b8863a', '#2a3038'); gear(gx + 20, gy - 30, 8, 8, -t * 0.98 + 0.3, '#8a94a8', '#2a3038');
    gear(gx - 16, gy - 26, 9, 8, -t * 0.87, '#d8a84a', '#2a3038');
    const g2 = Math.round(W * 0.9 + px * 6);
    gear(g2, gy - 60, 10, 9, t * 0.5, '#8a94a8', '#2a3038'); gear(g2 - 4, gy - 40, 7, 7, -t * 0.7, '#b8863a', '#2a3038');
    // balancier
    const pa = Math.sin(t * 2) * 0.45, pxx = Math.round(W * (W >= 250 ? 0.86 : 0.8) + px * 6), py = 12;
    const ex = pxx + Math.sin(pa) * 46, ey = py + Math.cos(pa) * 46;
    line(pxx, py, ex, ey, '#8a94a8'); disc(ex, ey, 5, '#d8a84a'); R(ex - 1, ey - 2, 2, 2, '#fff6dc');
    layer('floor', () => {
      for (let i = 0; i < (H - gy) / 6 + 1; i++) { R(-12, gy + i * 6, W + 24, 6, i % 2 ? '#5a4632' : '#63503a'); R(-12, gy + i * 6, W + 24, 1, '#4a3a2a'); }
      R(-12, gy, W + 24, 2, '#7a6248');
    }, px * 8);
    // sablier sur son socle
    const hx = Math.round(W * (W >= 250 ? 0.56 : 0.5) + px * 8), hy = gy + 2;
    R(hx - 8, hy - 6, 16, 6, '#4a3a2a'); R(hx - 10, hy - 8, 20, 3, '#6a543a');
    R(hx - 7, hy - 30, 14, 2, '#b8863a'); R(hx - 7, hy - 10, 14, 2, '#b8863a');
    const ph = (t * 0.12) % 1;
    for (let r = 0; r < 9; r++) {
      const w = 11 - r; R(hx - w / 2, hy - 28 + r, w, 1, '#cfe8f6'); R(hx - w / 2, hy - 11 - r, w, 1, '#cfe8f6');
      if (r >= ph * 9 && r > 1) R(hx - w / 2 + 1, hy - 28 + r, w - 2, 1, '#f2c14e');
      if (r < ph * 8) R(hx - w / 2 + 1, hy - 11 - r, w - 2, 1, '#f2c14e');
    }
    R(hx, hy - 19, 1, 7, '#f2c14e');
    glow(hx, hy - 19, 16, '242,193,78', 0.25);
    motes(14, 2, t, 0, 10, W, gy - 10, '#ffeec0', 0.05);
  },
};

// ---------- Plateau de jeu télé : néons, buzzers ----------
const NEON = ['#ff3a8a', '#00ffe0', '#f2c14e', '#b06ae8'];
export const tvset = {
  draw(s) {
    const { W, H, gy, cx, t, px } = s;
    layer('back', () => {
      bands(['#12061e', '#1e0a30', '#2a1044', '#381658'], 0, gy);
      for (let i = 0; i < W / 20 + 2; i++) R(i * 20 - 12, 0, 8, gy, 'rgba(120,60,180,0.12)');
    }, px * 2);
    // projecteurs
    for (let i = 0; i < 4; i++) {
      const x = W * (0.15 + i * 0.23) + px * 4, a = Math.sin(t * 0.8 + i * 1.6) * 0.4;
      beam(x, 0, x + Math.sin(a) * 90, gy + 20, 3, 30, i % 2 ? '255,58,138' : '0,255,224', 0.16);
      R(x - 3, 0, 6, 4, '#3a2a4a');
    }
    // enseigne néon
    const nx = Math.round(cx + (W >= 250 ? W * 0.12 : 0) + px * 5), ny = Math.max(8, Math.round(gy * 0.16));
    R(nx - 34, ny - 4, 68, 22, '#1a0a28');
    const on = Math.sin(t * 9) > -0.85;
    if (on) { text('QUIZ', nx - 23, ny + 1, '#ff3a8a', 3); text('QUIZ', nx - 22, ny + 1, '#ffd0e8', 3); glow(nx, ny + 8, 44, '255,58,138', 0.35); }
    // guirlande de lampes qui court autour
    const per = 2 * (68 + 22), nb = 30;
    for (let i = 0; i < nb; i++) {
      const d = i / nb * per; let x, y;
      if (d < 68) { x = nx - 34 + d; y = ny - 5; } else if (d < 90) { x = nx + 34; y = ny - 4 + (d - 68); } else if (d < 158) { x = nx + 34 - (d - 90); y = ny + 18; } else { x = nx - 35; y = ny + 18 - (d - 158); }
      const lit = (i + Math.floor(t * 8)) % 3 === 0;
      R(x, y, 2, 2, lit ? NEON[i % 4] : '#3a2a4a');
    }
    // chrono de 30 s
    const sec = 30 - Math.floor(t % 31), tx = Math.round(W * (W >= 250 ? 0.4 : 0.2) + px * 5), ty = Math.round(gy * 0.3);
    R(tx - 13, ty - 3, 26, 17, '#3a2a4a'); R(tx - 11, ty - 1, 22, 13, '#05070f');
    text(String(Math.max(0, sec)).padStart(2, '0'), tx - 7, ty + 1, sec <= 5 ? '#ff3a4a' : '#00ffe0', 2);
    if (sec <= 5 && Math.sin(t * 12) > 0) glow(tx, ty + 5, 18, '255,58,74', 0.4);
    // sol brillant en damier
    layer('floor', () => {
      for (let r = 0; r < (H - gy) / 6 + 1; r++) for (let i = -2; i < W / 14 + 2; i++) R(i * 14, gy + r * 6, 14, 6, (i + r) % 2 ? '#2a1044' : '#451c6c');
      R(-12, gy, W + 24, 2, '#ff3a8a');
    }, px * 9);
    // pupitres + buzzers
    const n = W >= 250 ? 3 : 2, cols = ['#ff3a4a', '#3f7bff', '#2fd07a'];
    for (let k = 0; k < n; k++) {
      const x = Math.round(W * (W >= 250 ? 0.46 + k * 0.17 : 0.3 + k * 0.42) + px * 9), y = gy + 6;
      R(x - 12, y - 22, 24, 22, '#1a0a28'); R(x - 14, y - 24, 28, 3, '#6a3a9a'); R(x - 10, y - 18, 20, 9, '#05070f');
      text(String(k + 1), x - 1, y - 16, '#f2c14e');
      const buzz = Math.floor(t * 0.7) % n === k && (t * 0.7) % 1 < 0.5;
      R(x - 5, y - 27, 10, 3, '#3a2a4a'); R(x - 4, y - 30 + (buzz ? 1 : 0), 8, 3, cols[k]); R(x - 3, y - 30 + (buzz ? 1 : 0), 3, 1, '#ffffff');
      if (buzz) glow(x, y - 29, 16, k === 0 ? '255,58,74' : k === 1 ? '63,123,255' : '47,208,122', 0.7);
    }
    motes(16, 8, t, 0, 0, W, gy, '#f2c14e', 0.12, false);
  },
};

// ---------- Ville western au coucher du soleil ----------
export const western = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('sky', () => bands(['#5a2a5e', '#9a3a5a', '#d85a4a', '#f28a3a', '#f8b84a', '#ffe08a'], 0, gy + 4));
    const sx = Math.round(W * 0.3 + px * 2);
    glow(sx, gy - 10, 70, '255,220,120', 0.5); disc(sx, gy - 10, 15, '#fff0b0');
    layer('mesa', () => {
      ridge(3, gy + 2, 8, '#8a3a4a', 50);
      [[0.1, 30, 34], [0.55, 22, 50], [0.86, 36, 26]].forEach(([f, h, w]) => { const x = W * f; R(x, gy - h, w, h + 4, '#8a3a4a'); R(x + 3, gy - h - 4, w - 8, 4, '#8a3a4a'); R(x - 4, gy - h * 0.5, 4, h * 0.5, '#8a3a4a'); });
    }, px * 3);
    layer('ground', () => {
      R(-12, gy, W + 24, H - gy, '#c8783a'); R(-12, gy, W + 24, 2, '#e09a4a');
      for (let i = 0; i < 50; i++) R(hash(i, 2) * W, gy + 4 + hash(i, 3) * (H - gy), 4 + hash(i, 4) * 8, 1, '#b0642e');
    }, px * 9);
    // saloon
    const bx = Math.round(W * (W >= 250 ? 0.62 : 0.6) + px * 7), by = gy + 2;
    R(bx - 30, by - 40, 60, 40, '#7a4a2a'); for (let i = 0; i < 8; i++) R(bx - 30, by - 40 + i * 5, 60, 1, '#5a3418');
    R(bx - 34, by - 52, 68, 13, '#8a5632'); R(bx - 34, by - 52, 68, 2, '#a86a3e'); text('SALOON', bx - 11, by - 48, '#ffe08a');
    R(bx - 36, by - 26, 72, 3, '#5a3418'); R(bx - 34, by - 23, 2, 23, '#5a3418'); R(bx + 32, by - 23, 2, 23, '#5a3418');
    R(bx - 24, by - 36, 10, 8, '#ffd070'); R(bx + 14, by - 36, 10, 8, '#ffd070'); glow(bx - 19, by - 32, 10, '255,200,100', 0.4); glow(bx + 19, by - 32, 10, '255,200,100', 0.4);
    R(bx - 8, by - 20, 16, 20, '#2a1608');
    const sw = Math.round(Math.sin(t * 2.4) * 2);                 // portes battantes
    R(bx - 8, by - 14, 7 + sw, 9, '#a86a3e'); R(bx + 1 - sw, by - 14, 7 + sw, 9, '#a86a3e');
    // panneau du jeu : lettres à deviner
    const px2 = Math.round(W * (W >= 250 ? 0.4 : 0.2) + px * 8), word = 'PHENIX', shown = Math.floor(t * 0.8) % (word.length + 3);
    R(px2 - 1, gy - 26, 2, 28, '#5a3418'); R(px2 - 19, gy - 38, 38, 14, '#8a5632'); R(px2 - 18, gy - 37, 36, 12, '#a86a3e');
    for (let i = 0; i < word.length; i++) {
      const order = [2, 5, 0, 3, 1, 4].indexOf(i);
      if (order < shown) text(word[i], px2 - 15 + i * 5, gy - 35, '#2a1608'); R(px2 - 15 + i * 5, gy - 28, 3, 1, '#2a1608');
    }
    // château d'eau + cactus
    const wx = Math.round(W * 0.92 + px * 7);
    R(wx - 8, gy - 44, 16, 14, '#7a4a2a'); R(wx - 10, gy - 46, 20, 3, '#5a3418'); line(wx - 7, gy - 30, wx - 10, gy, '#5a3418'); line(wx + 6, gy - 30, wx + 9, gy, '#5a3418'); R(wx - 9, gy - 16, 18, 1, '#5a3418');
    const cactus = (x, h) => { R(x, gy - h, 4, h + 2, '#3a8a4a'); R(x, gy - h, 1, h, '#5aba6a'); R(x - 4, gy - h * 0.6, 4, 2, '#3a8a4a'); R(x - 4, gy - h * 0.6 - 5, 2, 5, '#3a8a4a'); R(x + 4, gy - h * 0.45, 4, 2, '#3a8a4a'); R(x + 6, gy - h * 0.45 - 6, 2, 6, '#3a8a4a'); };
    cactus(Math.round(W * 0.12 + px * 9), 20); if (W >= 250) cactus(Math.round(W * 0.82 + px * 9), 14);
    // virevoltant
    const tx = ((t * 22) % (W + 40)) - 20, ty = gy + 14 - Math.abs(Math.sin(t * 3.4)) * 6, a = t * 5;
    ring(tx, ty, 5, '#8a5a2a'); ring(tx, ty, 3, '#a87a3a'); line(tx - Math.cos(a) * 5, ty - Math.sin(a) * 5, tx + Math.cos(a) * 5, ty + Math.sin(a) * 5, '#8a5a2a'); line(tx + Math.sin(a) * 5, ty - Math.cos(a) * 5, tx - Math.sin(a) * 5, ty + Math.cos(a) * 5, '#8a5a2a');
    motes(12, 6, t, 0, gy - 30, W, 50, '#ffe08a', 0.1);
  },
};
