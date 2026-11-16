// Zone 8 — « L'Usine » : atelier industriel, chaîne d'assemblage, caisses.
import { R, bands, bricks, layer, glow, disc, hash, line, beam, motes, gear } from './kit.js';

function crate(x, y, w, h) {
  R(x, y, w, h, '#b07a4a'); R(x, y, w, 1, '#d09a62'); R(x, y + h - 1, w, 1, '#7a5230'); R(x, y, 1, h, '#7a5230'); R(x + w - 1, y, 1, h, '#7a5230');
  line(x + 1, y + 1, x + w - 2, y + h - 2, '#8a5e38');
}

export const factory = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('wall', () => {
      bricks(-12, 0, W + 24, gy + 2, '#4a3a3e', '#3e3034', 12, 6);
      // verrières au soleil couchant
      for (let i = 0; i < W / 70 + 1; i++) {
        const x = i * 70 + 10;
        R(x - 2, 16, 44, 30, '#2a2226');
        for (let a = 0; a < 4; a++) for (let b = 0; b < 3; b++) R(x + a * 10, 18 + b * 9, 9, 8, b === 0 ? '#ffb86a' : b === 1 ? '#ffd08a' : '#ffe6b0');
      }
      // tuyaux
      R(-12, 6, W + 24, 4, '#6a7480'); R(-12, 6, W + 24, 1, '#9aa4b0');
      for (let i = 0; i < W / 50 + 1; i++) R(i * 50 + 30, 5, 3, 6, '#4a5460');
    }, px * 3);
    for (let i = 0; i < W / 70 + 1; i++) beam(i * 70 + 30 + px * 3, 46, i * 70 + px * 3, gy + 10, 20, 34, '255,200,120', 0.12);
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#4e4a52'); R(-12, gy, W + 24, 2, '#6a666e');
      for (let i = 0; i < W / 8 + 4; i++) R(i * 8 - 12, gy + 22, 4, 2, i % 2 ? '#f2c14e' : '#2a2a30');
      for (let i = 0; i < 30; i++) R(hash(i, 3) * W, gy + 6 + hash(i, 4) * (H - gy), 7, 1, '#444048');
    }, px * 8);
    const ox = Math.round(px * 8);
    // piles de caisses (à gauche et à droite)
    crate(ox + 2, gy - 14, 16, 14); crate(ox + 19, gy - 12, 14, 12); crate(ox + 7, gy - 27, 15, 13);
    crate(W - 20 + ox, gy - 14, 16, 14); if (W >= 250) { crate(W - 38 + ox, gy - 11, 15, 11); crate(W - 26 + ox, gy - 26, 14, 12); }
    // convoyeur
    const cy = gy - 8, x0 = Math.round(W * (W >= 250 ? 0.36 : 0.22)) + ox, x1 = W - (W >= 250 ? 46 : 24) + ox;
    R(x0, cy, x1 - x0, 5, '#2a2a30'); R(x0, cy, x1 - x0, 1, '#5a5a62');
    for (let x = x0 + 6; x < x1; x += 22) { R(x, cy + 5, 3, gy + 10 - cy, '#3a3a42'); R(x - 2, gy + 9, 7, 2, '#3a3a42'); }
    gear(x0, cy + 2, 3, 6, t * 3, '#8a8a92', '#2a2a30'); gear(x1, cy + 2, 3, 6, t * 3, '#8a8a92', '#2a2a30');
    // pièces : filtres cylindriques assemblés puis mis en boîte
    const len = x1 - x0, gap = 26, arm = x0 + Math.round(len * 0.45);
    for (let i = 0; i < len / gap + 1; i++) {
      const d = (i * gap + t * 10) % (len + gap) - gap / 2;
      if (d < 4 || d > len - 4) continue;
      const x = x0 + Math.round(d);
      if (x < arm) { R(x - 4, cy - 8, 8, 8, '#d8dce4'); for (let k = 0; k < 4; k++) R(x - 3 + k * 2, cy - 7, 1, 6, '#9aa4b0'); }
      else { R(x - 4, cy - 10, 8, 10, '#d8dce4'); for (let k = 0; k < 4; k++) R(x - 3 + k * 2, cy - 8, 1, 6, '#9aa4b0'); R(x - 5, cy - 11, 10, 2, '#2f5fd0'); R(x - 5, cy - 1, 10, 1, '#2f5fd0'); if (x > arm + 18) { R(x + 5, cy - 14, 1, 1, '#2fd07a'); R(x + 6, cy - 13, 1, 1, '#2fd07a'); R(x + 7, cy - 15, 1, 2, '#2fd07a'); } }
    }
    // bras robotisé
    const ph = (t * 10 % gap) / gap, down = Math.sin(ph * Math.PI) * 9;
    R(arm - 5, 10, 10, 4, '#5a5a62'); R(arm - 2, 14, 4, cy - 34 + down, '#f2c14e'); R(arm - 2, 14, 1, cy - 34 + down, '#ffe08a');
    const hy = cy - 20 + down;
    R(arm - 6, hy, 12, 3, '#8a8a92'); R(arm - 6, hy + 3, 2, 5, '#8a8a92'); R(arm + 4, hy + 3, 2, 5, '#8a8a92');
    if (down > 7) { glow(arm, hy + 8, 10, '0,255,224', 0.6); R(arm - 1, hy + 8, 2, 1, '#ffffff'); }
    // poste d'inspection
    const ix = x0 + Math.round(len * 0.78);
    R(ix - 1, cy - 34, 2, 14, '#5a5a62'); R(ix - 7, cy - 38, 14, 5, '#3a3a42'); R(ix - 5, cy - 33, 10, 1, Math.sin(t * 4) > 0 ? '#2fd07a' : '#1a7a44');
    beam(ix, cy - 32, ix, cy - 2, 2, 9, '47,208,122', 0.35);
    // vapeur
    for (let i = 0; i < 5; i++) { const p = (t * 0.4 + i / 5) % 1; R(x0 + 10 + Math.sin(p * 6 + i) * 3, cy - 12 - p * 30, 2 + p * 3, 2 + p * 2, `rgba(220,220,230,${0.35 * (1 - p)})`); }
    motes(10, 7, t, 0, 10, W, gy - 10, '#ffd08a', 0.05);
  },
};
