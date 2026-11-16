// Boîte à outils de dessin pixel art : tout est dessiné en coordonnées entières
// sur un canvas basse résolution, agrandi ensuite sans lissage.

let c = null, W = 0, H = 0, ns = '';
export const M = 12;                     // marge des calques (pour la parallaxe)
const cache = new Map();

export function use(ctx, w, h, name = '') { c = ctx; W = w; H = h; ns = name; }
export function clearCache() { cache.clear(); }
export const ctx = () => c;

/** Pseudo-aléatoire déterministe 0..1 */
export function hash(i, s = 0) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function R(x, y, w, h, col) {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Calque statique mis en cache, décalé de `ox` px (parallaxe). */
export function layer(name, fn, ox = 0) {
  const key = ns + '|' + name + '|' + W + 'x' + H;
  let cv = cache.get(key);
  if (!cv) {
    cv = document.createElement('canvas');
    cv.width = W + 2 * M; cv.height = H;
    const prev = c;
    c = cv.getContext('2d');
    c.translate(M, 0);
    try { fn(); } finally { c = prev; }
    cache.set(key, cv);
  }
  c.drawImage(cv, Math.round(ox) - M, 0);
}

/** Dégradé vertical en bandes tramées (à utiliser dans un calque). */
export function bands(cols, y0, y1) {
  const n = cols.length, bh = (y1 - y0) / n;
  for (let i = 0; i < n; i++) R(-M, Math.round(y0 + i * bh), W + 2 * M, Math.ceil(bh) + 1, cols[i]);
  for (let i = 1; i < n; i++) {
    const yb = Math.round(y0 + i * bh);
    c.fillStyle = cols[i];
    for (let x = -M; x < W + M; x++) {
      if ((x & 3) === 0) c.fillRect(x, yb - 3, 1, 1);
      if ((x & 1) === 0) c.fillRect(x + 1, yb - 2, 1, 1);
      if ((x & 3) !== 2) c.fillRect(x, yb - 1, 1, 1);
    }
  }
}

export function disc(cx, cy, r, col) {
  cx = Math.round(cx); cy = Math.round(cy);
  c.fillStyle = col;
  for (let dy = -r; dy <= r; dy++) {
    const hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.4);
    c.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
  }
}

/** Cercle (ou arc a0..a1 en radians) d'un pixel d'épaisseur. */
export function ring(cx, cy, r, col, a0 = 0, a1 = Math.PI * 2) {
  if (r < 1) return;
  c.fillStyle = col;
  const n = Math.ceil(r * (a1 - a0) * 1.3);
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    c.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 1, 1);
  }
}

export function line(x0, y0, x1, y1, col) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  c.fillStyle = col;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (let k = 0; k < 2000; k++) {
    c.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

/** Halo lumineux additif. col = 'r,g,b' */
export function glow(x, y, r, col, a = 0.3) {
  c.save();
  c.globalCompositeOperation = 'lighter';
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${col},${a})`);
  g.addColorStop(1, `rgba(${col},0)`);
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
  c.restore();
}

/** Cône de lumière (projecteur) additif. */
export function beam(x, y, x1, y1, w0, w1, col, a = 0.12) {
  c.save();
  c.globalCompositeOperation = 'lighter';
  const g = c.createLinearGradient(x, y, x1, y1);
  g.addColorStop(0, `rgba(${col},${a})`);
  g.addColorStop(1, `rgba(${col},0)`);
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(x - w0, y); c.lineTo(x + w0, y); c.lineTo(x1 + w1, y1); c.lineTo(x1 - w1, y1);
  c.fill();
  c.restore();
}

export function stars(n, seed, yMax, t) {
  for (let i = 0; i < n; i++) {
    const x = Math.floor(hash(i, seed) * W), y = Math.floor(hash(i, seed + 1) * yMax);
    const tw = Math.sin(t * (0.6 + hash(i, seed + 2) * 2.2) + i * 1.3);
    if (tw < -0.55) continue;
    const big = hash(i, seed + 3) > 0.9;
    c.fillStyle = tw > 0.6 ? '#ffffff' : (i % 3 ? '#a8d0ff' : '#6aa2ff');
    c.fillRect(x, y, 1, 1);
    if (big && tw > 0.2) { c.fillRect(x - 1, y, 3, 1); c.fillRect(x, y - 1, 1, 3); }
  }
}

export function cloud(x, y, w, col, shade) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w);
  R(x, y, w, 4, col);
  R(x + w * 0.12, y - 2, w * 0.3, 2, col);
  R(x + w * 0.34, y - 5, w * 0.38, 5, col);
  R(x + w * 0.44, y - 7, w * 0.2, 2, col);
  R(x + w * 0.68, y - 3, w * 0.22, 3, col);
  if (shade) { R(x + 2, y + 3, w - 4, 1, shade); R(x + 1, y + 4, w - 2, 1, shade); }
}

function noise1(x, seed) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
}

/** Silhouette de relief (collines, dunes, montagnes), remplie jusqu'en bas. */
export function ridge(seed, base, amp, col, wl = 40, bottom = H) {
  c.fillStyle = col;
  for (let x = -M; x < W + M; x++) {
    const n = noise1(x / wl, seed) * 0.7 + noise1(x / (wl * 0.31), seed + 9) * 0.3;
    const y = Math.round(base - amp * n);
    c.fillRect(x, y, 1, bottom - y);
  }
}

export function ridgeY(seed, base, amp, wl, x) {
  const n = noise1(x / wl, seed) * 0.7 + noise1(x / (wl * 0.31), seed + 9) * 0.3;
  return Math.round(base - amp * n);
}

/** Particules flottantes sans état (braises, poussière, lucioles). */
export function motes(n, seed, t, x0, y0, w, h, col, speed = 0.1, up = true) {
  c.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const life = (t * speed * (0.5 + hash(i, seed + 3)) + hash(i, seed)) % 1;
    if (Math.sin(life * 40 + i) < -0.3) continue;
    const x = x0 + hash(i, seed + 1) * w + Math.sin(t * 0.8 + i * 2.1) * 3;
    const y = up ? y0 + h * (1 - life) : y0 + h * life;
    c.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
}

export function bricks(x, y, w, h, col, mortar, bw = 10, bh = 5) {
  R(x, y, w, h, col);
  c.fillStyle = mortar;
  for (let r = 0; r * bh < h; r++) {
    c.fillRect(Math.round(x), Math.round(y + r * bh), Math.round(w), 1);
    for (let bx = (r % 2) * (bw / 2); bx < w; bx += bw) c.fillRect(Math.round(x + bx), Math.round(y + r * bh), 1, Math.min(bh, h - r * bh));
  }
}

export function gear(cx, cy, r, teeth, ang, col, hub) {
  disc(cx, cy, r, col);
  for (let i = 0; i < teeth; i++) {
    const a = ang + i * Math.PI * 2 / teeth;
    R(cx + Math.cos(a) * (r + 1) - 1, cy + Math.sin(a) * (r + 1) - 1, 3, 3, col);
  }
  disc(cx, cy, Math.max(1, Math.round(r * 0.4)), hub);
}

/** Flammes bleues scintillantes (nid, feu de camp, bougies). */
export function fire(x, y, w, h, t, seed = 0, pal = ['#2f5fd0', '#3f7bff', '#6aa2ff', '#d6ecff']) {
  for (let i = 0; i < w; i++) {
    const n = 0.5 + 0.5 * Math.sin(t * 9 + i * 1.7 + seed) * Math.sin(t * 5.3 + i * 0.9 + seed * 2);
    const edge = 1 - Math.abs(i - (w - 1) / 2) / (w / 2 + 0.5);
    const fh = Math.max(1, Math.round(h * (0.25 + 0.75 * edge) * (0.5 + 0.5 * n)));
    R(x + i, y - fh, 1, fh, pal[0]);
    R(x + i, y - Math.round(fh * 0.72), 1, Math.round(fh * 0.72), pal[1]);
    R(x + i, y - Math.round(fh * 0.45), 1, Math.round(fh * 0.45), pal[2]);
    const core = Math.round(fh * 0.2);
    if (core) R(x + i, y - core, 1, core, pal[3]);
  }
}

// ---------- Mini police 3×5 pour les textes dans les décors ----------
const FONT = {
  A: '25755', B: '65656', C: '34443', D: '65556', E: '74647', F: '74644', G: '34553', H: '55755', I: '72227',
  J: '11152', K: '55655', L: '44447', M: '57755', N: '65555', O: '25552', P: '65644', Q: '25573', R: '65655',
  S: '34216', T: '72222', U: '55557', V: '55552', W: '55775', X: '55255', Y: '55222', Z: '71247',
  0: '75557', 1: '26227', 2: '61247', 3: '61216', 4: '55711', 5: '74616', 6: '34652', 7: '71222', 8: '25252', 9: '25316',
  ' ': '00000', '-': '00700', ':': '02020', '!': '22202', '+': '02720', '_': '00007', '.': '00002', '%': '51245',
  '/': '11244', '>': '42124', '<': '12421', '?': '61202', '=': '07070', '#': '57575',
};
export function text(str, x, y, col, sc = 1) {
  c.fillStyle = col;
  x = Math.round(x); y = Math.round(y);
  for (const ch of String(str).toUpperCase()) {
    const g = FONT[ch] || FONT['?'];
    for (let r = 0; r < 5; r++) {
      const bits = +g[r];
      for (let b = 0; b < 3; b++) if (bits & (4 >> b)) c.fillRect(x + b * sc, y + r * sc, sc, sc);
    }
    x += 4 * sc;
  }
}
export const textW = (str, sc = 1) => String(str).length * 4 * sc - sc;

/** Petit sprite défini par des lignes de caractères + palette. */
export function spr(rows, x, y, pal, flip = false) {
  x = Math.round(x); y = Math.round(y);
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let i = 0; i < row.length; i++) {
      const col = pal[row[i]];
      if (!col) continue;
      c.fillStyle = col;
      c.fillRect(flip ? x + row.length - 1 - i : x + i, y + r, 1, 1);
    }
  }
}
