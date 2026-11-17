// Zone 2, quartier C++ — « Les Terres du C++ » : un mini-biome par projet.
import { R, bands, ridge, layer, glow, disc, ring, hash, stars, text, line, cloud, beam, motes } from './kit.js';

// ---------- Station radar dans le désert, la nuit ----------
export const radar = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('sky', () => bands(['#06081a', '#0b1030', '#141a48', '#232a66', '#3a3a7e'], 0, gy + 6));
    stars(Math.round(W * H / 800), 14, gy - 12, t);
    layer('dunes1', () => ridge(6, gy + 4, 22, '#2a2a5e', 70), px * 3);
    layer('dunes2', () => ridge(12, gy + 12, 16, '#232250', 44), px * 6);
    layer('ground', () => {
      ridge(20, gy + 6, 6, '#3a3566', 30);
      for (let i = 0; i < 50; i++) R(hash(i, 3) * W, gy + 8 + hash(i, 4) * (H - gy), 5 + hash(i, 5) * 10, 1, '#322d5a');
    }, px * 9);
    // station
    const bx = Math.round(W * (W >= 250 ? 0.66 : 0.7) + px * 9), by = gy + 3;
    R(bx - 16, by - 14, 32, 14, '#4a4a78'); R(bx - 18, by - 16, 36, 3, '#5e5e92'); R(bx - 12, by - 9, 6, 9, '#1a1a38');
    R(bx + 2, by - 10, 9, 5, Math.sin(t * 2) > 0 ? '#00ffe0' : '#00b8a8');
    R(bx - 1, by - 46, 2, 30, '#8a8ab8'); R(bx - 5, by - 22, 10, 2, '#5e5e92');
    // parabole qui balaie
    const a = Math.sin(t * 0.7) * 0.5, dx = Math.round(Math.sin(a) * 5), ax = bx + dx, ay = by - 48;
    for (let i = -7; i <= 7; i++) R(ax + i, ay - Math.round((49 - i * i) / 9) + 3, 1, 3, i % 2 ? '#c8c8e8' : '#a8a8d0');
    R(ax - 1, ay - 8, 2, 6, '#8a8ab8'); R(ax - 1, ay - 9, 2, 2, '#ff5a6a');
    if (Math.sin(t * 4) > 0) glow(ax, ay - 8, 8, '255,90,106', 0.6);
    // drone émetteur + ondes concentriques
    const span = W + 60, dX = ((t * 14) % span) - 30, dY = Math.round(H * 0.18 + Math.sin(t * 1.2) * 4);
    for (let i = 0; i < 4; i++) {
      const r = ((t * 14 + i * 13) % 52);
      // les ondes sont comprimées devant le drone (effet Doppler)
      ring(dX - r * 0.25, dY + 2, r, r < 30 ? '#00ffe0' : '#1f8f9a', 0.1, Math.PI - 0.1);
    }
    for (let i = 0; i < 3; i++) ring(ax, ay - 4, 8 + ((t * 10 + i * 12) % 36), '#3f7bff', -Math.PI * 0.85, -Math.PI * 0.15);
    R(dX - 6, dY, 12, 2, '#c8c8e8'); R(dX - 2, dY - 2, 4, 5, '#8a8ab8'); R(dX - 8, dY - 1, 4, 1, '#e8e8ff'); R(dX + 4, dY - 1, 4, 1, '#e8e8ff');
    R(dX - 1, dY + 3, 2, 1, Math.sin(t * 8) > 0 ? '#ff5a6a' : '#5a2030');
    line(dX, dY + 4, ax, ay - 6, 'rgba(0,255,224,0.18)');
    glow(bx, by - 30, 50, '0,255,224', 0.1);
  },
};

// ---------- Entrepôt de cartouches de jeux ----------
const CART = ['#e85a6a', '#f2c14e', '#4ecf8a', '#3f7bff', '#b06ae8', '#00d8c8', '#f28a4e'];
export const warehouse = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('wall', () => {
      bands(['#1a2030', '#222a3e', '#2a344c'], 0, gy);
      for (let i = 0; i < W / 26 + 2; i++) R(i * 26 - 12, 0, 2, gy, '#161b2a');
      R(-12, 9, W + 24, 3, '#3a465e');
    }, px * 2);
    layer('shelves', () => {
      const n = Math.max(2, Math.floor(W / 62));
      for (let k = 0; k < n; k++) {
        const x = Math.round((k + 0.5) * W / n) - 22, top = 18;
        R(x - 2, top, 2, gy - top, '#f28a4e'); R(x + 44, top, 2, gy - top, '#f28a4e');
        for (let r = 0; top + r * 15 < gy - 8; r++) {
          const y = top + r * 15;
          R(x, y + 12, 44, 2, '#5a6478');
          for (let i = 0; i < 7; i++) {
            if (hash(i, k * 9 + r) < 0.14) continue;
            const c = CART[Math.floor(hash(i, k * 7 + r + 2) * CART.length)];
            R(x + 1 + i * 6, y + 3, 5, 9, '#2a2a3a'); R(x + 2 + i * 6, y + 4, 3, 5, c); R(x + 2 + i * 6, y + 10, 3, 1, '#8a8a9a');
          }
        }
      }
    }, px * 5);
    layer('floor', () => {
      R(-12, gy, W + 24, H - gy, '#3a4252'); R(-12, gy, W + 24, 2, '#4e586c');
      for (let i = 0; i < W / 8 + 4; i++) R(i * 8 - 12, gy + 10, 4, 2, i % 2 ? '#f2c14e' : '#2a2a3a');
      for (let i = 0; i < 30; i++) R(hash(i, 4) * W, gy + 16 + hash(i, 5) * (H - gy), 8, 1, '#343b4a');
    }, px * 8);
    // lampes
    for (let i = 0; i < Math.ceil(W / 90); i++) {
      const x = Math.round((i + 0.5) * 90 + px * 4);
      R(x, 0, 1, 12, '#161b2a'); R(x - 4, 12, 9, 3, '#5a6478'); R(x - 2, 15, 5, 1, '#fff3c4');
      beam(x, 16, x, gy, 3, 34, '255,240,190', 0.16);
    }
    // chariot élévateur
    const fx = Math.round(W * 0.5 + Math.sin(t * 0.35) * W * 0.24 + px * 8), fy = gy + 6, dir = Math.cos(t * 0.35) > 0;
    const lift = Math.round(6 + Math.sin(t * 0.9) * 5), m = dir ? 1 : -1;
    R(fx - 9, fy - 12, 18, 9, '#f2c14e'); R(fx - 9, fy - 12, 18, 2, '#ffe08a');
    R(fx - 7 * m - (m > 0 ? 0 : 9), fy - 20, 9, 8, '#2a344c'); R(fx - 6 * m - (m > 0 ? 0 : 7), fy - 19, 7, 5, '#8ad8ff');
    R(fx + 10 * m - (m > 0 ? 0 : 2), fy - 26, 2, 24, '#5a6478');
    R(fx + (m > 0 ? 12 : -22), fy - 4 - lift, 10, 1, '#8a8a9a');
    R(fx + (m > 0 ? 13 : -21), fy - 12 - lift, 8, 8, '#b07a4a'); R(fx + (m > 0 ? 13 : -21), fy - 9 - lift, 8, 1, '#7a5230');
    disc(fx - 6, fy - 2, 3, '#161b2a'); disc(fx + 6, fy - 2, 3, '#161b2a'); R(fx - 6, fy - 2, 1, 1, '#8a8a9a'); R(fx + 6, fy - 2, 1, 1, '#8a8a9a');
    if (Math.sin(t * 6) > 0) { R(fx - 1, fy - 22, 3, 2, '#ff8a3a'); glow(fx, fy - 21, 8, '255,138,58', 0.5); }
  },
};

// ---------- Champ de mines : cases d'herbe ----------
const NUMC = { 1: '#2f5fd0', 2: '#2f8a4a', 3: '#d04a4a' };
export const minefield = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    layer('sky', () => bands(['#3f8fd8', '#6ab2ec', '#9fd2f6', '#d2ecfb'], 0, gy));
    for (let i = 0; i < 5; i++) {
      const span = W + 80, x = ((hash(i, 2) * span + t * (2 + i % 2 * 2)) % span) - 40 + px * 3;
      cloud(x, 12 + hash(i, 3) * gy * 0.45, 22 + hash(i, 4) * 20, '#ffffff', '#cfe4f4');
    }
    layer('hills', () => { ridge(4, gy + 2, 22, '#5aa870', 60); ridge(9, gy + 3, 10, '#4a9862', 28); }, px * 4);
    const T = 12, cols = Math.ceil(W / T) + 2, rows = Math.ceil((H - gy) / T) + 1, ox = Math.round(px * 8) - T;
    layer('tiles', () => {
      for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) {
        const x = i * T - T, y = gy + r * T, h = hash(i, r * 13 + 1);
        if (h > 0.76) {                                // case révélée
          R(x, y, T, T, (i + r) % 2 ? '#d8b98a' : '#e4c79a');
          const n = 1 + Math.floor(hash(i, r + 40) * 3.4);
          if (n <= 3) text(n, x + 4, y + 3, NUMC[n]);
        } else {
          R(x, y, T, T, (i + r) % 2 ? '#5fc46a' : '#52b65e'); R(x, y, T, 1, '#74d67c');
          if (h < 0.12) { R(x + 5, y + 2, 1, 8, '#3a2a1a'); R(x + 6, y + 2, 4, 3, '#e8404a'); R(x + 3, y + 10, 5, 1, '#3a2a1a'); }   // drapeau
          else if (h < 0.3) { R(x + 3, y + 5, 1, 2, '#3f9a4c'); R(x + 8, y + 7, 1, 2, '#3f9a4c'); }
        }
      }
      R(-12, gy, W + 24, 1, '#3f9a4c');
    }, ox + T);
    // mines qui clignotent
    for (let k = 0; k < 5; k++) {
      const i = Math.floor(hash(k, 61) * (cols - 2)) + 1, r = Math.floor(hash(k, 62) * Math.max(1, rows - 1));
      const x = i * T + ox + 6, y = gy + r * T + 6;
      disc(x, y, 3, '#1a1a24'); R(x - 4, y, 9, 1, '#1a1a24'); R(x, y - 4, 1, 9, '#1a1a24'); R(x - 1, y - 1, 1, 1, '#8a8a9a');
      if (Math.sin(t * 5 + k * 1.9) > 0.2) { R(x, y, 1, 1, '#ff3a4a'); glow(x, y, 7, '255,58,74', 0.6); }
    }
  },
};

// ---------- Bataille navale : mer animée, navires sur grille ----------
function ship(x, y, len, t, i) {
  const b = Math.round(Math.sin(t * 1.4 + i * 2) * 1.2);
  y += b;
  R(x, y, len, 4, '#6a7488'); R(x + 2, y + 4, len - 4, 1, '#4a5466'); R(x - 2, y, 2, 2, '#6a7488'); R(x + len, y, 2, 2, '#6a7488');
  R(x, y, len, 1, '#9aa4b8');
  R(x + len * 0.35, y - 5, len * 0.3, 5, '#8a94a8'); R(x + len * 0.42, y - 8, len * 0.14, 3, '#9aa4b8');
  R(x + len * 0.48, y - 13, 1, 5, '#4a5466'); R(x + len * 0.48 + 1, y - 13, 3, 2, '#e8404a');
  R(x + 3, y - 2, 4, 2, '#4a5466'); R(x + 5, y - 3, 5, 1, '#4a5466');
  R(x + len - 8, y - 2, 4, 2, '#4a5466'); R(x + len - 11, y - 3, 5, 1, '#4a5466');
}
export const sea = {
  draw(s) {
    const { W, H, gy, t, px } = s;
    const hz = gy - 14;
    layer('sky', () => bands(['#274a8a', '#3f74b8', '#6aa2d8', '#a8d0e8', '#ffe2b8'], 0, hz + 2));
    for (let i = 0; i < 4; i++) {
      const span = W + 80, x = ((hash(i, 2) * span + t * 2.5) % span) - 40 + px * 2;
      cloud(x, 10 + hash(i, 3) * hz * 0.5, 24 + hash(i, 4) * 18, '#ffffff', '#cfe0f0');
    }
    layer('sea', () => bands(['#2a7ab8', '#1f66a8', '#185494', '#12447e', '#0e3668'], hz, H));
    // vagues
    for (let r = 0; r < (H - hz) / 5; r++) {
      const y = hz + 3 + r * 5, sp = 3 + r * 0.8;
      for (let i = 0; i < W / 16 + 2; i++) {
        const x = ((i * 16 + t * sp + (r % 2) * 8) % (W + 16)) - 8;
        R(x, y + Math.round(Math.sin(t * 1.5 + i + r) * 0.8), 4 + (r % 3), 1, r < 3 ? '#8ac8ec' : '#4a9ad0');
      }
    }
    // grille de jeu
    const G = 16, g0 = gy - 2, ox = Math.round(px * 6);
    for (let i = 0; i < W / G + 2; i++) for (let y = g0; y < H; y += 2) R(i * G + ox, y, 1, 1, 'rgba(0,255,224,0.28)');
    for (let r = 0; g0 + r * G < H; r++) for (let x = 0; x < W; x += 2) R(x, g0 + r * G, 1, 1, 'rgba(0,255,224,0.28)');
    for (let i = 0; i < W / G; i++) text('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i % 26], i * G + ox + 6, g0 - 7, '#d6ecff');
    // navires
    ship(Math.round(W * 0.52 + ox), g0 + 8, 34, t, 0);
    ship(Math.round(W * 0.78 + ox), g0 + G + 10, 22, t, 1);
    if (W >= 250) ship(Math.round(W * 0.36 + ox), g0 + G * 2 + 12, 26, t, 2);
    // tirs : à l'eau (rond blanc) et touché (croix rouge)
    const mx = Math.round(W * 0.66 + ox), my = g0 + G + 8, rr = (t * 6) % 9;
    ring(mx, my, 2 + rr, '#ffffff'); R(mx, my, 1, 1, '#ffffff');
    const hx = Math.round(W * 0.52 + ox) + 12, hy = g0 + 6;
    if (Math.sin(t * 5) > -0.3) { line(hx - 3, hy - 3, hx + 3, hy + 3, '#ff3a4a'); line(hx + 3, hy - 3, hx - 3, hy + 3, '#ff3a4a'); }
    R(hx - 1, hy - 8 - Math.round((t * 6) % 6), 2, 2, '#5a5a66'); R(hx + 1, hy - 12 - Math.round((t * 5) % 7), 2, 2, '#7a7a86');
    motes(8, 3, t, 0, hz, W, 20, '#ffffff', 0.08);
  },
};
