// Zone 3 — « La Forge » : forge souterraine, enclume, étincelles, lave bleue.
import { R, bands, ridge, layer, glow, hash, motes, fire, line } from './kit.js';

export const forge = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('cave', () => {
      bands(['#0a0a16', '#12101f', '#1a1630', '#231d40'], 0, gy + 4);
      // stalactites
      for (let i = 0; i < W / 9 + 3; i++) {
        const x = i * 9 - 10 + hash(i, 2) * 5, h = 8 + hash(i, 3) * 26;
        for (let r = 0; r < h; r++) { const w = Math.max(1, 7 * (1 - r / h)); R(x - w / 2, r, w, 1, r % 5 ? '#07070f' : '#0e0d1c'); }
      }
    }, px * 3);
    layer('rocks', () => { ridge(5, gy + 2, 30, '#15122a', 26); ridge(9, gy + 6, 12, '#1c1836', 15); }, px * 5);
    // fournaise (à droite)
    const fx = Math.round(W * (W >= 250 ? 0.8 : 0.82) + px * 7);
    layer('furnace', () => {
      const x = Math.round(W * (W >= 250 ? 0.8 : 0.82));
      R(x - 20, gy - 44, 40, 46, '#2a2540'); R(x - 23, gy - 47, 46, 5, '#3a3458'); R(x - 8, gy - 62, 16, 16, '#2a2540'); R(x - 10, gy - 64, 20, 3, '#3a3458');
      for (let i = 0; i < 5; i++) R(x - 18 + i * 9, gy - 40 + (i % 2) * 14, 6, 1, '#1c1830');
      R(x - 12, gy - 26, 24, 22, '#07070f');
    }, px * 7);
    fire(fx - 11, gy - 4, 22, 20, t, 2, ['#2f5fd0', '#3f7bff', '#00ffe0', '#eaffff']);
    glow(fx, gy - 14, 46, '0,200,255', 0.35 + 0.06 * Math.sin(t * 8));
    // sol
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#1c1836'); R(-12, gy, W + 24, 2, '#2c2650');
      for (let i = 0; i < 40; i++) R(hash(i, 6) * W, gy + 4 + hash(i, 7) * (H - gy), 4 + hash(i, 8) * 8, 1, '#141127');
    });
    // rivière de lave bleue
    const ly = gy + Math.round((H - gy) * 0.28), lh = Math.max(8, Math.round((H - gy) * 0.2));
    R(0, ly, W, lh, '#1b3fb0'); R(0, ly, W, 1, '#0b1a50'); R(0, ly + lh - 1, W, 1, '#0b1a50');
    for (let i = 0; i < W / 5; i++) {
      const x = (i * 5 + t * 6) % (W + 10) - 5, y = ly + 2 + hash(i, 11) * (lh - 4);
      R(x, y, 3 + hash(i, 12) * 5, 1, Math.sin(t * 3 + i) > 0.3 ? '#00ffe0' : '#3f7bff');
    }
    glow(W / 2, ly + lh / 2, Math.max(W * 0.6, 90), '47,95,208', 0.3);
    // enclume + marteau
    const ax = Math.round(W * (W >= 250 ? 0.56 : 0.5) + px * 8), ay = gy;
    R(ax - 9, ay - 5, 18, 5, '#2a2540'); R(ax - 5, ay - 9, 10, 4, '#3a3458');
    R(ax - 12, ay - 14, 24, 5, '#565078'); R(ax - 17, ay - 13, 6, 3, '#565078'); R(ax - 12, ay - 14, 24, 1, '#8a84b0');
    const hit = Math.abs(Math.sin(t * 2.2)), hy = ay - 16 - Math.round(hit * 14);
    R(ax - 4, hy - 5, 9, 5, '#8a84b0'); R(ax - 4, hy - 5, 9, 1, '#c8c4e8'); line(ax + 4, hy - 3, ax + 15, hy - 7 - hit * 3, '#7a5a3a');
    if (hit < 0.25) {                                  // étincelles à l'impact
      glow(ax, ay - 15, 18, '0,255,224', 0.5);
      for (let i = 0; i < 8; i++) R(ax + (hash(i, Math.floor(t * 2.2 / Math.PI)) - 0.5) * 26, ay - 16 - hash(i, 4) * 12 * (1 - hit * 4), 1, 1, i % 2 ? '#00ffe0' : '#ffffff');
    }
    // chaînes
    for (const f of [0.34, 0.66]) { const x = Math.round(W * f + px * 4); for (let i = 0; i < 9; i++) R(x + (i % 2), i * 3, 1, 2, '#3a3458'); }
    motes(22, 13, t, 0, gy - 70, W, 100, '#00ffe0', 0.18);
    motes(14, 17, t, fx - 16, gy - 80, 32, 60, '#d6ecff', 0.3);
  },
};
