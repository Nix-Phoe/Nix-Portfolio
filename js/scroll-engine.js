// Moteur de scroll : sections épinglées, progression lissée, plages et easing.
//
// Le défilement reste natif (rien n'est détourné ni bloqué) : on lit scrollY une
// fois par frame, on l'interpole vers une valeur affichée (lerp ≈ 0,1 par frame),
// et toutes les scènes sont calculées à partir de cette valeur lissée. Tout est
// donc réversible : remonter rejoue les transitions à l'envers.

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
/** 0 → 1 pendant que v parcourt [a, b]. */
export const range = (v, a, b) => (b <= a ? (v >= b ? 1 : 0) : clamp((v - a) / (b - a)));
/** Même chose, adoucie (easeInOutCubic). */
export const ramp = (v, a, b) => easeInOutCubic(range(v, a, b));
/** Fenêtre : monte sur [a, b], reste à 1, redescend sur [c, d]. */
export const windowed = (v, a, b, c, d) => Math.min(ramp(v, a, b), 1 - ramp(v, c, d));

const SMOOTH = 0.1;          // part du chemin parcourue à chaque frame (à 60 fps)

export class ScrollEngine {
  /** sections : éléments <section class="zone"> dans l'ordre, chacun avec une .scene épinglée. */
  constructor(sections) {
    this.sections = sections.map(el => ({ el, scene: el.querySelector('.scene'), start: 0, end: 0 }));
    this.y = 0;               // position affichée (lissée), en px
    this.target = 0;          // position réelle
    this.vel = 0;             // vitesse lissée, en hauteurs d'écran par seconde (signée)
    this.dir = 1;             // dernier sens de défilement
    this.vh = 1;
    this.instant = false;     // mouvement réduit : pas de lissage
    this.stops = [];          // arrêts (px), triés
    this.view = { zone: 0, p: 0, trans: null };
    this.idle = 0;
    this.settling = false;
    this.lastTarget = 0;
    window.addEventListener('scroll', () => { this.idle = 0; }, { passive: true });
  }

  /** Recalcule les bornes des sections (au chargement et au redimensionnement). */
  measure() {
    const sy = window.scrollY;
    this.vh = this.sections[0].scene.offsetHeight || window.innerHeight || 1;
    for (const s of this.sections) {
      s.start = s.el.getBoundingClientRect().top + sy;
      s.end = s.start + s.el.offsetHeight - this.vh;
    }
    this.max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  /** Position de scroll (px) correspondant à la progression p de la zone i. */
  pos(i, p) { const s = this.sections[i]; return s.start + (s.end - s.start) * p; }
  /** Progression 0..1 de la zone i (0 avant, 1 après). */
  progress(i) { const s = this.sections[i]; return range(this.y, s.start, s.end); }
  /** Distance parcourue dans la zone i, en hauteurs d'écran (négative avant d'y entrer). */
  into(i) { return (this.y - this.sections[i].start) / this.vh; }

  setStops(list) { this.stops = list.map(([i, p]) => Math.round(this.pos(i, p))).sort((a, b) => a - b); }

  /** À appeler une fois par frame. */
  update(dt) {
    const t = window.scrollY;
    if (t !== this.lastTarget) { this.dir = t > this.lastTarget ? 1 : -1; this.lastTarget = t; }
    this.target = t;
    const prev = this.y;
    const k = this.instant ? 1 : 1 - Math.pow(1 - SMOOTH, dt * 60);
    this.y += (t - this.y) * k;
    if (Math.abs(t - this.y) < 0.05) this.y = t;
    const v = dt > 0 ? (this.y - prev) / dt / this.vh : 0;
    this.vel += (v - this.vel) * Math.min(1, dt * 10);
    if (Math.abs(this.vel) < 0.001) this.vel = 0;

    // zone courante ou transition entre deux zones
    const S = this.sections, view = this.view, y = this.y;
    let i = S.length - 1;
    while (i > 0 && y < S[i].start) i--;
    if (i < S.length - 1 && y > S[i].end) {
      view.zone = i; view.p = 1;
      view.trans = { from: i, to: i + 1, p: range(y, S[i].end, S[i + 1].start) };
    } else {
      view.zone = i; view.p = range(y, S[i].start, S[i].end); view.trans = null;
    }

    // se poser en douceur sur un arrêt tout proche, sans jamais tirer en arrière
    this.idle += dt;
    if (!this.instant && this.idle > 0.22 && !this.settling) {
      this.settling = true;
      const reach = this.vh * 0.08;
      const s = this.stops.find(p => (p - t) * this.dir > 2 && (p - t) * this.dir < reach);
      if (s !== undefined) window.scrollTo({ top: s, behavior: 'smooth' });
    }
    if (this.idle < 0.05) this.settling = false;
    return view;
  }

  scrollTo(px, smooth = true) {
    this.settling = true;
    window.scrollTo({ top: clamp(px, 0, this.max), behavior: smooth && !this.instant ? 'smooth' : 'auto' });
  }

  /** Arrêt suivant (dir = 1) ou précédent (dir = -1). */
  step(dir) {
    const t = this.target, e = 6;
    const s = dir > 0 ? this.stops.find(p => p > t + e) : [...this.stops].reverse().find(p => p < t - e);
    this.scrollTo(s === undefined ? (dir > 0 ? this.max : 0) : s);
  }
}
