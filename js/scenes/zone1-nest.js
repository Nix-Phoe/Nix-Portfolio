// Zone 1 — « Le Nid » : falaise au lever du soleil, nuages qui défilent.
import { R, bands, ridge, layer, glow, disc, cloud, hash, motes } from './kit.js';

export const nest = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('sky', () => bands(['#2a2868', '#4b3a8a', '#8a4f93', '#cf6f86', '#f29a72', '#ffc98a', '#ffe7b0'], 0, gy + 8));
    // soleil levant
    const sx = Math.round(W * 0.7 + px * 2), sy = gy + 1;
    glow(sx, sy, 70, '255,190,110', 0.55);
    disc(sx, sy, 17, '#ffe9a8'); disc(sx, sy, 14, '#fff6d6');
    // nuages sur trois profondeurs
    for (let i = 0; i < 7; i++) {
      const d = i % 3, span = W + 90;
      const x = ((hash(i, 2) * span + t * (2 + d * 2.5)) % span) - 45 + px * (2 + d * 3);
      cloud(x, H * 0.08 + hash(i, 5) * gy * 0.55, 20 + hash(i, 8) * 26, d === 2 ? '#fff1e0' : d ? '#ffd9c8' : '#e9a9b0', d === 2 ? '#f2b8a8' : '#c9849a');
    }
    layer('mount', () => { ridge(4, gy + 6, 26, '#7a5596', 64); ridge(8, gy + 8, 14, '#5d4488', 30); }, px * 3);
    // mer
    layer('sea', () => bands(['#f6b47c', '#dd8580', '#9c5d92', '#5a4690', '#3a3478'], gy + 6, H));
    for (let i = 0; i < 12; i++) {                       // reflet du soleil
      const w = 20 - i * 1.3 + Math.sin(t * 2.2 + i * 1.1) * 4;
      R(sx - w / 2, gy + 8 + i * 3, w, 1, i < 4 ? '#fff6d6' : '#ffd9a0');
    }
    for (let i = 0; i < 16; i++) {                       // vaguelettes
      const y = gy + 10 + hash(i, 3) * (H - gy - 12);
      R((hash(i, 6) * W + Math.sin(t * 0.8 + i) * 4), y, 5 + hash(i, 9) * 6, 1, '#ffd0b0');
    }
    // falaise
    const xe = Math.round(W >= 250 ? W * 0.5 : W * 0.86);
    layer('cliff', () => {
      for (let r = 0; r < H - gy + 2; r++) {
        const w = xe - Math.min(r * 0.9, 14) + hash(r, 4) * 3 + (r > 20 ? -6 : 0);
        R(-12, gy + r, w + 12, 1, ['#3d2f66', '#342858', '#2b204a'][(r >> 2) % 3]);
        R(w - 3, gy + r, 3, 1, '#57427f');                // arête éclairée
      }
      R(-12, gy - 2, xe + 15, 3, '#3f9080'); R(-12, gy - 3, xe + 12, 1, '#62c2a0');
      for (let i = 0; i < xe / 5; i++) {
        const x = hash(i, 12) * xe;
        R(x, gy - 5, 1, 2, '#62c2a0');
        if (i % 4 === 0) R(x + 2, gy - 4, 1, 1, i % 8 ? '#ffe7b0' : '#ff9ab0');
      }
      for (let i = 0; i < 9; i++) R(hash(i, 15) * (xe - 20), gy + 6 + hash(i, 16) * 30, 5, 1, '#4a3a76');
    });
    motes(10, 6, t, 0, gy - 60, W, 60, '#fff6d6', 0.05);
  },
};
