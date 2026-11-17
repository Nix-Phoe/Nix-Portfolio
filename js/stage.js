// La scène : un seul canvas basse résolution (pixels nets), fixe derrière les sections.
// Elle dessine la zone courante selon sa progression, ou — entre deux zones — le
// mélange des deux décors selon la position du scroll (transitions « scrubbées »).
// Rien ici ne dépend du temps écoulé depuis un déclenchement : seulement de `p`.

import * as K from './scenes/kit.js';
import { DECORS } from './scenes/index.js';
import { Nix, pathPoint, homeFace } from './phoenix.js';
import { clamp, lerp, range, easeInOutCubic, easeOutCubic } from './scroll-engine.js';

const mk = () => document.createElement('canvas');
const bufA = mk(), bufB = mk(), tmp = mk();
let actx, bctx, tctx;

// Trame ordonnée 4×4 : 17 motifs, du vide au plein (fondu « 16 bits »).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
let patterns = null;
function ditherPatterns(ctx) {
  if (patterns) return patterns;
  patterns = [];
  for (let n = 0; n <= 16; n++) {
    const cv = mk(); cv.width = cv.height = 4;
    const c = cv.getContext('2d');
    c.fillStyle = '#000';
    for (let i = 0; i < 16; i++) if (BAYER[i] < n) c.fillRect(i % 4, i >> 2, 1, 1);
    patterns.push(ctx.createPattern(cv, 'repeat'));
  }
  return patterns;
}

export const stage = {
  canvas: null, ctx: null, box: null,
  W: 0, H: 0, gy: 0, css: 4,
  t: 0, pointer: 0, scroll: 0,
  zones: [], world: null,
  nix: new Nix(),
  reduced: false, flash: 0,

  init(canvas, zones, world) {
    this.canvas = canvas; this.box = canvas.parentElement;
    this.ctx = canvas.getContext('2d');
    this.zones = zones; this.world = world;
    actx = bufA.getContext('2d'); bctx = bufB.getContext('2d'); tctx = tmp.getContext('2d');
    window.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') this.pointer = (e.clientX / window.innerWidth) * 2 - 1; }, { passive: true });
    this.resize();
    const p = pathPoint('title', 0, this);
    this.nix.x = p.x; this.nix.y = p.y;
  },

  setReduced(b) { this.reduced = b; this.nix.low = b; },

  /** Adapte le canvas à l'écran : un pixel de jeu = un nombre entier de pixels écran. */
  resize() {
    // (un onglet masqué peut annoncer une taille nulle : on garde un minimum)
    const vw = Math.max(160, this.box.clientWidth), vh = Math.max(160, this.box.clientHeight), dpr = window.devicePixelRatio || 1;
    const s = Math.max(1, Math.min(Math.floor(vh / 180), Math.floor(vw / 180)));
    const dev = Math.max(1, Math.round(s * dpr));
    const css = dev / dpr, W = Math.ceil(vw / css), H = Math.ceil(vh / css);
    if (W === this.W && H === this.H && css === this.css) return false;
    const rx = this.W ? this.nix.x / this.W : 0.5, ry = this.H ? this.nix.y / this.H : 0.5;
    this.css = css; this.W = W; this.H = H; this.gy = Math.round(H * 0.62);
    for (const cv of [this.canvas, bufA, bufB, tmp]) { cv.width = W; cv.height = H; }
    this.canvas.style.width = W * css + 'px';
    this.canvas.style.height = H * css + 'px';
    this.nix.x = rx * W; this.nix.y = ry * H;
    K.clearCache();
    return true;
  },

  state(p, px, extra) {
    return { t: this.t, W: this.W, H: this.H, gy: this.gy, cx: this.W >> 1, px, p, low: this.reduced, scroll: this.scroll, ...extra };
  },

  /** Dessine la zone d'indice `zi` à la progression p (la caméra glisse avec p). */
  drawZone(ctx, zi, p) {
    const z = this.zones[zi];
    ctx.imageSmoothingEnabled = false;
    if (z.id === 'world') { this.drawWorld(ctx, p); return; }
    const px = this.reduced ? 0 : (0.5 - p) * 2.2 + this.pointer * 0.18;
    K.use(ctx, this.W, this.H, z.scene);
    (DECORS[z.scene] || DECORS.generic).draw(this.state(p, px));
  },

  /** Éléments du décor qui passent devant Nix (le nid de l'écran titre). */
  drawFront(ctx, zi, p) {
    const z = this.zones[zi], d = DECORS[z.scene];
    if (!d || !d.front) return;
    K.use(ctx, this.W, this.H, z.scene);
    d.front(this.state(p, 0));
  },

  /** Le Monde des Projets : la caméra glisse horizontalement sur les parcelles. */
  drawWorld(ctx, p) {
    const w = this.world, W = this.W, H = this.H, cam = w.cam(p), i0 = Math.floor(cam);
    for (let i = i0; i <= i0 + 1; i++) {
      const plot = w.plots[i];
      if (!plot) continue;
      const X = Math.round((i - cam) * W);
      if (X >= W || X <= -W) continue;
      ctx.save();
      ctx.beginPath(); ctx.rect(X, 0, W, H); ctx.clip();
      ctx.translate(X, 0);
      K.use(ctx, W, H, plot.scene);
      const px = this.reduced ? 0 : clamp(X / W, -1, 1) * 1.1 + this.pointer * 0.18;
      (DECORS[plot.scene] || DECORS.generic).draw(this.state(1 - Math.abs(X / W), px, { n: plot.n }));
      ctx.restore();
    }
    // montant entre deux parcelles (portail doré à l'entrée d'un quartier)
    const next = w.plots[i0 + 1];
    if (next && cam > i0) {
      const x = Math.round((i0 + 1 - cam) * W), hw = next.gate ? 7 : 4;
      K.use(ctx, W, H, '');
      K.R(x - hw, 0, hw * 2, H, '#05060f'); K.R(x - hw, 0, 1, H, '#27407e'); K.R(x + hw - 1, 0, 1, H, '#27407e');
      for (let y = 5; y < H; y += 10) {
        const on = ((y / 10 | 0) + Math.floor(this.t * 3)) & 1;
        K.R(x - 1, y, 2, 2, on ? (next.gate ? '#f2c14e' : '#00ffe0') : '#1b2a5c');
      }
    }
  },

  /** Une frame. view = { zone, p, trans: { from, to, p } | null }, vel en écrans/s. */
  render(dt, view, vel = 0) {
    this.t += dt;
    const c = this.ctx, nix = this.nix, tr = view.trans, zones = this.zones;
    c.imageSmoothingEnabled = false;
    this.flash = 0; nix.rebirth = 0;
    let target;
    if (tr) {
      this.drawZone(actx, tr.from, 1); this.drawFront(actx, tr.from, 1);
      this.drawZone(bctx, tr.to, 0);
      const a = pathPoint(zones[tr.from].id, 1, this), b = pathPoint(zones[tr.to].id, 0, this);
      target = this.blend(this.reduced ? 'fade' : zones[tr.to].enter, tr.p, a, b);
      target.home = homeFace(zones[tr.p < 0.5 ? tr.from : tr.to].id, this);
    } else {
      const id = zones[view.zone].id;
      this.drawZone(c, view.zone, view.p);
      target = pathPoint(id, view.p, this);
      target.home = homeFace(id, this);
      target.heading = id === 'world';
    }
    target.direct = target.direct || this.reduced;

    K.use(c, this.W, this.H, '');
    nix.steer(target, dt, vel);
    nix.update(dt, this.t);
    nix.draw(c, this.t);
    if (!tr) this.drawFront(c, view.zone, view.p);
    if (this.flash > 0.01) {
      c.fillStyle = `rgba(214,236,255,${Math.min(1, this.flash)})`;
      c.fillRect(0, 0, this.W, this.H);
    }
  },

  /** Mélange les décors A (bufA) et B (bufB) selon p. Renvoie la cible de Nix. */
  blend(type, p, a, b) {
    const c = this.ctx, W = this.W, H = this.H, nix = this.nix;
    const e = easeInOutCubic(p);
    const along = { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) - Math.sin(p * Math.PI) * 10 };

    switch (type) {
      // Fondu tramé qui monte depuis l'horizon (le jour se lève)
      case 'dither': {
        const pat = ditherPatterns(c);
        c.drawImage(bufA, 0, 0);
        tctx.globalCompositeOperation = 'source-over';
        tctx.clearRect(0, 0, W, H);
        for (let y = 0; y < H; y += 4) {
          const lv = Math.round(clamp(p * 1.7 - (1 - y / H) * 0.7) * 16);
          if (!lv) continue;
          tctx.fillStyle = pat[lv];
          tctx.fillRect(0, y, W, 4);
        }
        tctx.globalCompositeOperation = 'source-in';
        tctx.drawImage(bufB, 0, 0);
        c.drawImage(tmp, 0, 0);
        return { ...along, fly: true };
      }

      // Traînée de feu : Nix traverse l'écran, ses flammes effacent A et révèlent B
      case 'flight': {
        c.drawImage(bufA, 0, 0);
        const e0 = 0.2, yMid = H * 0.38;
        if (p < e0) {
          const q = easeInOutCubic(p / e0);
          return { x: lerp(a.x, -34, q), y: lerp(a.y, yMid, q), fly: true, direct: true, face: -1 };
        }
        const q = (p - e0) / (1 - e0), edge = -34 + q * (W + 80);
        const ny = yMid + Math.sin(q * Math.PI * 2) * 9;
        for (let y = 0; y < H; y += 2) {
          const wob = Math.sin(y * 0.21 + this.t * 14) * 4 + Math.sin(y * 0.07 - this.t * 9) * 5;
          const w = Math.round(edge - 6 + wob - Math.abs(y - ny) * 0.12);
          if (w <= 0) continue;
          const ww = Math.min(W, w);
          c.drawImage(bufB, 0, y, ww, 2, 0, y, ww, 2);
          if (w < W + 8) {
            c.fillStyle = '#2f5fd0'; c.fillRect(w, y, 5, 2);
            c.fillStyle = '#6aa2ff'; c.fillRect(w, y, 3, 2);
            c.fillStyle = '#d6ecff'; c.fillRect(w, y, 1, 2);
          }
        }
        return { x: edge + 8, y: ny, fly: true, direct: true, face: 1 };
      }

      // Envol : la caméra monte à travers les nuages jusqu'au décor suivant
      case 'ascent': {
        const off = Math.round(e * H);
        c.drawImage(bufB, 0, off - H);
        c.drawImage(bufA, 0, off);
        K.use(c, W, H, '');
        const cols = [['#d6e8fb', '#b8d2ee'], ['#eef6ff', '#c8dcf4'], ['#ffffff', '#d6e8fb']];
        for (let l = 0; l < 3; l++) {
          const yb = (off - H / 2) * (1 + l * 0.5) + H / 2;          // les couches proches défilent plus vite
          if (yb < -30 || yb > H + 30) continue;
          for (let i = 0; i < W / 20 + 4; i++) {
            const x = ((i * 20 + l * 9 + this.t * (3 + l * 3)) % (W + 80)) - 50;
            K.cloud(x, yb + K.hash(i, l + 40) * 12 - 6 + (l - 1) * 7, 30 + K.hash(i, l + 50) * 16, cols[l][0], cols[l][1]);
          }
        }
        const haze = Math.sin(p * Math.PI) * 0.3;
        if (haze > 0.01) { c.fillStyle = `rgba(232,243,255,${haze})`; c.fillRect(0, 0, W, H); }
        return { ...along, fly: true };
      }

      // Renaissance : boule de flammes, éclair blanc-bleu, puis le nouveau décor
      case 'rebirth': {
        c.drawImage(p < 0.5 ? bufA : bufB, 0, 0);
        nix.rebirth = p < 0.5 ? easeOutCubic(range(p, 0.04, 0.42)) : 1 - range(p, 0.54, 0.94);
        this.flash = p < 0.34 ? 0 : p < 0.5 ? (p - 0.34) / 0.16 : Math.max(0, 1 - (p - 0.5) / 0.32);
        return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) };
      }

      // Fondu simple (mouvement réduit)
      default: {
        c.drawImage(bufA, 0, 0);
        c.globalAlpha = p; c.drawImage(bufB, 0, 0); c.globalAlpha = 1;
        return p < 0.5 ? { x: a.x, y: a.y, direct: true } : { x: b.x, y: b.y, direct: true };
      }
    }
  },
};
