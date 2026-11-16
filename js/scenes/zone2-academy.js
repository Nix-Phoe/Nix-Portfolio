// Zone 2 — « L'Académie » : bibliothèque de tour magique, livres qui flottent, bougies bleues.
import { R, bricks, layer, glow, disc, hash, motes, stars, fire } from './kit.js';

const SPINES = ['#7a3b5e', '#3b5e7a', '#5e7a3b', '#7a6a3b', '#4b3b7a', '#3b7a6f', '#8a4a3b', '#2f5fd0'];

function shelf(x, y, w, h, seed) {
  R(x - 2, y - 2, w + 4, h + 4, '#2a1c3a'); R(x, y, w, h, '#150d22');
  const rows = Math.max(1, Math.floor(h / 13));
  for (let r = 0; r < rows; r++) {
    const by = y + r * 13;
    let bx = x + 1;
    for (let i = 0; bx < x + w - 2; i++) {
      const bw = 2 + Math.floor(hash(i, seed + r) * 2), bh = 7 + Math.floor(hash(i, seed + r + 7) * 4);
      if (hash(i, seed + r + 3) > 0.12) {
        R(bx, by + 11 - bh, bw, bh, SPINES[Math.floor(hash(i, seed + r + 5) * SPINES.length)]);
        if (bh > 8) R(bx, by + 13 - bh, bw, 1, '#d8c890');
      }
      bx += bw + (hash(i, seed + r + 9) > 0.8 ? 2 : 1);
    }
    R(x, by + 11, w, 2, '#3a2850');
  }
}

function candle(x, y, t, i) {
  R(x, y, 2, 6, '#d6ecff'); R(x - 1, y + 6, 4, 1, '#6a5a8a');
  const f = Math.sin(t * 11 + i * 2) > 0 ? 1 : 0;
  R(x, y - 3 - f, 2, 3 + f, '#3f7bff'); R(x, y - 2, 1, 2, '#d6ecff');
  glow(x + 1, y - 2, 16, '63,123,255', 0.3 + 0.05 * Math.sin(t * 9 + i));
}

function book(x, y, t, i) {
  const flap = Math.sin(t * 3 + i) > 0;
  R(x - 5, y, 11, 1, '#2a1c3a');
  R(x - 5, y - (flap ? 3 : 2), 5, flap ? 3 : 2, '#f0e6c8'); R(x + 1, y - (flap ? 3 : 2), 5, flap ? 3 : 2, '#f0e6c8');
  R(x - 5, y - (flap ? 4 : 3), 4, 1, SPINES[i % SPINES.length]); R(x + 2, y - (flap ? 4 : 3), 4, 1, SPINES[i % SPINES.length]);
  R(x - 3, y - 2, 2, 1, '#8a7a9a'); R(x + 2, y - 2, 2, 1, '#8a7a9a');
}

export const academy = {
  draw(s) {
    const { W, H, gy, cx, t, px } = s;
    layer('wall', () => {
      bricks(-12, 0, W + 24, gy + 2, '#2b2046', '#221838', 12, 6);
      // grande fenêtre en ogive
      const ww = 34, wx = cx - ww / 2, wy = Math.max(10, gy - 82);
      R(wx - 3, wy + 12, ww + 6, gy - wy - 22, '#17102a'); disc(cx, wy + 14, 20, '#17102a');
      R(wx, wy + 14, ww, gy - wy - 26, '#0d1640'); disc(cx, wy + 14, 17, '#0d1640');
    }, px * 2);
    // ciel dans la fenêtre
    const wy = Math.max(10, gy - 82), ox = Math.round(px * 2);
    for (let i = 0; i < 9; i++) {
      const x = cx - 14 + hash(i, 31) * 28 + ox, y = wy + 2 + hash(i, 32) * 50;
      if (Math.sin(t * 2 + i) > -0.3) R(x, y, 1, 1, '#d6ecff');
    }
    disc(cx + 6 + ox, wy + 16, 5, '#d6ecff');
    R(cx - 1 + ox, wy - 2, 1, gy - wy - 10, '#17102a'); R(cx - 17 + ox, wy + 30, 34, 1, '#17102a');
    glow(cx + ox, wy + 30, 46, '106,162,255', 0.16);
    // bibliothèques
    layer('shelves', () => {
      const sw = Math.max(30, Math.round((W - 70) / 2)), sh = gy - 16;
      shelf(-6, 12, sw, sh, 1); shelf(W - sw + 6, 12, sw, sh, 40);
    }, px * 5);
    // sol dallé + tapis
    layer('floor', () => {
      for (let r = 0; r < (H - gy) / 6 + 1; r++) for (let i = -2; i < W / 12 + 2; i++)
        R(i * 12 + (r % 2) * 6, gy + r * 6, 12, 6, (i + r) % 2 ? '#3a2c5c' : '#33264f');
      R(-12, gy, W + 24, 2, '#4b3a72');
      R(cx - 46, gy + 8, 92, H - gy, '#5a2f5e'); R(cx - 42, gy + 8, 84, H - gy, '#6f3a6a');
      for (let i = 0; i < 12; i++) R(cx - 40 + i * 7, gy + 11, 3, 1, '#d8c890');
    }, px * 8);
    // bougies
    const cs = W >= 250 ? [0.16, 0.38, 0.62, 0.84] : [0.14, 0.86];
    cs.forEach((f, i) => candle(Math.round(W * f + px * 8), gy - 7, t, i));
    // livres volants
    for (let i = 0; i < (W >= 250 ? 6 : 4); i++) {
      const bx = W * (0.12 + 0.76 * hash(i, 51)) + Math.sin(t * 0.5 + i * 2) * 8 + px * (6 + i);
      const by = gy * (0.25 + 0.4 * hash(i, 52)) + Math.sin(t * 1.3 + i * 1.7) * 5;
      book(Math.round(bx), Math.round(by), t, i);
    }
    motes(26, 9, t, 0, 10, W, gy - 10, '#a8d0ff', 0.06);
  },
};
