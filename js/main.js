// Chef d'orchestre. Une seule boucle requestAnimationFrame :
//   1. le moteur de scroll lit scrollY et calcule la zone et sa progression (lissées) ;
//   2. la scène (canvas) dessine le décor, la transition éventuelle et Nix ;
//   3. les panneaux, la bannière, la carte et le dialogue suivent la même progression.
// Rien n'est déclenché « d'un coup » : tout se rejoue à l'envers si on remonte.

import { ScrollEngine, ramp } from './scroll-engine.js';
import { stage } from './stage.js';
import { buildWorld } from './world.js';
import { Dialogue } from './dialogue.js';
import { audio } from './audio.js';
import { UI, ZONES, TRANSITION_VH, LINES, DISTRICTS, PROJECTS, L, lang, setLang } from './content.js';
import { sceneHTML } from './panels.js';
import { quickHTML } from './quick.js';
import { iconURL } from './pixels.js';

const $ = id => document.getElementById(id);
const root = document.documentElement;
const world = buildWorld(DISTRICTS, PROJECTS);
const zoneEls = ZONES.map(z => $('z-' + z.id));
const ZI = Object.fromEntries(ZONES.map((z, i) => [z.id, i]));
const WORLD = ZI.world, LAST = ZONES.length - 1;

// longueur des sections (réglée dans content.js)
root.style.setProperty('--gap', TRANSITION_VH);
ZONES.forEach((z, i) => {
  zoneEls[i].style.setProperty('--len', z.len);
  if (z.side) zoneEls[i].dataset.side = z.side;
});

const engine = new ScrollEngine(zoneEls);
const dlgEl = $('dlg'), bannerEl = $('banner'), tabsEl = $('tabs'), pinEl = $('map-pin');
let blipN = 0;
const dlg = new Dialogue(dlgEl, {
  onChar: () => { if (blipN++ % 2 === 0) audio.blip(); },
  onSpeak: b => { stage.nix.speaking = b; },
});

// répliques par zone, avec leur point de départ résolu (0..1)
const lines = ZONES.map(z => LINES.filter(l => l.zone === z.id)
  .map(l => ({ ...l, at: z.id === 'world' ? world.resolve(l.at) : +l.at }))
  .sort((a, b) => a.at - b.at));

const S = {
  quick: false, gameY: 0,
  ranged: [], lit: [], swap: [], spots: [],
  line: undefined, typeFrom: 0, coolDone: false,
  dlgV: -1, bannerV: -1, bannerZ: -1, tabsV: -1, district: '', pinX: -1,
  cur: -1, best: 0, nodeX: [], tp: 0,
};

// ───────────────────────── Scènes (panneaux) ─────────────────────────
function renderScenes() {
  ZONES.forEach((z, i) => {
    const spots = z.id === 'world' ? world.stops.map(g => `<div class="spot" data-spot="${g.id}" aria-hidden="true"></div>`).join('') : '';
    zoneEls[i].querySelector('.scene').innerHTML = spots + sceneHTML(z.id, world);
    zoneEls[i].setAttribute('aria-label', i ? `${L(UI.zone)} ${i} — ${L(z.name)}` : L(z.name));
  });
  const pick = (attr, fn) => [...document.querySelectorAll(`#track [${attr}]`)].map(el => ({
    el, zi: ZI[el.closest('.zone').dataset.zone], r: el.getAttribute(attr).split(',').map(Number), v: -1, ...(fn ? fn(el) : null),
  }));
  S.ranged = pick('data-r');
  S.lit = pick('data-lit');
  S.swap = pick('data-swap', el => ({ on: el.querySelector('.t-on'), off: el.querySelector('.t-off') }));
  S.spots = [...document.querySelectorAll('.spot')].map(el => {
    const g = world.stops.find(s => s.id === el.dataset.spot), card = document.querySelector(`[data-stop="${g.id}"]`);
    // survol d'un bâtiment → sa carte s'ouvre
    el.addEventListener('mouseenter', () => { if (inWorld()) card.classList.add('peek'); });
    el.addEventListener('mouseleave', e => { if (!card.contains(e.relatedTarget)) card.classList.remove('peek'); });
    card.addEventListener('mouseleave', e => { if (e.relatedTarget !== el) card.classList.remove('peek'); });
    return { el, g, x: null };
  });
  sizeSpots();
}

/** Vrai quand le Monde des Projets est la zone épinglée (hors transition). */
const inWorld = () => engine.view.zone === WORLD && !engine.view.trans;

function sizeSpots() {
  const w = stage.W * stage.css;
  for (const s of S.spots) { s.el.style.width = (s.g.x1 - s.g.x0 + 1) * w + 'px'; s.x = null; }
}

/** Applique les plages data-r / data-lit / data-swap : uniquement opacity et transform. */
function updatePanels() {
  for (const it of S.ranged) {
    const p = engine.progress(it.zi), [a, b, c, d] = it.r;
    let v = Math.min(a < 0 ? 1 : ramp(p, a, b), c > 1 ? 1 : 1 - ramp(p, c, d));
    v = Math.round(v * 200) / 200;
    if (v === it.v) continue;
    it.v = v;
    const dir = c <= 1 && p > (b + c) / 2 ? -1 : 1;              // entre par le bas, sort par le haut
    it.el.style.opacity = v;
    it.el.style.transform = v >= 1 || stage.reduced ? 'none' : `translate3d(0,${((1 - v) * 24 * dir).toFixed(1)}px,0)`;
    it.el.classList.toggle('on', v > 0.5);
  }
  for (const it of S.lit) {
    const v = Math.round(ramp(engine.progress(it.zi), it.r[0], it.r[1]) * 100) / 100;
    if (v === it.v) continue;
    it.v = v;
    it.el.style.opacity = 0.2 + 0.8 * v;
  }
  for (const it of S.swap) {
    const v = Math.round(ramp(engine.progress(it.zi), it.r[0], it.r[1]) * 100) / 100;
    if (v === it.v) continue;
    it.v = v;
    it.on.style.opacity = v; it.off.style.opacity = 1 - v;
  }
  // zones survolables : elles suivent leur bâtiment (inactives hors de la zone 2)
  if (!inWorld()) document.querySelectorAll('.pcard.peek').forEach(c => c.classList.remove('peek'));
  const cam = world.cam(engine.progress(WORLD)), w = stage.W * stage.css;
  for (const s of S.spots) {
    const x = Math.round((s.g.x0 - cam) * w);
    if (x === s.x) continue;
    s.x = x;
    s.el.style.transform = `translate3d(${x}px,0,0)`;
  }
}

// ───────────────────────── Bannière de zone, onglets, carte ─────────────────────────
function updateBanner() {
  let zi = -1, v = 0;
  for (let i = 1; i <= LAST; i++) {
    const u = engine.into(i);
    if (u > -0.3 && u < 0.4) { zi = i; v = Math.min(ramp(u, -0.24, 0), 1 - ramp(u, 0.13, 0.3)); }
  }
  v = Math.round(v * 250) / 250;
  if (zi >= 0 && zi !== S.bannerZ) { S.bannerZ = zi; bannerEl.textContent = bannerText(zi); }
  if (v === S.bannerV) return;
  S.bannerV = v;
  bannerEl.style.transform = stage.reduced ? 'none' : `translate3d(0,${((v - 1) * 260).toFixed(1)}px,0)`;
  bannerEl.style.opacity = stage.reduced ? v : 1;
}
const bannerText = zi => `${L(UI.zone)} ${zi} — ${L(ZONES[zi].name)}`.toLocaleUpperCase(lang);

function updateTabs() {
  const p = engine.progress(WORLD);
  const v = Math.round(Math.min(ramp(engine.into(WORLD), -0.12, 0.08), 1 - ramp(p, 0.975, 1)) * 100) / 100;
  if (v !== S.tabsV) {
    S.tabsV = v;
    tabsEl.style.opacity = v;
    tabsEl.style.transform = v >= 1 || stage.reduced ? 'none' : `translate3d(0,${((v - 1) * 30).toFixed(1)}px,0)`;
    tabsEl.classList.toggle('on', v > 0.5);
  }
  const d = world.districtAt(p);
  if (d !== S.district) {
    S.district = d;
    tabsEl.querySelectorAll('.tab').forEach(b => {
      const on = b.dataset.district === d;
      b.classList.toggle('cur', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }
}

function buildMap() {
  $('map-list').innerHTML = ZONES.slice(1).map((z, i) =>
    `<li><button type="button" class="node" data-z="${i + 1}"><img src="${iconURL(z.id)}" width="14" height="14" alt=""></button></li>`).join('');
  $('tab-list').innerHTML = DISTRICTS.filter(d => world.stops.some(s => s.district === d.id)).map(d =>
    `<li><button type="button" class="tab" data-district="${d.id}">${d.tab}</button></li>`).join('');
}

function updateMap(view) {
  const cur = view.trans ? (view.trans.p < 0.5 ? view.trans.from : view.trans.to) : view.zone;
  if (cur !== S.cur) {
    S.cur = cur; S.best = Math.max(S.best, cur);
    $('game').dataset.zone = ZONES[cur].id;
    $('map-list').querySelectorAll('.node').forEach((b, i) => {
      b.classList.toggle('cur', i + 1 === cur);
      b.classList.toggle('seen', i + 1 <= S.best);
      if (i + 1 === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }
  // le marqueur avance d'une icône à la suivante au rythme du scroll
  const sec = engine.sections, y = engine.y, X = S.nodeX;
  if (!X.length) return;
  let x = X[0];
  for (let i = 1; i <= LAST; i++) {
    if (y < sec[i].start) break;
    x = i === LAST ? X[i - 1] : X[i - 1] + (X[i] - X[i - 1]) * Math.min(1, (y - sec[i].start) / (sec[i + 1].start - sec[i].start));
  }
  x = Math.round(x * 2) / 2;
  if (x !== S.pinX) { S.pinX = x; pinEl.style.transform = `translate3d(${x}px,0,0)`; }
}

// ───────────────────────── Dialogue lié au scroll ─────────────────────────
function updateDialogue(view) {
  let line = null, v = 0;
  if (!view.trans) {
    const zl = lines[view.zone], p = view.p, len = ZONES[view.zone].len;
    for (const l of zl) if (p >= l.at) line = l;
    if (line) {
      v = ramp((p - zl[0].at) * len, 0, 5);                              // apparaît sur 5 vh de scroll
      if (view.zone < LAST) v = Math.min(v, 1 - ramp(p, 1 - 5 / len, 1 - 0.5 / len));
    }
  }
  if (line !== S.line) {
    S.line = line;
    stage.nix.clearMood();
    if (!line) dlg.set(null);
    else {
      dlg.set(L(line), { instant: stage.reduced });
      S.typeFrom = engine.target;
      if (line.mood === 'excited') stage.nix.play('excited');
      if (line.mood === 'cool' && !S.coolDone) { S.coolDone = true; stage.nix.play('cool'); }     // une seule fois
      if (line.sfx === 'jingle' && engine.dir > 0) audio.jingle();
    }
  }
  // le visiteur continue à scroller : la réplique se termine d'un coup
  if (dlg.typing && Math.abs(engine.target - S.typeFrom) > engine.vh * 0.09) dlg.finish();

  v = Math.round(v * 200) / 200;
  if (v === S.dlgV) return;
  S.dlgV = v;
  dlgEl.style.opacity = v;
  dlgEl.style.transform = v >= 1 || stage.reduced ? 'none' : `translate3d(0,${((1 - v) * 18).toFixed(1)}px,0)`;
  dlgEl.classList.toggle('on', v > 0.5);
}

// ───────────────────────── Arrêts, mise en page ─────────────────────────
function stopList() {
  const list = [[0, 0]];
  ZONES.forEach((z, i) => {
    if (z.id === 'world') world.stops.forEach(g => g.rest.forEach(p => list.push([i, p])));
    else (z.stops || []).forEach(p => list.push([i, p]));
  });
  return list;
}

function layout() {
  if (S.quick) return;
  if (stage.resize()) sizeSpots();
  engine.measure();
  engine.setStops(stopList());
  S.nodeX = [...$('map-list').querySelectorAll('.node')].map(n => n.offsetLeft + n.offsetWidth / 2);
  S.pinX = -1;
}

const firstStop = zi => (zi === WORLD ? world.stops[0].rest[0] : (ZONES[zi].stops || [0])[0]);
const goZone = zi => engine.scrollTo(engine.pos(zi, firstStop(zi)));

// ───────────────────────── Langue, son, vue rapide ─────────────────────────
function applyLang() {
  root.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = L(UI[el.dataset.i18n]); });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', L(UI[el.dataset.i18nLabel])); });
  for (const id of ['btn-lang', 'q-lang']) {
    $(id).textContent = lang === 'fr' ? 'EN' : 'FR';
    $(id).setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
  }
  $('quick-content').innerHTML = quickHTML(lang);
  renderScenes();
  $('map-list').querySelectorAll('.node').forEach((b, i) => {
    const label = `${L(UI.zone)} ${i + 1} — ${L(ZONES[i + 1].name)}`;
    b.setAttribute('aria-label', label); b.title = label;
  });
  if (S.bannerZ > 0) bannerEl.textContent = bannerText(S.bannerZ);
  // la réplique en cours est réaffichée dans la nouvelle langue, sans machine à écrire
  if (S.line) { dlg.set(null); dlg.set(L(S.line), { instant: true }); }
  updateSoundUI();
}

function setLanguage(l) {
  if (l === lang) return;
  setLang(l);
  applyLang();
  audio.select();
}

function updateSoundUI() {
  const b = $('btn-sound');
  b.textContent = audio.on ? '🔊' : '🔇';
  b.setAttribute('aria-pressed', String(audio.on));
  b.setAttribute('aria-label', `${L(UI.sound)} : ${L(audio.on ? UI.on : UI.off)}`);
}

function setQuick(on) {
  if (!on === !S.quick && root.classList.contains('game') === !on) return;
  if (on) S.gameY = window.scrollY;
  S.quick = on;
  root.classList.toggle('game', !on);
  audio.suspend(on || document.hidden);
  try { history.replaceState(null, '', on ? '#cv' : location.pathname + location.search); } catch { /* file:// */ }
  if (on) { window.scrollTo(0, 0); $('q-play').focus({ preventScroll: true }); }
  else {
    layout();
    window.scrollTo(0, S.gameY);
    engine.y = S.gameY;                       // reprise là où on en était, sans rembobinage
    $('btn-quick').focus({ preventScroll: true });
  }
}

// ───────────────────────── Entrées ─────────────────────────
document.addEventListener('keydown', e => {
  if (S.quick || e.ctrlKey || e.metaKey || e.altKey) return;
  const onControl = e.target instanceof Element && e.target.closest('button, a, input, select, textarea');
  switch (e.key) {
    case 'ArrowDown': case 'PageDown': e.preventDefault(); engine.step(1); break;
    case 'ArrowUp': case 'PageUp': e.preventDefault(); engine.step(-1); break;
    case ' ':
      if (onControl) return;
      e.preventDefault();
      if (dlg.typing) dlg.finish(); else engine.step(e.shiftKey ? -1 : 1);
      break;
  }
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act], .node, .tab');
  if (!b) {                                   // clic sur la scène ou le dialogue : termine l'écriture en cours
    if (!S.quick && dlg.typing && !e.target.closest('a, button')) dlg.finish();
    return;
  }
  if (b.classList.contains('node')) { audio.select(); goZone(+b.dataset.z); return; }
  if (b.classList.contains('tab')) {
    const g = world.stops.find(s => s.district === b.dataset.district);
    audio.select();
    engine.scrollTo(engine.pos(WORLD, g.rest[0]));
    return;
  }
  switch (b.dataset.act) {
    case 'fr': case 'en':
      setLanguage(b.dataset.act);
      document.querySelector('.lang-menu .sel')?.focus({ preventScroll: true });
      break;
    case 'lang': setLanguage(lang === 'fr' ? 'en' : 'fr'); break;
    case 'quick': setQuick(true); break;
    case 'play': setQuick(false); break;
    case 'sound': audio.toggle(); updateSoundUI(); break;
    case 'top': engine.scrollTo(0); break;
  }
});

// Tab atteint chaque carte : le focus fait défiler jusqu'à l'arrêt correspondant
$('track').addEventListener('focusin', e => {
  const panel = e.target.closest('[data-r]'), zoneEl = e.target.closest('.zone');
  if (!panel || !zoneEl) return;
  const it = S.ranged.find(x => x.el === panel);
  if (!it || it.v > 0.9) return;
  const card = e.target.closest('[data-stop]'), [a, b, c] = it.r;
  const p = card ? world.stops.find(s => s.id === card.dataset.stop).rest[0] : a < 0 ? 0 : c > 1 ? Math.max(b, 0.45) : (b + c) / 2;
  engine.scrollTo(engine.pos(it.zi, p));
});

window.addEventListener('resize', layout);
document.addEventListener('visibilitychange', () => audio.suspend(document.hidden || S.quick));

const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
const setReduced = () => {
  stage.setReduced(mq.matches); engine.instant = mq.matches;
  S.ranged.forEach(it => { it.v = -1; }); S.bannerV = S.dlgV = S.tabsV = -1;
};
mq.addEventListener?.('change', setReduced);

// ───────────────────────── La boucle ─────────────────────────
let last = 0;
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden || S.quick) { last = 0; return; }      // rendu en pause quand on ne regarde pas
  const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
  last = now;

  const view = engine.update(dt), tr = view.trans, nix = stage.nix;
  stage.scroll = engine.y / stage.css;
  // les premiers pixels de scroll réveillent Nix ; il se rendort près du feu à la toute fin
  nix.sleeping = !tr && ((view.zone === 0 && engine.y < 2) || (view.zone === LAST && view.p > 0.94));
  stage.render(dt, view, engine.vel);

  updatePanels();
  updateBanner();
  updateTabs();
  updateMap(view);
  updateDialogue(view);
  dlg.update(dt);

  // souffle pendant les transitions, éclair de la renaissance
  audio.wind(tr ? Math.min(1, Math.abs(engine.vel) * 1.5) * Math.sin(tr.p * Math.PI) : 0);
  const tp = tr && ZONES[tr.to].enter === 'rebirth' ? tr.p : tr ? 0 : S.tp;
  if (S.tp < 0.5 && tp >= 0.5 && tr) audio.flash();
  S.tp = tr ? tp : (view.zone === LAST ? 1 : 0);
}

// ───────────────────────── Démarrage ─────────────────────────
S.quick = /#cv\b/.test(location.hash);
window.__nixReady = true;
root.classList.remove('boot');
root.classList.add('ready');
root.classList.toggle('game', !S.quick);

buildMap();
stage.init($('stage'), ZONES, world);
setReduced();
applyLang();
layout();
audio.suspend(S.quick);
if (document.fonts?.ready) document.fonts.ready.then(layout);
requestAnimationFrame(frame);
