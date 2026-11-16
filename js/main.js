// Chef d'orchestre : états du jeu, entrées clavier/souris/tactile, carte, menu, mode CV.

import { E } from './engine.js';
import { Dialogue, parseLine } from './dialogue.js';
import { audio } from './audio.js';
import { UI, ZONES, PROJECTS, CERTS, L, lang, setLang, store } from './i18n.js';
import { renderPanel } from './panels.js';
import { quickHTML } from './quick.js';
import { iconURL, badgeURL } from './pixels.js';

const $ = id => document.getElementById(id);
const root = document.documentElement;
const LAST = ZONES.length - 1;

const S = {
  zone: 0, screen: 0,
  phase: 'title',          // title | trans | dialogue | panel | ending | end
  run: 0, skipRun: -1,
  lastTrans: '', subIdx: 0,
  quick: false, menu: false,
  best: +store.get('best', 0) || 0,
};

const dlg = new Dialogue($('dlg'), {
  onChar: () => { if ((dlg._n = (dlg._n || 0) + 1) % 2) audio.blip(); },
  onSpeak: b => { E.nix.speaking = b; },
});

// ───────────────────────── Écrans d'une zone ─────────────────────────
function screensOf(z) {
  const zone = ZONES[z], intro = L(zone.lines) || [];
  if (zone.kind === 'title') return [{ scene: 'title', lines: [], panel: null }];
  if (zone.kind === 'projects' || zone.kind === 'certs') {
    const items = zone.kind === 'projects' ? PROJECTS.filter(p => p.zone === zone.id) : CERTS;
    if (items.length) {
      return items.map((it, i) => ({
        scene: it.scene || 'generic',
        lines: [...(i === 0 ? intro : []), ...(L(it.lines) || [])],
        panel: { type: zone.kind === 'projects' ? 'project' : 'cert', data: it, zone, index: i, count: items.length },
      }));
    }
  }
  return [{ scene: zone.scene || 'generic', lines: intro, panel: { type: zone.kind, zone } }];
}

const SUB = ['slide', 'mosaic', 'iris', 'flight'];
function pickTransition(z, zoneChanged) {
  let type = z === 0 ? 'iris' : zoneChanged ? (ZONES[z].transition || 'mosaic') : SUB[S.subIdx++ % SUB.length];
  if (type === S.lastTrans) type = type === 'mosaic' ? 'slide' : 'mosaic';   // jamais deux fois la même de suite
  S.lastTrans = type;
  return type;
}

// ───────────────────────── Navigation ─────────────────────────
async function go(z, sc = 0, { instant = false, toPanel = false } = {}) {
  const run = ++S.run;
  const list = screensOf(z);
  sc = Math.max(0, Math.min(sc, list.length - 1));
  const screen = list[sc], zoneChanged = z !== S.zone;

  closePanel(); dlg.hide(); $('end').hidden = true; hideToast();
  E.nix.clearMood();
  S.zone = z; S.screen = sc; S.phase = 'trans';
  if (z > 0) { $('title').hidden = true; store.set('zone', z); if (z > S.best) { S.best = z; store.set('best', z); } }
  $('game').dataset.phase = z === 0 ? 'title' : 'play';
  updateMap();

  if (!E.nix.visible) { E.nix.place(-40, E.H * 0.3); E.nix.visible = true; }
  if (!instant && (zoneChanged || E.decor !== screen.scene)) {
    await E.transition(screen.scene, pickTransition(z, zoneChanged));
    if (run !== S.run) return;
  }
  if (z === 0) { enterTitle(); return; }
  if (zoneChanged && !instant) showBanner(z);
  await E.arrive();
  if (run !== S.run) return;

  if (!toPanel) {
    S.phase = 'dialogue';
    for (const raw of screen.lines) {
      const { cue } = parseLine(raw);
      E.nix.clearMood();
      if (cue) playCue(cue, screen);
      const ok = await dlg.say(raw);
      if (run !== S.run) return;
      if (!ok) { if (S.skipRun === run) break; return; }
    }
    E.nix.clearMood();
  }
  openPanel(screen);
}

function playCue(cue, screen) {
  if (cue === 'unlock') {
    E.nix.play('excited'); audio.jingle();
    if (screen.panel && screen.panel.type === 'cert') showToast(screen.panel.data);
  } else E.nix.play(cue);
}

function next() {
  if (S.phase !== 'panel') return;
  audio.select();
  if (S.screen + 1 < screensOf(S.zone).length) return go(S.zone, S.screen + 1);
  if (S.zone < LAST) return go(S.zone + 1, 0);
  return ending();
}
function prev() {
  if (S.phase !== 'panel') return;
  audio.move();
  if (S.screen > 0) return go(S.zone, S.screen - 1, { toPanel: true });
  if (S.zone > 1) return go(S.zone - 1, screensOf(S.zone - 1).length - 1, { toPanel: true });
}
function zoneStep(d) {
  if (S.phase === 'title') { if (d > 0) startGame(1); return; }
  const z = S.zone + d;
  if (z < 1 || z > LAST) return;
  audio.move();
  go(z, 0);
}
function skip() {
  if (S.phase !== 'dialogue') return;
  S.skipRun = S.run;
  dlg.cancel();
}

/** Action principale : Espace / Entrée / clic / tap. */
function primary() {
  if (S.menu) return;
  if (S.phase === 'title') startGame(savedZone() || 1);
  else if (S.phase === 'dialogue' || S.phase === 'ending') dlg.advance();
  else if (S.phase === 'panel') next();
}

// ───────────────────────── Écran titre ─────────────────────────
const savedZone = () => { const z = +store.get('zone', 0); return z >= 1 && z <= LAST ? z : 0; };

function renderTitle() {
  const z = savedZone();
  const zl = z ? `${L(UI.zone)} ${z} — ${L(ZONES[z].name)}` : '';
  $('title-sub').textContent = L(UI.subtitle);
  $('title-menu').innerHTML = (z
    ? `<li><button type="button" class="tm start" data-act="continue">${L(UI.cont)}<small>${zl}</small></button></li>
       <li><button type="button" class="tm" data-act="new">${L(UI.newGame)}</button></li>`
    : `<li><button type="button" class="tm start blink" data-act="new">${L(UI.pressStart)}</button></li>`)
    + `<li class="tm-lang">
         <button type="button" class="tm${lang === 'fr' ? ' sel' : ''}" data-act="fr" aria-pressed="${lang === 'fr'}">FRANÇAIS</button>
         <button type="button" class="tm${lang === 'en' ? ' sel' : ''}" data-act="en" aria-pressed="${lang === 'en'}">ENGLISH</button>
       </li>`;
}

function enterTitle() {
  S.phase = 'title';
  $('game').dataset.phase = 'title';
  renderTitle();
  $('title').hidden = false;
  const p = E.perch('title');
  E.nix.homeFace = -1;
  E.nix.moveTo(p.x, p.y, 0.5).then(() => { if (S.phase === 'title') { E.nix.sleeping = true; E.nix.face = -1; } });
}

function startGame(z) {
  if (S.phase !== 'title') return;
  audio.select();
  E.nix.sleeping = false;
  go(z, 0);
}

// ───────────────────────── Fin ─────────────────────────
async function ending() {
  const run = ++S.run;
  closePanel();
  S.phase = 'ending';
  E.nix.clearMood();
  const ok = await dlg.say(L(ZONES[LAST].outro));
  if (run !== S.run || !ok) return;
  dlg.hide();
  await E.leave();
  if (run !== S.run) return;
  S.phase = 'end';
  $('end').hidden = false;
  $('end-replay').focus({ preventScroll: true });
}

// ───────────────────────── Panneau d'info ─────────────────────────
function openPanel(screen) {
  S.phase = 'panel';
  dlg.hide();
  if (!screen.panel) return;
  const p = renderPanel(screen.panel), el = $('panel');
  $('panel-title').textContent = p.title;
  $('panel-count').textContent = p.count;
  $('panel-body').innerHTML = p.html;
  $('panel-body').scrollTop = 0;
  $('panel-next-label').textContent = p.nextLabel;
  $('panel-prev').disabled = S.zone === 1 && S.screen === 0;
  el.dataset.type = screen.panel.type;
  el.hidden = false;
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  $('panel-next').focus({ preventScroll: true });
}
function closePanel() { $('panel').hidden = true; }

// ───────────────────────── Bandeau de zone, succès ─────────────────────────
function showBanner(z) {
  const el = $('banner');
  el.textContent = `${L(UI.zone)} ${z} — ${L(ZONES[z].name)}`.toLocaleUpperCase(lang);
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}
let toastT = 0;
function showToast(cert) {
  const el = $('toast');
  el.innerHTML = `<img src="${badgeURL(cert.badge || 'star')}" width="48" height="48" alt=""><p><b>${L(UI.unlocked)}</b><span></span></p>`;
  el.querySelector('span').textContent = L(cert.name);
  el.hidden = false;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(hideToast, 3600);
}
function hideToast() { clearTimeout(toastT); $('toast').hidden = true; }

// ───────────────────────── Carte du monde ─────────────────────────
function buildMap() {
  $('map-list').innerHTML = ZONES.map((z, i) =>
    `<li><button type="button" class="node" data-z="${i}"><img src="${iconURL(z.id)}" width="14" height="14" alt=""></button></li>`).join('');
}
function updateMap() {
  $('map-list').querySelectorAll('.node').forEach((b, i) => {
    const label = i === 0 ? L(ZONES[0].name) : `${L(UI.zone)} ${i} — ${L(ZONES[i].name)}`;
    b.setAttribute('aria-label', label); b.title = label;
    b.classList.toggle('cur', i === S.zone);
    b.classList.toggle('seen', i <= S.best);
    if (i === S.zone) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
}

// ───────────────────────── Langue, son, menu, mode CV ─────────────────────────
function applyLang() {
  root.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = L(UI[el.dataset.i18n]); });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', L(UI[el.dataset.i18nLabel])); });
  $('hint').textContent = L(window.matchMedia('(pointer: coarse)').matches ? UI.hintTouch : UI.hint);
  $('menu-lang').textContent = lang === 'fr' ? 'FRANÇAIS' : 'ENGLISH';
  $('q-lang').textContent = lang === 'fr' ? 'EN' : 'FR';
  $('q-lang').setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
  $('quick-content').innerHTML = quickHTML(lang);
  updateSoundUI();
  updateMap();
}

function setLanguage(l) {
  if (l === lang) return;
  setLang(l);
  applyLang();
  audio.select();
  if (S.phase === 'title') renderTitle();
  else if (S.phase === 'panel') openPanel(screensOf(S.zone)[S.screen]);
  else if (S.phase === 'dialogue') go(S.zone, S.screen, { instant: true });
  else if (S.phase === 'ending') ending();
}

function updateSoundUI() {
  $('btn-sound').textContent = audio.on ? '🔊' : '🔇';
  $('btn-sound').setAttribute('aria-pressed', String(audio.on));
  $('btn-sound').setAttribute('aria-label', `${L(UI.sound)} : ${L(audio.on ? UI.on : UI.off)}`);
  $('menu-sound').textContent = L(audio.on ? UI.on : UI.off);
  $('menu-music').textContent = L(audio.music ? UI.on : UI.off);
}
function toggleSound() { audio.toggle(); updateSoundUI(); }

let menuReturn = null;
function setMenu(open) {
  if (S.quick) return;
  S.menu = open;
  $('menu').hidden = !open;
  E.paused = open;
  if (open) { menuReturn = document.activeElement; audio.move(); $('menu').querySelector('button').focus(); }
  else if (menuReturn && menuReturn.focus) menuReturn.focus({ preventScroll: true });
}

function setQuick(on) {
  S.quick = on;
  if (on && S.menu) { S.menu = false; $('menu').hidden = true; }
  root.classList.toggle('game', !on);
  E.paused = on;
  audio._quick = on; audio.suspend(on || document.hidden);
  try { history.replaceState(null, '', on ? '#cv' : location.pathname + location.search); } catch { /* file:// */ }
  if (on) { window.scrollTo(0, 0); $('q-play').focus({ preventScroll: true }); }
  else { E.resize(); $('btn-quick').focus({ preventScroll: true }); }
}

// ───────────────────────── Entrées ─────────────────────────
function moveFocus(dir) {
  const box = S.menu ? $('menu') : S.phase === 'title' ? $('title') : S.phase === 'panel' ? $('panel') : S.phase === 'end' ? $('end') : null;
  if (!box) return false;
  const items = [...box.querySelectorAll('button:not([disabled]), a[href]')].filter(el => el.offsetParent !== null);
  if (!items.length) return false;
  const i = items.indexOf(document.activeElement);
  items[(i + dir + items.length) % items.length].focus();
  audio.move();
  return true;
}

document.addEventListener('keydown', e => {
  if (S.quick || e.ctrlKey || e.metaKey || e.altKey) return;
  const onControl = e.target instanceof Element && e.target.closest('button, a, input, select, textarea');
  switch (e.key) {
    case 'Escape': e.preventDefault(); setMenu(!S.menu); break;
    case ' ': case 'Enter': if (!onControl) { e.preventDefault(); primary(); } break;
    case 'ArrowRight': if (!S.menu) { e.preventDefault(); zoneStep(1); } break;
    case 'ArrowLeft': if (!S.menu) { e.preventDefault(); zoneStep(-1); } break;
    case 'ArrowDown': if (moveFocus(1)) e.preventDefault(); break;
    case 'ArrowUp': if (moveFocus(-1)) e.preventDefault(); break;
  }
});

// clic / tap sur la scène ou la boîte de dialogue = avancer
$('game').addEventListener('click', e => {
  if (e.target.closest('button, a')) return;
  if (e.target.closest('#stage, #dlg, #banner, #title') && S.phase !== 'panel') primary();
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  switch (b.dataset.act) {
    case 'new': store.set('zone', 0); startGame(1); break;
    case 'continue': startGame(savedZone() || 1); break;
    case 'fr': case 'en': setLanguage(b.dataset.act); if (S.phase === 'title') $('title-menu').querySelector('.sel')?.focus(); break;
    case 'skip': skip(); break;
    case 'next': next(); break;
    case 'prev': prev(); break;
    case 'quick': setQuick(true); break;
    case 'play': setQuick(false); break;
    case 'sound': toggleSound(); break;
    case 'music': audio.setMusic(!audio.music); updateSoundUI(); break;
    case 'menu': setMenu(true); break;
    case 'resume': setMenu(false); break;
    case 'lang': setLanguage(lang === 'fr' ? 'en' : 'fr'); break;
    case 'menu-quick': setMenu(false); setQuick(true); break;
    case 'menu-title': menuReturn = null; setMenu(false); go(0, 0); break;
    case 'replay': go(1, 0); break;
    case 'back-save': go(LAST, 0, { toPanel: true }); break;
  }
});

$('map-list').addEventListener('click', e => {
  const b = e.target.closest('.node');
  if (!b) return;
  const z = +b.dataset.z;
  audio.select();
  if (z === 0) { if (S.phase !== 'title') go(0, 0); }
  else { E.nix.sleeping = false; go(z, 0); }
});

// ───────────────────────── Démarrage ─────────────────────────
E.onFx = name => {
  if (name === 'shake') {
    audio.thud();
    const st = $('stage');
    st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
  } else if (audio[name]) audio[name]();
};

E.init($('stage'));
E.nix.sleeping = true;
E.nix.face = -1;
buildMap();
applyLang();
renderTitle();
$('game').dataset.phase = 'title';
window.__nixReady = true;
root.classList.remove('boot');
root.classList.add('ready');
setQuick(/#cv\b/.test(location.hash));
if (!S.quick) $('title-menu').querySelector('.start')?.focus({ preventScroll: true });
E.start();
