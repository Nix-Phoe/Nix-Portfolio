// Nix le phénix bleu : sprite 48×48 dessiné en code + animations.
// La grille ci-dessous est la silhouette de l'avatar, 5 teintes de bleu.
// Les frames (battement d'ailes, bec, tête penchée, queue) sont générées
// à la volée par cisaillement de colonnes, puis mises en cache.

import * as K from './scenes/kit.js';

const BASE = [
  '................................................',
  '...54......................................55...',
  '...45......................................55...',
  '...554....................................554...',
  '.3.445....................................544...',
  '.4.3444..................5...............5433.54',
  '.34.3344................54..............5533..53',
  '.34312244............55532.3...........54332.543',
  '.234322244..........5433443...........54322.543.',
  '.1233212254........4433432..........55322114422.',
  '..2223111234......54323223.........54321113432.4',
  '3..1222111124....45321332.........44321112322..4',
  '244..122111124...553233323.......43221111321..43',
  '.3443111111123..54324323343......53211111125554.',
  '.2234321112123..3...2124322......53112111344332.',
  '..223333111224.......23432.......4211111233322..',
  '....22322112244......24422......53211112232.....',
  '..43..1111112243....335322.....44311111111..34..',
  '..344443111122234..43442321.444322111113444433..',
  '....32222111122233344532223454222111112222222...',
  '.....22111111112223555323333321111121111221.....',
  '.....44333311111115454432222111111112231........',
  '.....34432112211125343421111111122112233333.....',
  '......2211133211114333311111111111222.1222......',
  '.........332211211333321111111111122333.........',
  '.........331122111.322222111111222.2222.........',
  '............331111.222322111.1..223.............',
  '................1...22222211....................',
  '.....................12212212...................',
  '....................11121231111.................',
  '....................211112322112................',
  '....................1111.2322111333.............',
  '....................1111..32111111233...........',
  '.................3221.....321..1111234..........',
  '................32322......31...211.234.........',
  '...............431322.....33...1121..25.........',
  '...............3222.2..32431...11111..34........',
  '...............2121...323232...11121..33........',
  '......................2131.1..31.332..32........',
  '........................21....312432..32........',
  '...................3........232.4423.12.........',
  '.................44........3321.5323............',
  '.................53.....444221.44232............',
  '.................433...44322..44223.............',
  '..................24444321....5322..............',
  '...................22221....35321...............',
  '..........................34422.................',
  '...........................22...................',
];

export const PAL = {
  0: '#0f1a45', 1: '#2f5fd0', 2: '#3f7bff', 3: '#6aa2ff', 4: '#a8d0ff', 5: '#d6ecff',
  e: '#081033', w: '#ffffff',
};

const N = 48, OX = 6, OY = 10, FW = 60, FH = 62;
const CX = OX + 24, CY = OY + 24;       // centre du sprite dans une frame
const PIV_L = 17, PIV_R = 28, WING_Y = 27;
const frames = new Map();

/** Construit (ou récupère) une frame. k = angle d'aile, mouth/tilt/eye = 0|1, sway = -1..1 */
function frame(k, mouth, tilt, sway, eye) {
  const kq = Math.round(k / 0.07);
  const key = kq + '|' + mouth + tilt + eye + '|' + sway;
  let cv = frames.get(key);
  if (cv) return cv;
  k = kq * 0.07;

  const g = new Array(FW * FH).fill('');
  const put = (x, y, ch) => {
    const gx = x + OX, gy = y + OY;
    if (gx >= 0 && gy >= 0 && gx < FW && gy < FH) g[gy * FW + gx] = ch;
  };
  const headDx = y => (tilt ? Math.round((16 - y) * 0.2) : 0);
  const isHead = (x, y) => y <= 16 && x >= 15 && x <= 28;
  const isWing = (x, y) => y < WING_Y && (x < PIV_L || x > PIV_R);

  // 1) corps, tête, pattes, queue
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const ch = BASE[y][x];
    if (ch === '.' || isWing(x, y)) continue;
    if (mouth && x === 16 && y === 14) continue;            // bec ouvert : le crochet se relève
    let nx = x;
    if (isHead(x, y)) nx += headDx(y);
    else if (y >= 30 && (x >= 29 || y >= 40)) nx += Math.round(sway * Math.min(1, (y - 30) / 6));
    put(nx, y, ch);
  }
  // œil
  if (eye) { put(20 + headDx(11), 11, '1'); put(21 + headDx(11), 11, '1'); }
  else put(21 + headDx(11), 11, 'e');
  // mandibule inférieure quand il parle
  if (mouth) {
    put(19 + headDx(14), 14, '3'); put(18 + headDx(15), 15, '4');
    put(17 + headDx(15), 15, '4'); put(19 + headDx(15), 15, '2');
  }
  // 2) ailes : chaque colonne glisse verticalement selon sa distance à l'épaule
  const squeeze = 1 - 0.2 * Math.max(0, k);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const ch = BASE[y][x];
    if (ch === '.' || !isWing(x, y)) continue;
    const left = x < PIV_L, d = left ? PIV_L - x : x - PIV_R;
    const nd = Math.round(d * squeeze);
    put(left ? PIV_L - nd : PIV_R + nd, y + Math.round(k * d), ch);
  }
  // 3) contour sombre pour rester lisible sur tous les décors
  const out = g.slice();
  for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
    if (g[y * FW + x]) continue;
    if ((x > 0 && g[y * FW + x - 1]) || (x < FW - 1 && g[y * FW + x + 1]) ||
        (y > 0 && g[(y - 1) * FW + x]) || (y < FH - 1 && g[(y + 1) * FW + x])) out[y * FW + x] = '0';
  }
  cv = document.createElement('canvas');
  cv.width = FW; cv.height = FH;
  const c = cv.getContext('2d');
  for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
    const ch = out[y * FW + x];
    if (ch) { c.fillStyle = PAL[ch]; c.fillRect(x, y, 1, 1); }
  }
  frames.set(key, cv);
  return cv;
}

const ease = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const FLAME = ['#2f5fd0', '#3f7bff', '#6aa2ff', '#d6ecff'];

export class Nix {
  constructor() {
    this.x = 0; this.y = 0;
    this.face = 1;            // 1 = regarde vers la droite
    this.homeFace = 1;
    this.visible = true;
    this.sleeping = false;
    this.speaking = false;
    this.flying = false;
    this.rebirth = 0;         // 0 = normal, 1 = boule de flammes
    this.mood = null;         // 'excited' | 'think' | 'cool'
    this.moodT = 0;
    this.tw = null;
    this.parts = [];
    this.emberT = 0;
    this.low = false;         // mouvement réduit
  }

  place(x, y) { this._endTween(); this.x = x; this.y = y; }

  _endTween() {
    if (this.tw) { const r = this.tw.res; this.tw = null; this.flying = false; r(); }
  }

  /** Vole jusqu'à (x, y). Renvoie une promesse résolue à l'arrivée. */
  moveTo(x, y, dur = 0.6, arc = 0) {
    this._endTween();
    if (this.low) dur = Math.min(dur, 0.25);
    return new Promise(res => {
      this.tw = { x0: this.x, y0: this.y, x1: x, y1: y, t: 0, dur, arc, res };
      this.flying = Math.hypot(x - this.x, y - this.y) > 12;
      if (Math.abs(x - this.x) > 6) this.face = x > this.x ? 1 : -1;
    });
  }

  /** excited | think | cool (cool reste jusqu'à clearMood) */
  play(mood) { this.mood = mood; this.moodT = 0; }
  clearMood() { this.mood = null; }

  emit(x, y, vx, vy, life, kind = 0) {
    if (this.parts.length > 260) this.parts.shift();
    this.parts.push({ x, y, vx, vy, life, max: life, kind });
  }

  burst(n = 18, kind = 1) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 20 + Math.random() * 50;
      this.emit(this.x, this.y, Math.cos(a) * v, Math.sin(a) * v - 10, 0.5 + Math.random() * 0.6, kind);
    }
  }

  update(dt, t) {
    if (this.tw) {
      const w = this.tw;
      w.t += dt;
      const p = Math.min(1, w.t / w.dur), e = ease(p);
      this.x = w.x0 + (w.x1 - w.x0) * e;
      this.y = w.y0 + (w.y1 - w.y0) * e - Math.sin(p * Math.PI) * w.arc;
      if (p >= 1) { this.face = this.homeFace; this._endTween(); }
    }
    if (this.mood) {
      this.moodT += dt;
      if (this.mood === 'excited' && this.moodT > 1.1) this.mood = null;
      if (this.mood === 'think' && this.moodT > 1.6) this.mood = null;
    }
    const n = this.low ? 0.35 : 1;
    if (this.visible) {
      if (this.flying) {
        for (let i = 0; i < 3 * n; i++) {
          this.emit(this.x - this.face * (6 + Math.random() * 8), this.y + 6 + Math.random() * 12,
            -this.face * (20 + Math.random() * 40), (Math.random() - 0.5) * 20, 0.35 + Math.random() * 0.45);
        }
      } else if (!this.sleeping) {
        this.emberT -= dt;
        if (this.emberT <= 0) {
          this.emberT = 0.14 / n;
          this.emit(this.x + (Math.random() - 0.5) * 18, this.y + 14 + Math.random() * 8,
            (Math.random() - 0.5) * 6, -6 - Math.random() * 10, 0.7 + Math.random() * 0.5);
        }
      }
      if (this.mood === 'excited' && this.moodT < 0.7 && Math.random() < 0.6 * n) {
        const a = Math.random() * Math.PI * 2;
        this.emit(this.x + Math.cos(a) * 10, this.y + Math.sin(a) * 10, Math.cos(a) * 45, Math.sin(a) * 45 - 15, 0.5 + Math.random() * 0.4, 1);
      }
      if (this.rebirth > 0.05) {
        for (let i = 0; i < 4 * n; i++) {
          const a = Math.random() * Math.PI * 2, r = 4 + this.rebirth * 14;
          this.emit(this.x + Math.cos(a) * r, this.y + 2 + Math.sin(a) * r, Math.cos(a) * 12, -25 - Math.random() * 35, 0.3 + Math.random() * 0.5);
        }
      }
    }
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.life -= dt;
      if (p.life <= 0) { this.parts.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === 0) { p.vy -= 26 * dt; p.vx *= 0.97; } else p.vy += 60 * dt;
    }
  }

  draw(c, t) {
    // particules (derrière le sprite)
    for (const p of this.parts) {
      const r = p.life / p.max;
      if (p.kind === 0) {
        c.fillStyle = FLAME[Math.min(3, Math.floor(r * 4))];
        const s = r > 0.55 ? 2 : 1;
        c.fillRect(Math.round(p.x), Math.round(p.y), s, s);
      } else {
        c.fillStyle = (Math.floor(p.life * 20) & 1) ? '#ffffff' : '#00ffe0';
        const x = Math.round(p.x), y = Math.round(p.y);
        c.fillRect(x, y, 1, 1);
        if (r > 0.5) { c.fillRect(x - 1, y, 3, 1); c.fillRect(x, y - 1, 1, 3); }
      }
    }
    if (!this.visible) return;

    const x = Math.round(this.x);
    let y = Math.round(this.y);
    K.glow(x, y + 4, 34 + this.rebirth * 30, '63,123,255', 0.2 + this.rebirth * 0.4);

    // boule de flammes (rebirth)
    if (this.rebirth > 0.02) {
      const r = Math.round(5 + this.rebirth * 15 + Math.sin(t * 20) * 1.2);
      K.disc(x, y + 2, r, '#2f5fd0');
      K.disc(x, y + 2, Math.round(r * 0.76), '#3f7bff');
      K.disc(x, y + 3, Math.round(r * 0.52), '#6aa2ff');
      K.disc(x, y + 4, Math.round(r * 0.28), '#d6ecff');
      K.fire(x - r, y - Math.round(r * 0.3), r * 2 + 1, Math.round(r * 1.5), t * 1.4, 3);
    }
    if (this.rebirth > 0.6) return;
    if (this.rebirth > 0.3 && (Math.floor(t * 30) & 1)) return;

    // paramètres d'animation
    let k, mouth = 0, tilt = 0, eye = 0, sway = Math.round(Math.sin(t * 1.7));
    if (this.sleeping) { k = 0.77; eye = 1; sway = 0; y += Math.round(Math.sin(t * 1.5)); }
    else {
      if (this.flying) k = 0.14 + 0.42 * Math.sin(t * 16);
      else if (this.mood === 'excited') k = -0.21 + 0.09 * Math.sin(t * 30);
      else k = 0.15 + 0.19 * Math.sin(t * 3);
      if (this.low) { k = this.flying ? 0.14 : 0.1; sway = 0; }
      else y += Math.round(Math.sin(t * 2.4) * 2);
      if (this.mood === 'think') tilt = 1;
      if (this.mood === 'excited' && !this.low) y -= Math.round(Math.abs(Math.sin(this.moodT * Math.PI * 2.2)) * 8 * Math.max(0, 1 - this.moodT));
      if (this.speaking) mouth = Math.floor(t * 10) & 1;
      if ((t % 4.2) < 0.12) eye = 1;
    }
    const f = frame(k, mouth, tilt, sway, eye);

    c.save();
    c.translate(x, y);
    c.scale(-this.face, 1);                       // le sprite d'origine regarde à gauche
    c.drawImage(f, -CX, -CY);
    if (this.mood === 'cool') {                   // lunettes de soleil qui tombent
      const p = Math.min(1, this.moodT / 0.45);
      const b = p < 0.7 ? (p / 0.7) * (p / 0.7) : 1 - Math.sin((p - 0.7) / 0.3 * Math.PI) * 0.12;
      const gy = Math.round(-14 * (1 - b));
      const px = (lx, ly, w, h, col) => { c.fillStyle = col; c.fillRect(lx - 24, ly - 24 + gy, w, h); };
      px(17, 9, 8, 5, '#0f1a45');
      px(18, 10, 6, 3, '#05070f');
      px(24, 10, 4, 1, '#05070f');
      px(19, 10, 1, 1, '#ffffff');
      px(20, 11, 1, 1, '#6aa2ff');
    }
    c.restore();

    if (this.mood === 'think') {                  // bulle « ... »
      const bx = x + this.face * 9 - 7, by = y - 40;
      K.R(bx, by, 15, 9, '#0f1a45'); K.R(bx - 1, by + 1, 17, 7, '#0f1a45');
      K.R(bx + 1, by + 1, 13, 7, '#ffffff'); K.R(bx, by + 2, 15, 5, '#ffffff');
      K.R(bx + (this.face > 0 ? 2 : 10), by + 9, 3, 2, '#0f1a45'); K.R(bx + (this.face > 0 ? 3 : 11), by + 8, 1, 2, '#ffffff');
      const dots = 1 + (Math.floor(this.moodT * 5) % 3);
      for (let i = 0; i < dots; i++) K.R(bx + 3 + i * 4, by + 4, 2, 2, '#2f5fd0');
    }
    if (this.sleeping) {                          // Zzz
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.4 + i / 3) % 1;
        K.text('Z', x + 14 + ph * 12, y - 12 - ph * 18, ph < 0.75 ? '#a8d0ff' : '#3f7bff');
      }
    }
  }
}
