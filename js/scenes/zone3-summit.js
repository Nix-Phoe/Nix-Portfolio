// Zone 3 — « Le Sommet » : temple flottant au-dessus des nuages (certifications + expérience).
import { R, bands, layer, glow, disc, hash, cloud, beam, motes } from './kit.js';

function crystal(x, y, h, col, hi) {
  for (let r = 0; r < h; r++) {
    const w = Math.max(1, Math.round((r < h * 0.3 ? r / (h * 0.3) : 1 - (r - h * 0.3) / (h * 0.7)) * h * 0.42));
    R(x - w, y + r, w * 2 + 1, 1, col); R(x - w, y + r, Math.max(1, w * 0.6), 1, hi);
  }
}

export const temple = {
  draw(s) {
    const { W, H, gy, cx, t, px } = s;
    layer('sky', () => bands(['#2f6fd8', '#4f92ea', '#7ab6f6', '#a8d4fb', '#d6ecff', '#f4fbff'], 0, H));
    // rayons de lumière
    for (let i = 0; i < 4; i++) beam(W * (0.2 + i * 0.22), 0, W * (0.1 + i * 0.26), H, 4, 26, '255,255,255', 0.08 + 0.03 * Math.sin(t * 0.7 + i));
    for (let i = 0; i < 5; i++) {
      const span = W + 100, x = ((hash(i, 2) * span + t * 3) % span) - 50 + px * 2;
      cloud(x, 10 + hash(i, 3) * gy * 0.4, 26 + hash(i, 4) * 22, '#ffffff', '#cfe4f8');
    }
    // île flottante + temple
    const ix = Math.round(cx + (W >= 250 ? W * 0.14 : 0) + px * 5), iy = gy + Math.round(Math.sin(t * 0.8) * 2);
    for (let r = 0; r < 26; r++) { const w = 60 - r * 2.2 + hash(r, 5) * 4; R(ix - w, iy + r, w * 2, 1, r % 4 ? '#6a7aa8' : '#5a6a98'); }
    R(ix - 62, iy - 3, 124, 4, '#7ad08a'); R(ix - 62, iy - 3, 124, 1, '#a8eab0');
    R(ix - 44, iy - 7, 88, 4, '#e8eef8'); R(ix - 40, iy - 11, 80, 4, '#f6f9ff'); R(ix - 44, iy - 4, 88, 1, '#b8c6dc');
    for (let i = 0; i < 6; i++) {
      const x = ix - 35 + i * 14;
      R(x - 3, iy - 41, 7, 30, '#f6f9ff'); R(x - 3, iy - 41, 2, 30, '#ffffff'); R(x + 2, iy - 41, 2, 30, '#c8d6ea'); R(x - 4, iy - 43, 9, 2, '#e8eef8'); R(x - 4, iy - 13, 9, 2, '#e8eef8');
    }
    R(ix - 42, iy - 47, 84, 4, '#f6f9ff'); R(ix - 42, iy - 44, 84, 1, '#b8c6dc');
    for (let r = 0; r < 12; r++) R(ix - 40 + r * 3.3, iy - 48 - r, 80 - r * 6.6, 1, r % 3 ? '#e8eef8' : '#f6f9ff');
    disc(ix, iy - 53, 3, '#f2c14e'); glow(ix, iy - 53, 14, '255,220,120', 0.6);
    R(ix - 6, iy - 30, 12, 19, '#27407e'); glow(ix, iy - 20, 22, '0,255,224', 0.3 + 0.1 * Math.sin(t * 2));
    // cristaux flottants
    const cs = [[-0.36, 0.3, 14, '#00d8c8', '#b0fff6'], [0.3, 0.2, 18, '#6aa2ff', '#d6ecff'], [-0.18, 0.12, 10, '#ff8ac8', '#ffd6ec'], [0.42, 0.42, 11, '#00d8c8', '#b0fff6']];
    cs.forEach(([fx, fy, h, c, hi], i) => {
      const x = Math.round(cx + fx * W + px * (7 + i)), y = Math.round(gy * fy + Math.sin(t * 1.3 + i * 1.7) * 4);
      glow(x, y + h / 2, h * 1.6, i === 2 ? '255,138,200' : '0,216,200', 0.35); crystal(x, y, h, c, hi);
    });
    // mer de nuages
    for (let l = 0; l < 3; l++) {
      const y = gy + 16 + l * Math.max(8, (H - gy) * 0.22), sp = 4 + l * 3;
      for (let i = 0; i < W / 26 + 3; i++) {
        const x = ((i * 26 + t * sp + l * 11) % (W + 78)) - 52 + px * (6 + l * 3);
        cloud(x, y + hash(i, l) * 4, 34, l === 2 ? '#ffffff' : l ? '#eef6ff' : '#d6e8fb', l === 2 ? null : '#c0d8f2');
      }
      R(0, y + 4, W, H - y, l === 2 ? '#ffffff' : l ? '#eef6ff' : '#d6e8fb');
    }
    motes(20, 4, t, 0, 0, W, gy, '#ffffff', 0.1);
  },
};
