// Zone 0 — Écran titre : nuit étoilée, Nix endormi dans un nid de flammes bleues.
import { R, bands, stars, ridge, layer, glow, disc, fire, motes } from './kit.js';

/** Ciel de nuit partagé avec le point de sauvegarde (la boucle est bouclée). */
export function nightSky(s) {
  layer('sky', () => bands(['#050818', '#080d2a', '#0d1640', '#16245a', '#223a7a', '#2f4f96'], 0, s.gy + 10));
  stars(Math.round(s.W * s.H / 700), 7, s.gy - 8, s.t);
  // lune
  const mx = Math.round(s.W * 0.87 + s.px * 2), my = Math.round(s.H * 0.33);
  glow(mx, my, 30, '168,208,255', 0.28);
  disc(mx, my, 8, '#d6ecff'); disc(mx - 2, my - 2, 2, '#a8d0ff'); R(mx + 3, my + 2, 2, 2, '#a8d0ff'); R(mx - 4, my + 4, 2, 1, '#a8d0ff');
  // étoile filante de temps en temps
  const tt = s.t % 11;
  if (tt < 0.7 && !s.low) {
    const x = s.W * 0.15 + tt * s.W * 0.6, y = s.H * 0.06 + tt * 34;
    R(x, y, 2, 1, '#ffffff'); R(x - 4, y - 1, 4, 1, '#a8d0ff'); R(x - 9, y - 2, 5, 1, '#3f7bff');
  }
}

export const title = {
  perch: s => ({ x: s.cx, y: s.gy - 16 }),
  face: -1,
  draw(s) {
    const { cx, gy, t } = s;
    nightSky(s);
    layer('far', () => ridge(3, gy + 6, 30, '#101b4a', 52), s.px * 3);
    layer('mid', () => ridge(11, gy + 20, 22, '#0b1338', 34), s.px * 6);
    layer('peak', () => {
      // piton rocheux qui porte le nid
      for (let i = 0; i < 60; i++) {
        const w = 34 + i * 2.6 + Math.sin(i * 1.3) * 4;
        R(cx - w / 2, gy + 8 + i * 3, w, 3, i % 3 ? '#0a1030' : '#0e1740');
      }
      R(cx - 16, gy + 9, 6, 2, '#16245a'); R(cx + 6, gy + 13, 9, 2, '#16245a');
    });
    glow(cx, gy - 2, 52, '63,123,255', 0.4);
    fire(cx - 24, gy + 8, 49, 20, t, 1);          // flammes derrière Nix
    motes(14, 4, t, cx - 26, gy - 50, 52, 54, '#6aa2ff', 0.22);
  },
  front(s) {
    const { cx, gy, t } = s;
    // nid de brindilles + flammes devant Nix
    fire(cx - 21, gy + 9, 43, 17, t * 1.2, 5);
    R(cx - 22, gy + 6, 44, 4, '#241a3e'); R(cx - 25, gy + 4, 50, 3, '#35285a');
    R(cx - 20, gy + 10, 40, 2, '#1a1230');
    for (let i = 0; i < 10; i++) R(cx - 23 + i * 5, gy + 5 + (i % 2), 3, 1, '#4d3c7a');
    fire(cx - 29, gy + 5, 10, 13, t, 8); fire(cx + 20, gy + 5, 10, 13, t, 9);
  },
};

/** Décor par défaut pour un projet sans décor dédié. */
export const generic = {
  draw(s) {
    const { W, H, gy, t } = s;
    layer('sky', () => bands(['#070a1c', '#0b1232', '#101b4a', '#1b2a5c'], 0, H));
    stars(50, 21, gy, t);
    layer('grid', () => {
      for (let i = 0; i < 12; i++) R(-12, gy + i * i * 0.9, W + 24, 1, '#27407e');
      for (let i = -14; i <= 14; i++) for (let y = gy; y < H; y++) R(W / 2 + i * (8 + (y - gy) * 0.5), y, 1, 1, '#27407e');
    }, s.px * 4);
    glow(W / 2, gy, 80, '0,255,224', 0.12);
  },
};
