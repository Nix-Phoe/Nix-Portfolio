// Zone 7 — « Le Temple des Succès » : temple au-dessus des nuages, puis mini-labo quantique.
import { R, bands, layer, glow, disc, ring, hash, stars, text, line, cloud, beam, motes } from './kit.js';

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

export const quantum = {
  draw(s) {
    const { W, H, gy, cx, t, px } = s;
    layer('room', () => {
      bands(['#07041a', '#0d0728', '#150b3a', '#1e104c'], 0, gy);
      // circuit quantique sur le mur : fils + portes
      const y0 = 14, n = Math.max(3, Math.min(5, Math.floor((gy - 40) / 14)));
      for (let q = 0; q < n; q++) {
        const y = y0 + q * 14;
        R(-12, y, W + 24, 1, '#3a2a7a'); text('Q' + q, 2, y - 7, '#6a5ab8');
        for (let i = 0; i < W / 34; i++) {
          if (hash(i, q + 3) < 0.45) continue;
          const x = 22 + i * 34 + (q % 2) * 10, g = 'HXZT'[Math.floor(hash(i, q + 8) * 4)];
          R(x - 4, y - 4, 9, 9, '#2a1a5e'); R(x - 3, y - 3, 7, 7, '#150b3a'); text(g, x - 1, y - 2, '#b06ae8');
        }
      }
      for (let i = 0; i < W / 68; i++) {                // portes à deux qubits
        const x = 40 + i * 68; R(x, y0, 1, 14, '#00ffe0'); disc(x, y0, 1, '#00ffe0'); ring(x, y0 + 14, 3, '#00ffe0'); R(x - 3, y0 + 14, 7, 1, '#00ffe0');
      }
    }, px * 3);
    // impulsions qui parcourent les fils
    const n = Math.max(3, Math.min(5, Math.floor((gy - 40) / 14)));
    for (let q = 0; q < n; q++) {
      const x = ((t * (30 + q * 9) + q * 50) % (W + 30)) - 15 + px * 3, y = 14 + q * 14;
      R(x - 3, y, 6, 1, '#00ffe0'); R(x, y - 1, 2, 3, '#ffffff'); glow(x, y, 8, '0,255,224', 0.5);
    }
    // sol en perspective
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#0d0728'); R(-12, gy, W + 24, 1, '#b06ae8');
      for (let r = 1; r < 9; r++) R(-12, gy + r * r * 1.3, W + 24, 1, '#2a1a5e');
      for (let i = -12; i <= 12; i++) line(W / 2 + i * 14, gy, W / 2 + i * 44, H, '#2a1a5e');
    }, px * 8);
    // sphères de Bloch (qubits)
    const qs = W >= 250 ? [[0.46, 0.52, 15], [0.66, 0.34, 11], [0.86, 0.56, 13]] : [[0.22, 0.6, 12], [0.78, 0.56, 13]];
    qs.forEach(([fx, fy, r], i) => {
      const x = Math.round(W * fx + px * (6 + i * 2)), y = Math.round(gy * fy + Math.sin(t * 1.1 + i * 2) * 3);
      glow(x, y, r * 2.4, i % 2 ? '176,106,232' : '0,255,224', 0.3);
      ring(x, y, r, '#b06ae8');
      for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; R(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.3, 1, 1, '#6a5ab8'); }
      R(x, y - r, 1, r * 2, '#3a2a7a');
      // vecteur d'état en précession
      const th = 0.9 + 0.5 * Math.sin(t * 0.7 + i), ph = t * (1.3 + i * 0.4);
      const vx = x + Math.sin(th) * Math.cos(ph) * r, vy = y - Math.cos(th) * r + Math.sin(th) * Math.sin(ph) * r * 0.3;
      line(x, y, vx, vy, '#00ffe0'); disc(vx, vy, 1, '#ffffff'); glow(vx, vy, 6, '0,255,224', 0.7);
      R(x - 1, y + r + 2, 3, gy - y - r - 2, '#2a1a5e'); R(x - 5, gy - 2, 11, 3, '#3a2a7a');
    });
    motes(24, 9, t, 0, 0, W, H, '#b06ae8', 0.07);
    motes(12, 12, t, 0, 0, W, H, '#00ffe0', 0.09, false);
  },
};
