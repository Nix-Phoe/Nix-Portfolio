// Sons 8-bit générés en WebAudio (aucun fichier). Désactivé par défaut.

let ac = null, master = null, musicGain = null;
let timer = null, step = 0, nextT = 0;

const midi = n => 440 * Math.pow(2, (n - 69) / 12);

function ensure() {
  if (ac) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ac = new AC();
  master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);
  musicGain = ac.createGain(); musicGain.gain.value = 0.35; musicGain.connect(master);
  return true;
}

function tone(freq, dur, { type = 'square', vol = 0.08, when = 0, to = null, out = master } = {}) {
  const t0 = ac.currentTime + when;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(out);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function noise(dur, { vol = 0.12, from = 400, to = 3000, q = 1.2 } = {}) {
  const n = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t0 = ac.currentTime;
  src.buffer = buf; f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f); f.connect(g); g.connect(master); src.start();
}

// Petite boucle chiptune : Am – F – C – G, arpège carré + basse triangle.
const PROG = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
const ARP = [0, 1, 2, 1, 0, 2, 1, 2];
const LEAD = [76, 0, 72, 0, 69, 0, 72, 74, 72, 0, 69, 0, 65, 0, 0, 0, 67, 0, 72, 0, 76, 0, 79, 0, 74, 0, 71, 0, 67, 0, 0, 0];
function schedule() {
  const sp = 0.17;
  while (nextT < ac.currentTime + 0.25) {
    const when = Math.max(0, nextT - ac.currentTime), bar = Math.floor(step / 8) % 4, n = step % 8;
    tone(midi(PROG[bar][ARP[n]] + 12), sp * 0.9, { vol: 0.035, when, out: musicGain });
    if (n % 4 === 0) tone(midi(PROG[bar][0] - 12), sp * 3.4, { type: 'triangle', vol: 0.11, when, out: musicGain });
    const lead = LEAD[step % 32];
    if (lead && Math.floor(step / 32) % 2 === 1) tone(midi(lead), sp * 1.6, { vol: 0.03, when, out: musicGain });
    nextT += sp; step++;
  }
}

export const audio = {
  on: false,
  music: true,

  /** Active/désactive le son (à appeler depuis un clic : exigence des navigateurs). */
  toggle(force) {
    const want = force === undefined ? !this.on : force;
    if (want && !ensure()) return false;
    this.on = want;
    if (want) { ac.resume(); this.select(); }
    this.syncMusic();
    return this.on;
  },
  setMusic(b) { this.music = b; this.syncMusic(); },
  syncMusic() {
    const play = this.on && this.music && !this.suspended;
    if (play && !timer) { nextT = ac.currentTime + 0.05; timer = setInterval(schedule, 80); }
    if (!play && timer) { clearInterval(timer); timer = null; }
  },
  /** Coupe la musique quand l'onglet est caché ou en mode CV. */
  suspend(b) { this.suspended = b; if (ac) this.syncMusic(); },

  blip() { if (this.on) tone(620 + Math.random() * 160, 0.035, { vol: 0.035 }); },
  select() { if (this.on) { tone(660, 0.05, { vol: 0.06 }); tone(990, 0.07, { vol: 0.06, when: 0.05 }); } },
  move() { if (this.on) tone(440, 0.04, { vol: 0.045 }); },
  whoosh() { if (this.on) noise(0.55, { from: 300, to: 3800 }); },
  drop() { if (this.on) tone(320, 0.3, { type: 'triangle', vol: 0.12, to: 90 }); },
  thud() { if (this.on) { tone(110, 0.22, { type: 'triangle', vol: 0.22, to: 40 }); noise(0.18, { from: 900, to: 120, vol: 0.14 }); } },
  flash() { if (this.on) { noise(0.5, { from: 4000, to: 500, vol: 0.1 }); tone(880, 0.4, { type: 'triangle', vol: 0.07, to: 1760 }); } },
  jingle() {
    if (!this.on) return;
    [72, 76, 79, 84, 79, 84, 88].forEach((n, i) => tone(midi(n), i === 6 ? 0.5 : 0.11, { vol: 0.07, when: i * 0.09 }));
    tone(midi(48), 0.9, { type: 'triangle', vol: 0.12, when: 0.54 });
  },
};

document.addEventListener('visibilitychange', () => audio.suspend(document.hidden || audio._quick));
