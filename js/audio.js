// Sons 8-bit générés en WebAudio (aucun fichier). Coupé par défaut.

let ac = null, master = null, windGain = null;

const midi = n => 440 * Math.pow(2, (n - 69) / 12);

function ensure() {
  if (ac) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ac = new AC();
  master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);
  return true;
}

function tone(freq, dur, { type = 'square', vol = 0.08, when = 0, to = null } = {}) {
  const t0 = ac.currentTime + when;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function noiseBuffer(dur) {
  const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function noise(dur, { vol = 0.12, from = 400, to = 3000, q = 1.2 } = {}) {
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t0 = ac.currentTime;
  src.buffer = noiseBuffer(dur); f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(master); src.start();
}

/** Souffle continu (bruit filtré en boucle) dont le volume suit le scroll. */
function startWind() {
  const src = ac.createBufferSource(), f = ac.createBiquadFilter();
  src.buffer = noiseBuffer(2); src.loop = true;
  f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.7;
  windGain = ac.createGain(); windGain.gain.value = 0;
  src.connect(f); f.connect(windGain); windGain.connect(master);
  src.start();
}

export const audio = {
  on: false,
  suspended: false,

  /** Active/désactive le son (à appeler depuis un clic : exigence des navigateurs). */
  toggle(force) {
    const want = force === undefined ? !this.on : force;
    if (want && !ensure()) return false;
    this.on = want;
    if (want) { ac.resume(); this.select(); } else this.wind(0);
    return this.on;
  },
  /** Coupe tout quand l'onglet est caché ou dans la vue rapide. */
  suspend(b) { this.suspended = b; if (b) this.wind(0); },

  get live() { return this.on && !this.suspended; },
  blip() { if (this.live) tone(620 + Math.random() * 160, 0.035, { vol: 0.035 }); },
  select() { if (this.live) { tone(660, 0.05, { vol: 0.06 }); tone(990, 0.07, { vol: 0.06, when: 0.05 }); } },
  move() { if (this.live) tone(440, 0.04, { vol: 0.045 }); },
  flash() { if (this.live) { noise(0.5, { from: 4000, to: 500, vol: 0.1 }); tone(880, 0.4, { type: 'triangle', vol: 0.07, to: 1760 }); } },
  jingle() {
    if (!this.live) return;
    [72, 76, 79, 84, 79, 84, 88].forEach((n, i) => tone(midi(n), i === 6 ? 0.5 : 0.11, { vol: 0.07, when: i * 0.09 }));
    tone(midi(48), 0.9, { type: 'triangle', vol: 0.12, when: 0.54 });
  },
  /** Souffle pendant les transitions : v de 0 (silence) à 1. */
  wind(v) {
    if (!ac) return;
    if (!this.live) v = 0;
    if (v > 0 && !windGain) startWind();
    if (windGain) windGain.gain.setTargetAtTime(v * 0.1, ac.currentTime, 0.08);
  },
};
