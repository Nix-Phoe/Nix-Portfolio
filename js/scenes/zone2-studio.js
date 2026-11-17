// Zone 2, quartier ★ — « L'Atelier StickFlow » : studio d'animation pixel.
// Un stickman s'anime image par image sur un écran géant (avec pelure d'oignon),
// la pellicule du haut défile avec le scroll, la timeline montre les images clés
// (losanges dorés) et les images intermédiaires générées (cyan).
import { R, bands, layer, glow, disc, line, motes, text } from './kit.js';

/** Bonhomme allumette. (x, y) = bassin, k = échelle, ph = phase du cycle de marche. */
function stick(x, y, k, ph, col) {
  const seg = (ang, len, ox, oy) => [ox + Math.sin(ang) * len, oy + Math.cos(ang) * len];
  const sx = x + Math.sin(ph * 2) * 0.6 * k, sy = y - 11 * k;
  line(x, y, sx, sy, col);                                   // tronc
  disc(sx + 0.8 * k, sy - 3.4 * k, Math.max(1, Math.round(2.4 * k)), col);
  for (const sgn of [1, -1]) {
    const a = Math.sin(ph) * 0.95 * sgn;                     // bras (coude plié vers l'avant)
    const el = seg(a, 5 * k, sx, sy + k), ha = seg(a + 0.9, 5 * k, el[0], el[1]);
    line(sx, sy + k, el[0], el[1], col); line(el[0], el[1], ha[0], ha[1], col);
    const b = -Math.sin(ph) * 0.8 * sgn;                     // jambes (genou plié vers l'arrière)
    const kn = seg(b, 6 * k, x, y), ft = seg(b - 0.35 - 0.5 * Math.max(0, Math.cos(ph) * sgn), 6 * k, kn[0], kn[1]);
    line(x, y, kn[0], kn[1], col); line(kn[0], kn[1], ft[0], ft[1], col);
  }
}

export const studio = {
  draw(s) {
    const { W, H, gy, t, px } = s, wide = W >= 250;
    layer('room', () => {
      bands(['#100c2a', '#161038', '#1d1548', '#261c5c'], 0, gy);
      for (let i = 0; i < W / 26 + 2; i++) for (let j = 0; j < 4; j++) {          // mousse acoustique
        const x = i * 26 - 12 + (j % 2) * 13, y = 22 + j * 15;
        if (y + 11 > gy - 4) continue;
        R(x, y, 23, 11, (i + j) % 2 ? '#1a1444' : '#211a52'); R(x, y, 23, 1, '#2b2266');
      }
    }, px * 3);
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#0e0a24'); R(-12, gy, W + 24, 2, '#3a2f7a');
      for (let r = 1; r < 10; r++) R(-12, gy + r * r * 1.2, W + 24, 1, '#1a1440');
      for (let i = -14; i <= 14; i++) line(W / 2 + i * 13, gy + 2, W / 2 + i * 40, H, '#1a1440');
    }, px * 8);

    // pellicule : défile avec le scroll
    const fy = 3, cell = 18, off = Math.round((s.scroll || 0) * 0.5 + px * 4);
    R(0, fy, W, 15, '#05040f'); R(0, fy, W, 1, '#2b2266'); R(0, fy + 14, W, 1, '#2b2266');
    const shift = ((off % cell) + cell) % cell;
    for (let x = -shift, i = Math.floor(off / cell); x < W; x += cell, i++) {
      R(x + 2, fy + 3, 14, 9, '#141a40');
      stick(x + 9, fy + 9, 0.34, i * 0.7, i % 4 === 0 ? '#f2c14e' : '#6aa2ff');
      R(x + 3, fy + 1, 2, 1, '#d6ecff'); R(x + 11, fy + 1, 2, 1, '#d6ecff'); R(x + 3, fy + 13, 2, 1, '#d6ecff'); R(x + 11, fy + 13, 2, 1, '#d6ecff');
    }

    // écran géant
    const sw = Math.min(104, Math.round(W * (wide ? 0.38 : 0.82))), sh = Math.min(64, Math.round((gy - 34) * 0.78));
    const x0 = Math.round(W * (wide ? 0.63 : 0.5) - sw / 2 + px * 5), y0 = 24;
    R(x0 - 4, y0 - 4, sw + 8, sh + 8, '#05040f'); R(x0 - 3, y0 - 3, sw + 6, sh + 6, '#3f7bff'); R(x0 - 1, y0 - 1, sw + 2, sh + 2, '#05040f');
    R(x0, y0, sw, sh, '#0a0f26');
    for (let gx = 8; gx < sw; gx += 8) R(x0 + gx, y0, 1, sh, '#0f1632');
    for (let g = 8; g < sh; g += 8) R(x0, y0 + g, sw, 1, '#0f1632');
    R(x0, y0 + sh - 7, sw, 1, '#27407e');                     // sol de la scène
    glow(x0 + sw / 2, y0 + sh / 2, sw * 0.8, '63,123,255', 0.2);
    // le stickman : 12 images par cycle, 8 images par seconde, pelure d'oignon derrière
    const frames = 12, f = Math.floor(t * 8), k = Math.max(1, sh / 34);
    const bx = x0 + sw / 2, by = y0 + sh - 7 - 11.4 * k;
    const ph = n => (n % frames) / frames * Math.PI * 2;
    if (!s.low) { stick(bx - 5 * k, by, k, ph(f + frames - 2), '#1d4a5a'); stick(bx - 2.5 * k, by, k, ph(f + frames - 1), '#1f8f9a'); }
    stick(bx, by, k, ph(f), '#ffffff');
    text('REC', x0 + 3, y0 + 3, Math.sin(t * 4) > 0 ? '#ff5a6a' : '#5a2030');

    // timeline : images clés (or) et images intermédiaires générées (cyan), tête de lecture
    const ty = y0 + sh + 8, n = Math.floor(sw / 6), cur = f % n;
    R(x0 - 1, ty - 1, sw + 2, 9, '#05040f');
    for (let i = 0; i < n; i++) {
      const x = x0 + i * 6 + 1, key = i % 4 === 0;
      R(x, ty + 1, 4, 5, key ? '#3a2f1a' : '#0a2a36');
      if (key) { R(x + 1, ty + 2, 2, 3, '#f2c14e'); R(x, ty + 3, 4, 1, '#f2c14e'); } else R(x + 1, ty + 3, 2, 1, '#00ffe0');
    }
    R(x0 + cur * 6, ty - 2, 1, 11, '#ffffff'); R(x0 + cur * 6 - 1, ty - 3, 3, 2, '#ffffff');

    // poste de travail
    const dx = Math.round(W * (wide ? 0.2 : 0.16) + px * 9), dy = gy + 4;
    R(dx - 20, dy - 14, 40, 3, '#4a3c7a'); R(dx - 20, dy - 14, 40, 1, '#6a5aa8'); R(dx - 17, dy - 11, 3, 13, '#2e2552'); R(dx + 14, dy - 11, 3, 13, '#2e2552');
    R(dx - 11, dy - 32, 22, 15, '#05040f'); R(dx - 10, dy - 31, 20, 13, '#0f1a45'); R(dx - 2, dy - 17, 4, 3, '#2e2552');
    stick(dx, dy - 21, 0.5, ph(f), '#00ffe0');
    glow(dx, dy - 25, 22, '0,255,224', 0.22);
    R(dx + 13, dy - 17, 4, 3, '#f2f2f2'); R(dx - 18, dy - 16, 8, 2, '#8a8ab8');
    // projecteurs
    for (const lx of [x0 - 10, x0 + sw + 10]) {
      R(lx - 1, gy - 30, 2, 32, '#2e2552'); R(lx - 4, gy - 34, 8, 5, '#6a5aa8'); glow(lx, gy - 31, 16, '168,208,255', 0.3);
    }
    motes(12, 9, t, 0, 20, W, gy - 20, '#6aa2ff', 0.05);
  },
};
