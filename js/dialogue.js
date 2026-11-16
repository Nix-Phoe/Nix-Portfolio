// Boîte de dialogue : effet machine à écrire, mots-clés surlignés, flèche ▼.
// Le texte complet est annoncé une seule fois aux lecteurs d'écran (aria-live).

const CUE = /^\[(\w+)\]/;

/** '[think]Du {C++} pur.' → { cue: 'think', segs: [{t:'Du '},{t:'C++',kw:true},{t:' pur.'}], plain } */
export function parseLine(raw) {
  let cue = null;
  const m = raw.match(CUE);
  if (m) { cue = m[1]; raw = raw.slice(m[0].length); }
  const segs = [];
  raw.split(/(\{[^}]*\})/).forEach(part => {
    if (!part) return;
    if (part[0] === '{') segs.push({ t: part.slice(1, -1), kw: true }); else segs.push({ t: part });
  });
  return { cue, segs, plain: segs.map(s => s.t).join('') };
}

export class Dialogue {
  constructor(root, { onChar, onSpeak } = {}) {
    this.root = root;
    this.textEl = root.querySelector('.dlg-text');
    this.liveEl = root.querySelector('.dlg-live');
    this.arrow = root.querySelector('.dlg-arrow');
    this.onChar = onChar || (() => {});
    this.onSpeak = onSpeak || (() => {});
    this.speed = 34;                      // ms par caractère
    this.typing = false;
    this.pending = null;
    this.timer = 0;
  }

  get open() { return !this.root.hidden; }
  show() { this.root.hidden = false; }
  hide() { this.cancel(); this.root.hidden = true; }

  /** Affiche une réplique. Promesse → true quand le joueur valide, false si annulée. */
  say(raw, { instant = false } = {}) {
    this.cancel();
    const { segs, plain } = parseLine(raw);
    this.show();
    this.textEl.textContent = '';
    this.liveEl.textContent = plain;
    this.arrow.classList.remove('on');
    // chaque segment a une partie visible et une partie « fantôme » qui réserve la place
    this.parts = segs.map(s => {
      const wrap = document.createElement('span');
      if (s.kw) wrap.className = 'kw';
      const shown = document.createElement('span'), ghost = document.createElement('span');
      ghost.className = 'ghost'; ghost.textContent = s.t;
      wrap.append(shown, ghost);
      this.textEl.append(wrap);
      return { shown, ghost, chars: Array.from(s.t), i: 0 };
    });
    this.seg = 0;
    return new Promise(res => {
      this.pending = res;
      if (instant) { this.finish(); return; }
      this.typing = true;
      this.onSpeak(true);
      this.tick();
    });
  }

  tick() {
    if (!this.typing) return;
    let p = this.parts[this.seg];
    while (p && p.i >= p.chars.length) p = this.parts[++this.seg];
    if (!p) { this.finish(); return; }
    const ch = p.chars[p.i++];
    p.shown.textContent += ch;
    p.ghost.textContent = p.chars.slice(p.i).join('');
    if (ch.trim()) this.onChar(ch);
    const pause = '.!?…'.includes(ch) ? 190 : ',;:'.includes(ch) ? 90 : 0;
    this.timer = setTimeout(() => this.tick(), this.speed + pause);
  }

  finish() {
    clearTimeout(this.timer);
    this.typing = false;
    this.onSpeak(false);
    for (const p of this.parts || []) { p.shown.textContent = p.chars.join(''); p.ghost.textContent = ''; }
    this.arrow.classList.add('on');
  }

  /** Entrée du joueur : accélère, puis passe à la suite. */
  advance() {
    if (!this.pending) return;
    if (this.typing) { this.finish(); return; }
    const res = this.pending; this.pending = null;
    this.arrow.classList.remove('on');
    res(true);
  }

  cancel() {
    clearTimeout(this.timer);
    if (this.typing) { this.typing = false; this.onSpeak(false); }
    if (this.pending) { const res = this.pending; this.pending = null; res(false); }
  }
}
