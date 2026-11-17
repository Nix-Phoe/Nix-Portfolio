// Zone 4 — « Point de sauvegarde » : feu de camp bleu, même ciel que l'écran titre.
import { R, ridge, layer, glow, hash, motes, fire, disc } from './kit.js';
import { nightSky } from './zone0-title.js';

function pine(x, y, h, col) {
  R(x, y - 3, 2, 4, '#1a1230');
  for (let r = 0; r < h; r++) { const w = 1 + Math.floor((r % 7) * 0.9 + r * 0.22); R(x - w + 1, y - h + r - 2, w * 2, 1, col); }
}

export const campfire = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    nightSky(s);
    layer('far', () => ridge(3, gy + 6, 30, '#101b4a', 52), px * 3);
    layer('trees', () => {
      for (let i = 0; i < W / 9 + 3; i++) pine(i * 9 - 10 + hash(i, 2) * 5, gy + 4, 22 + hash(i, 3) * 22, i % 2 ? '#0a1436' : '#0c1a40');
    }, px * 6);
    layer('ground', () => {
      R(-12, gy + 2, W + 24, H - gy, '#0e1a3a'); R(-12, gy + 2, W + 24, 2, '#16285a');
      for (let i = 0; i < 40; i++) R(hash(i, 5) * W, gy + 6 + hash(i, 6) * (H - gy), 3 + hash(i, 7) * 6, 1, '#0a1430');
      for (let i = 0; i < W / 7; i++) R(hash(i, 8) * W, gy, 1, 2, '#1f3a6e');
    }, px * 9);
    const fx = Math.round(W * (W >= 250 ? 0.52 : 0.5) + px * 9), fy = gy + 12;
    // lueur du feu
    glow(fx, fy - 8, 90, '63,123,255', 0.35 + 0.05 * Math.sin(t * 7));
    glow(fx, fy - 6, 34, '0,255,224', 0.25);
    // pierres + bûches
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; disc(fx + Math.cos(a) * 14, fy + Math.sin(a) * 4 + 1, 2, i % 2 ? '#3a4468' : '#4a5680'); }
    R(fx - 10, fy - 2, 20, 3, '#3a2a22'); R(fx - 8, fy - 4, 16, 2, '#4a3628'); R(fx - 10, fy - 2, 2, 3, '#6a4e3a');
    fire(fx - 9, fy - 2, 19, 26, t, 4);
    fire(fx - 5, fy - 2, 11, 16, t * 1.3, 7, ['#3f7bff', '#6aa2ff', '#00ffe0', '#ffffff']);
    motes(18, 3, t, fx - 16, fy - 80, 32, 78, '#6aa2ff', 0.3);
    // cristal de sauvegarde
    const cx = Math.round(W * (W >= 250 ? 0.78 : 0.84) + px * 9), cy = gy - 20 + Math.round(Math.sin(t * 1.6) * 3);
    glow(cx, cy + 6, 22, '0,255,224', 0.45);
    for (let r = 0; r < 14; r++) { const w = r < 5 ? r : Math.max(0, 5 - (r - 5) * 0.6); R(cx - w, cy + r, w * 2 + 1, 1, '#00d8c8'); R(cx - w, cy + r, Math.max(1, w), 1, '#b0fff6'); }
    R(cx - 5, gy + 1, 11, 2, '#3a4468');
    // tente
    if (W >= 250) {
      const tx = Math.round(W * 0.92 + px * 9);
      for (let r = 0; r < 20; r++) { R(tx - r, gy - 18 + r, r * 2, 1, r % 5 ? '#27407e' : '#1b2a5c'); }
      for (let r = 6; r < 20; r++) R(tx - r * 0.25, gy - 18 + r, r * 0.5, 1, '#0a1030');
    }
    // lucioles
    motes(14, 11, t, 0, gy - 40, W, 50, '#00ffe0', 0.03);
  },
};
