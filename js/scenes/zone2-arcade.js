// Zone 2, quartier Arcade — salle d'arcade néon : une borne par projet du quartier
// (s.n = nombre de projets ; ajouter un projet ajoute une borne).
import { R, bands, layer, glow, disc, ring, line, hash, text, textW, motes } from './kit.js';

const NEON = [['#3f7bff', '63,123,255'], ['#ff3a8a', '255,58,138'], ['#2fd07a', '47,208,122'], ['#f2c14e', '242,193,78'], ['#b06ae8', '176,106,232']];

/** Mini-écran animé d'une borne : un motif différent par borne. */
function screen(x, y, i, t) {
  R(x, y, 16, 12, '#05040f');
  switch (i % 4) {
    case 0:                                                   // listes qui se cochent (plan d'étude)
      for (let r = 0; r < 3; r++) { const done = (t * 0.8 + r) % 3 < 1.5; R(x + 2, y + 2 + r * 3, 2, 2, done ? '#2fd07a' : '#3a4468'); R(x + 5, y + 2 + r * 3, 8 - r * 2, 1, '#a8d0ff'); }
      break;
    case 1: {                                                 // sphère du temps
      const a = t * 2;
      ring(x + 8, y + 6, 4, '#6aa2ff'); line(x + 8, y + 6, x + 8 + Math.cos(a) * 3, y + 6 + Math.sin(a) * 3, '#00ffe0');
      R(x + 2, y + 10, ((t * 3) % 12) | 0, 1, '#ff5a6a');
      break;
    }
    case 2: {                                                 // quiz : compte à rebours
      text('?', x + 3, y + 3, Math.sin(t * 5) > 0 ? '#ff3a8a' : '#ffd0e8');
      const left = 9 - Math.floor((t * 2) % 10);
      text(String(left), x + 10, y + 3, left < 3 ? '#ff5a6a' : '#f2c14e');
      break;
    }
    default: {                                                // mot à deviner
      const shown = Math.floor(t * 0.9) % 5;
      for (let k = 0; k < 4; k++) { if (k < shown) R(x + 2 + k * 3, y + 4, 2, 3, '#f2c14e'); R(x + 2 + k * 3, y + 8, 2, 1, '#a8d0ff'); }
    }
  }
}

function cabinet(x, y, i, t) {
  const [col, rgb] = NEON[i % NEON.length];
  x = Math.round(x);
  R(x - 11, y - 46, 22, 46, '#15102e'); R(x - 11, y - 46, 2, 46, col); R(x + 9, y - 46, 2, 46, col);
  R(x - 12, y - 53, 24, 8, col); R(x - 10, y - 51, 20, 4, '#15102e'); text('P' + (i + 1), x - 3, y - 51, Math.sin(t * 3 + i) > -0.6 ? '#ffffff' : col);
  screen(x - 8, y - 42, i, t);
  glow(x, y - 36, 18, rgb, 0.4);
  R(x - 12, y - 27, 24, 5, '#2a2050'); R(x - 12, y - 27, 24, 1, '#4a3c7a');          // pupitre
  R(x - 7, y - 31, 1, 4, '#d6ecff'); R(x - 8, y - 33, 3, 2, '#ff3a4a');              // manette
  R(x + 1, y - 26, 2, 2, '#00ffe0'); R(x + 5, y - 26, 2, 2, '#f2c14e');
  R(x - 3, y - 14, 6, 6, '#0a0820'); R(x - 1, y - 12, 2, 2, col);                    // monnayeur
  R(x - 11, y - 1, 22, 1, '#0a0820');
  for (let r = 0; r < 5; r++) R(x - 9 + r, y + 2 + r * 2, 18 - r * 2, 1, `rgba(${rgb},${0.2 - r * 0.035})`);   // reflet au sol
}

export const arcade = {
  draw(s) {
    const { W, H, gy, t, px } = s, wide = W >= 250, n = Math.max(1, s.n || 4);
    layer('room', () => {
      bands(['#0a0618', '#110a28', '#190e3a', '#22124c'], 0, gy);
      for (let i = 0; i < 26; i++) {                           // confettis géométriques sur le mur
        const x = hash(i, 3) * W, y = 26 + hash(i, 4) * (gy - 80), c = NEON[i % NEON.length][0];
        if (i % 3 === 0) { R(x, y, 5, 1, c); R(x + 2, y - 2, 1, 5, c); } else if (i % 3 === 1) ring(x, y, 2, c); else line(x, y, x + 4, y + 3, c);
      }
      R(-12, gy - 3, W + 24, 3, '#2e1a5e');
    }, px * 3);
    // enseigne néon
    const sign = 'ARCADE', sc = wide ? 3 : 2, nx = Math.round(W * (wide ? 0.7 : 0.5) - textW(sign, sc) / 2 + px * 4), ny = 18;
    const on = Math.sin(t * 2.3) > -0.9 && !(Math.sin(t * 17) > 0.96);
    text(sign, nx + 1, ny + 1, '#3a0e28', sc);
    text(sign, nx, ny, on ? '#ff3a8a' : '#5a1a3a', sc);
    if (on) glow(nx + textW(sign, sc) / 2, ny + 7, 46, '255,58,138', 0.3);
    // sol en damier
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#120a28');
      for (let r = 0; r < 12; r++) {
        const y0 = gy + Math.round(r * r * 1.1), y1 = gy + Math.round((r + 1) * (r + 1) * 1.1), sz = 10 + r * 5;
        for (let i = -20; i < 20; i++) if ((i + r) & 1) R(W / 2 + i * sz, y0, sz, y1 - y0, '#1e1242');
      }
      R(-12, gy, W + 24, 2, '#b06ae8');
    }, px * 8);
    // les bornes
    const x0 = W * (wide ? 0.44 : 0.04), x1 = W * (wide ? 0.99 : 0.96), step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) cabinet(x0 + step * (i + 0.5) + px * 8, gy + 5, i, t);
    // boule à facettes
    const bx = Math.round(W * (wide ? 0.3 : 0.84) + px * 5);
    R(bx, 0, 1, 20, '#3a2f7a'); disc(bx, 24, 5, '#8a8ab8');
    for (let i = 0; i < 6; i++) R(bx - 4 + ((i * 3 + Math.floor(t * 4)) % 9), 21 + (i % 3) * 3, 1, 1, '#ffffff');
    glow(bx, 24, 18, '214,236,255', 0.25);
    motes(14, 5, t, 0, 0, W, gy, '#ff8ac8', 0.06);
    motes(10, 8, t, 0, 0, W, gy, '#00ffe0', 0.08, false);
  },
};
