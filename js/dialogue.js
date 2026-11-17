// Boîte de dialogue liée au scroll : chaque réplique est un « arrêt ».
// Quand le visiteur y arrive, elle s'écrit lettre par lettre ; s'il continue à
// scroller, elle se termine d'un coup et la suivante prend le relais.
// Pas de minuterie ici : update(dt) est appelé par la boucle principale.
// Le texte complet est annoncé une seule fois aux lecteurs d'écran (aria-live).

/** 'Du {C++} pur.' → { segs: [{t:'Du '},{t:'C++',kw:true},{t:' pur.'}], plain } */
export function parseLine(raw) {
  const segs = [];
  String(raw).split(/(\{[^}]*\})/).forEach(part => {
    if (!part) return;
    if (part[0] === '{') segs.push({ t: part.slice(1, -1), kw: true }); else segs.push({ t: part });
  });
  return { segs, plain: segs.map(s => s.t).join('') };
}

export class Dialogue {
  constructor(root, { onChar, onSpeak } = {}) {
    this.root = root;
    this.textEl = root.querySelector('.dlg-text');
    this.liveEl = root.querySelector('.dlg-live');
    this.arrow = root.querySelector('.dlg-arrow');
    this.onChar = onChar || (() => {});
    this.onSpeak = onSpeak || (() => {});
    this.speed = 25;                      // ms par caractère
    this.typing = false;
    this.parts = [];
    this.wait = 0;
    this.raw = null;
  }

  /** Affiche une réplique (ou rien si raw est null). instant = sans effet machine à écrire. */
  set(raw, { instant = false } = {}) {
    if (raw === this.raw) return;
    this.raw = raw;
    this.stop();
    this.textEl.textContent = '';
    this.arrow.classList.remove('on');
    if (raw === null) { this.parts = []; this.liveEl.textContent = ''; return; }
    const { segs, plain } = parseLine(raw);
    this.liveEl.textContent = plain;
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
    if (instant) { this.finish(); return; }
    this.typing = true; this.wait = 0;
    this.onSpeak(true);
  }

  update(dt) {
    if (!this.typing) return;
    this.wait -= dt * 1000;
    let n = 0;
    while (this.wait <= 0 && n++ < 6) {
      let p = this.parts[this.seg];
      while (p && p.i >= p.chars.length) p = this.parts[++this.seg];
      if (!p) { this.finish(); return; }
      const ch = p.chars[p.i++];
      p.shown.textContent += ch;
      p.ghost.textContent = p.chars.slice(p.i).join('');
      if (ch.trim()) this.onChar(ch);
      this.wait += this.speed + ('.!?…'.includes(ch) ? 150 : ',;:'.includes(ch) ? 70 : 0);
    }
  }

  /** Termine l'écriture en cours d'un coup. */
  finish() {
    this.stop();
    for (const p of this.parts) { p.shown.textContent = p.chars.join(''); p.ghost.textContent = ''; p.i = p.chars.length; }
    if (this.parts.length) this.arrow.classList.add('on');
  }

  stop() {
    if (this.typing) { this.typing = false; this.onSpeak(false); }
  }
}
