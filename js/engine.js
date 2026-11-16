// Moteur de scènes : canvas basse résolution (pixels nets), boucle requestAnimationFrame,
// parallaxe, et transitions animées entre deux décors.

import * as K from './scenes/kit.js';
import { DECORS } from './scenes/index.js';
import { Nix } from './phoenix.js';

const mk = () => document.createElement('canvas');
const bufA = mk(), bufB = mk(), tmp = mk();
let actx, bctx, tctx;

const DUR = { flight: 1.15, mosaic: 0.9, iris: 1.0, rebirth: 1.2, shake: 0.75, slide: 0.6, fade: 0.4 };
const easeIO = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const easeOut = p => 1 - Math.pow(1 - p, 3);

export const E = {
  canvas: null, ctx: null,
  W: 0, H: 0, gy: 0, css: 4,
  t: 0, px: 0, pointer: 0,
  decor: 'title', trans: null,
  nix: new Nix(),
  reduced: false, running: false, paused: false,
  flash: 0,
  onFx: () => {},            // 'whoosh' | 'thud' | 'flash' | 'shake'

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    actx = bufA.getContext('2d'); bctx = bufB.getContext('2d'); tctx = tmp.getContext('2d');
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setRM = () => { this.reduced = mq.matches; this.nix.low = mq.matches; };
    setRM();
    mq.addEventListener?.('change', setRM);
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') this.pointer = (e.clientX / window.innerWidth) * 2 - 1; });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.last = 0; });
    this.resize();
    const p = this.perch();
    this.nix.place(p.x, p.y);
  },

  resize() {
    // (un onglet masqué peut annoncer une taille nulle : on garde un minimum)
    const vw = Math.max(160, window.innerWidth), vh = Math.max(160, window.innerHeight), dpr = window.devicePixelRatio || 1;
    const s = Math.max(1, Math.min(Math.floor(vh / 180), Math.floor(vw / 180)));
    const dev = Math.max(1, Math.round(s * dpr));          // taille d'un pixel de jeu en pixels écran (entier)
    this.css = dev / dpr;
    const W = Math.ceil(vw / this.css), H = Math.ceil(vh / this.css);
    const ratioX = this.W ? this.nix.x / this.W : 0;
    this.W = W; this.H = H; this.gy = Math.round(H * 0.62);
    for (const cv of [this.canvas, bufA, bufB]) { cv.width = W; cv.height = H; }
    this.canvas.style.width = W * this.css + 'px';
    this.canvas.style.height = H * this.css + 'px';
    K.clearCache();
    if (!this.trans && !this.nix.tw && ratioX > 0 && ratioX < 1) { const p = this.perch(); this.nix.place(p.x, p.y); }
    if (!this.running) this.render(0);
  },

  state() {
    return { t: this.t, W: this.W, H: this.H, gy: this.gy, cx: this.W >> 1, px: this.px, low: this.reduced };
  },

  /** Position de repos de Nix dans le décor courant. */
  perch(name = this.decor) {
    const d = DECORS[name], s = this.state();
    if (d && d.perch) return d.perch(s);
    return this.W >= 250 ? { x: Math.round(this.W * 0.24), y: this.gy - 28 } : { x: this.W >> 1, y: this.gy - 34 };
  },

  drawDecor(ctx, name) {
    K.use(ctx, this.W, this.H, name);
    ctx.imageSmoothingEnabled = false;
    (DECORS[name] || DECORS.generic).draw(this.state());
  },

  start() {
    if (this.running) return;
    this.running = true; this.last = 0;
    const loop = now => {
      if (!this.running) return;
      requestAnimationFrame(loop);
      if (document.hidden || this.paused) { this.last = 0; return; }
      const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0.016;
      this.last = now;
      this.render(dt);
    };
    requestAnimationFrame(loop);
  },

  render(dt) {
    this.t += dt;
    const target = this.reduced ? 0 : this.pointer * 0.8 + Math.sin(this.t * 0.17) * 0.35;
    this.px += (target - this.px) * Math.min(1, dt * 3);
    const c = this.ctx;
    if (this.trans) this.stepTrans(dt); else this.drawDecor(c, this.decor);
    K.use(c, this.W, this.H, this.decor);
    this.nix.update(dt, this.t);
    this.nix.draw(c, this.t);
    const d = DECORS[this.decor];
    if (!this.trans && d && d.front) d.front(this.state());
    if (this.flash > 0.01) {
      c.fillStyle = `rgba(214,236,255,${Math.min(1, this.flash)})`;
      c.fillRect(0, 0, this.W, this.H);
    }
  },

  /** Passe au décor `name` avec la transition `type`. Promesse résolue à la fin. */
  transition(name, type = 'fade') {
    if (this.trans) this.finishTrans();
    if (this.reduced) type = 'fade';
    if (!DUR[type]) type = 'fade';
    this.drawDecor(actx, this.decor);                       // instantané de l'ancien décor
    return new Promise(res => {
      this.trans = { type, to: name, from: this.decor, t: 0, dur: DUR[type], res, sx: this.nix.x, sy: this.nix.y, hit: false, sw: false };
      this.nix.clearMood(); this.nix.sleeping = false;
      if (type !== 'fade') this.onFx(type === 'shake' ? 'drop' : 'whoosh');
    });
  },

  finishTrans() {
    const tr = this.trans;
    if (!tr) return;
    this.trans = null;
    this.decor = tr.to;
    this.flash = 0;
    this.nix.rebirth = 0;
    this.nix.visible = true;
    this.nix.flying = false;
    tr.res();
  },

  stepTrans(dt) {
    const tr = this.trans, c = this.ctx, W = this.W, H = this.H, nix = this.nix;
    tr.t += dt;
    const p = Math.min(1, tr.t / tr.dur);
    this.drawDecor(bctx, tr.to);                            // nouveau décor, animé
    c.imageSmoothingEnabled = false;

    switch (tr.type) {
      case 'slide': {
        const e = easeIO(p), off = Math.round(e * W);
        c.drawImage(bufA, -off, 0); c.drawImage(bufB, W - off, 0);
        break;
      }
      case 'mosaic': {
        const first = p < 0.5, q = first ? p * 2 : (1 - p) * 2;
        const b = 1 + Math.floor(easeIO(q) * 17);
        const sw = Math.max(1, Math.ceil(W / b)), sh = Math.max(1, Math.ceil(H / b));
        tmp.width = sw; tmp.height = sh;
        tctx.imageSmoothingEnabled = false;
        tctx.drawImage(first ? bufA : bufB, 0, 0, W, H, 0, 0, sw, sh);
        c.drawImage(tmp, 0, 0, sw, sh, 0, 0, sw * b, sh * b);
        break;
      }
      case 'iris': {
        const first = p < 0.5, q = first ? 1 - easeIO(p * 2) : easeIO((p - 0.5) * 2);
        c.drawImage(first ? bufA : bufB, 0, 0);
        const cx = Math.round(nix.x), cy = Math.round(nix.y);
        const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * q + 20 * (1 - q) * (first ? 1 : 0.6);
        c.fillStyle = '#04060f';
        for (let y = 0; y < H; y++) {
          const dy = y - cy, hw = Math.abs(dy) < R ? Math.floor(Math.sqrt(R * R - dy * dy)) : -1;
          if (hw < 0) { c.fillRect(0, y, W, 1); continue; }
          if (cx - hw > 0) c.fillRect(0, y, cx - hw, 1);
          if (cx + hw < W) c.fillRect(cx + hw, y, W - cx - hw, 1);
        }
        break;
      }
      case 'flight': {
        c.drawImage(bufA, 0, 0);
        const e0 = 0.2;
        nix.flying = true;
        if (p < e0) {
          const q = easeIO(p / e0);
          nix.face = -1;
          nix.x = tr.sx + (-34 - tr.sx) * q;
          nix.y = tr.sy + (H * 0.38 - tr.sy) * q;
        } else {
          const q = (p - e0) / (1 - e0), edge = -34 + q * (W + 80);
          nix.face = 1;
          nix.x = edge + 8;
          nix.y = H * 0.38 + Math.sin(q * Math.PI * 2) * 9;
          for (let y = 0; y < H; y += 2) {
            const wob = Math.sin(y * 0.21 + this.t * 14) * 4 + Math.sin(y * 0.07 - this.t * 9) * 5;
            const w = Math.round(edge - 6 + wob - Math.abs(y - nix.y) * 0.12);
            if (w <= 0) continue;
            const ww = Math.min(W, w);
            c.drawImage(bufB, 0, y, ww, 2, 0, y, ww, 2);
            if (w < W + 8) {
              c.fillStyle = '#2f5fd0'; c.fillRect(w, y, 5, 2);
              c.fillStyle = '#6aa2ff'; c.fillRect(w, y, 3, 2);
              c.fillStyle = '#d6ecff'; c.fillRect(w, y, 1, 2);
            }
          }
        }
        break;
      }
      case 'rebirth': {
        if (p < 0.45) { c.drawImage(bufA, 0, 0); nix.rebirth = easeOut(p / 0.45); }
        else {
          c.drawImage(bufB, 0, 0);
          if (!tr.sw) { tr.sw = true; this.onFx('flash'); nix.burst(26, 0); }
          nix.rebirth = Math.max(0, 1 - (p - 0.5) / 0.4);
        }
        this.flash = p < 0.36 ? 0 : p < 0.5 ? (p - 0.36) / 0.14 : Math.max(0, 1 - (p - 0.5) / 0.3);
        break;
      }
      case 'shake': {
        const q = Math.min(1, p / 0.4), y = Math.round((q * q - 1) * H);
        c.drawImage(bufA, 0, 0);
        c.drawImage(bufB, 0, y);
        c.fillStyle = '#04060f'; c.fillRect(0, y + H, W, 3);
        if (q >= 1 && !tr.hit) { tr.hit = true; this.onFx('shake'); }
        break;
      }
      default: {
        c.drawImage(bufA, 0, 0);
        c.globalAlpha = p; c.drawImage(bufB, 0, 0); c.globalAlpha = 1;
      }
    }
    if (p >= 1) this.finishTrans();
  },

  /** Nix rejoint son perchoir dans le décor courant. */
  arrive() {
    const p = this.perch(), nix = this.nix;
    nix.homeFace = this.W >= 250 ? 1 : -1;
    if (DECORS[this.decor]?.face) nix.homeFace = DECORS[this.decor].face;
    nix.visible = true;
    const off = nix.x < -20 || nix.x > this.W + 20;
    if (this.reduced && off) { nix.place(p.x, p.y); nix.face = nix.homeFace; return Promise.resolve(); }
    const d = Math.hypot(p.x - nix.x, p.y - nix.y);
    if (d < 2) { nix.face = nix.homeFace; return Promise.resolve(); }
    return nix.moveTo(p.x, p.y, off ? 0.7 : 0.35, off ? 10 : 0);
  },

  /** Nix quitte l'écran par la droite. */
  leave() {
    return this.nix.moveTo(this.W + 40, this.H * 0.2, 0.9, 12).then(() => { this.nix.visible = false; });
  },
};
