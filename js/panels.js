// Panneaux « menu de jeu » de chaque zone : le contenu réel, lisible et sélectionnable.
//
// Leur apparition est pilotée par le scroll, jamais par une animation déclenchée :
//   data-r="a,b,c,d"  → visible : entre sur [a, b], sort sur [c, d] (progression de la zone)
//   data-lit="a,b"    → s'allume sur [a, b] (branches de l'arbre de compétences)
//   data-swap="a,b"   → fond de .t-off vers .t-on sur [a, b] (trophées)
// main.js lit ces plages et n'écrit que `opacity` et `transform`.

import { UI, PROFILE, CONTACT, EDUCATION, SKILLS, DISTRICTS, CERTS, JOBS, L } from './content.js';
import { esc } from './quick.js';
import { badgeURL } from './pixels.js';

const t = v => esc(L(v));
const u = k => t(UI[k]);
const tags = list => `<ul class="tags">${list.map(x => `<li>${t(x)}</li>`).join('')}</ul>`;
const r = (...v) => v.map(x => +x.toFixed(4)).join(',');
const ext = (href, label, cls = '') =>
  `<a class="btn btn-link ${cls}" href="${esc(href)}" target="_blank" rel="noopener">[ ${label} <span aria-hidden="true">↗</span> ]</a>`;

// ───────── Écran titre ─────────
function title() {
  const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  return `
    <div class="title-ui" data-r="-1,-1,0.15,0.95">
      <h1 class="logo">NIX-PHOE</h1>
      <p class="title-sub">${u('subtitle')}</p>
      <div class="title-bottom">
        <p class="scroll-cue">${u('scrollStart')} <span aria-hidden="true">▼</span></p>
        <p class="title-hint">${u(touch ? 'hintTouch' : 'hint')}</p>
        <ul class="lang-menu" aria-label="Langue / Language">
          <li><button type="button" class="tm${L({ fr: ' sel', en: '' })}" data-act="fr" aria-pressed="${L({ fr: 'true', en: 'false' })}" lang="fr">FRANÇAIS</button></li>
          <li><button type="button" class="tm${L({ fr: '', en: ' sel' })}" data-act="en" aria-pressed="${L({ fr: 'false', en: 'true' })}" lang="en">ENGLISH</button></li>
        </ul>
      </div>
    </div>`;
}

// ───────── Zone 1 : fiche joueur + arbre de compétences ─────────
function nest() {
  const lit0 = 0.6, step = 0.062;
  return `
    <article class="panel win" data-r="0.05,0.12,0.46,0.525" aria-labelledby="h-status">
      <header class="win-head"><h2 id="h-status">${u('statusTitle')}</h2><span class="win-tag">${esc(PROFILE.handle)}</span></header>
      <div class="win-body">
        <div class="status-top">
          <img class="portrait" src="assets/phoenix.png" width="64" height="64" alt="">
          <div>
            <p class="status-name">${esc(PROFILE.name)}</p>
            <p class="status-motto">${t(PROFILE.motto)}</p>
          </div>
        </div>
        <dl class="stats">
          <dt>${u('klass')}</dt><dd>${t(PROFILE.klass)}</dd>
          <dt>${u('base')}</dt><dd>${esc(PROFILE.base)}</dd>
          <dt>${u('quest')}</dt><dd class="hl">${t(PROFILE.quest)}</dd>
          <dt>${u('langs')}</dt><dd><ul class="langs">${PROFILE.languages.map(l => `<li>${t(l.name)} <span class="stars">${t(l.stars)}</span></li>`).join('')}</ul></dd>
          <dt>${u('edu')}</dt><dd><ul class="edu">${EDUCATION.map(e => `<li><b>${t(e.title)}</b> — ${esc(e.place)}, ${t(e.dates)}${e.note ? ` · <em>${t(e.note)}</em>` : ''}</li>`).join('')}</ul></dd>
        </dl>
      </div>
    </article>

    <article class="panel win" data-r="0.52,0.59,0.955,0.985" aria-labelledby="h-skills">
      <header class="win-head"><h2 id="h-skills">${u('skillTitle')}</h2></header>
      <div class="win-body tree">${SKILLS.map((b, i) => `
        <section class="branch${b.main ? ' main' : ''}" data-lit="${r(lit0 + i * step, lit0 + i * step + 0.045)}">
          <h3><i class="gem" aria-hidden="true"></i>${t(b.name)}</h3>
          <ul>${b.nodes.map(n => `<li>${t(n)}</li>`).join('')}</ul>
        </section>`).join('')}
      </div>
    </article>`;
}

// ───────── Zone 2 : une carte d'objet par arrêt de la caméra ─────────
function projectCard(g) {
  const d = DISTRICTS.find(x => x.id === g.district), p = g.projects[0];
  const rr = r(g.in[0], g.in[1], g.out[0], g.out[1]);
  const links = x => `<p class="item-links">${x.live ? ext(x.live, u('tryIt'), 'btn-live') : ''}${x.url ? ext(x.url, u('viewGithub')) : ''}</p>`;

  if (g.compact) {
    return `
    <article class="panel win pcard compact" data-r="${rr}" data-stop="${g.id}" aria-labelledby="h-${g.id}">
      <header class="win-head"><h2 id="h-${g.id}">${t(d.name)}</h2><span class="win-tag">${g.projects.length} ${u('projectsCount')}</span></header>
      <ul class="win-body mini">${g.projects.map(x => `
        <li><a href="${esc(x.url)}" target="_blank" rel="noopener">
          <b>${t(x.name)}</b>
          <span>${t(x.pitch)}</span>
          <em>${x.tags.map(t).join(' · ')}</em>
          <i aria-hidden="true">↗</i>
        </a></li>`).join('')}
      </ul>
    </article>`;
  }

  if (g.featured) {
    return `
    <article class="panel win pcard featured" data-r="${rr}" data-stop="${g.id}" aria-labelledby="h-${g.id}">
      <header class="win-head"><h2><span aria-hidden="true">★</span> ${u('featured')}</h2><span class="win-tag">v${esc(p.version || '')}</span></header>
      <div class="win-body item">
        <h3 class="item-name" id="h-${g.id}">${t(p.name)}</h3>
        ${links(p)}
        <div class="pages">
          <div class="pg" data-r="${r(g.in[0], g.in[1], g.mid - 0.012, g.mid + 0.004)}">
            <p class="item-desc">${t(p.pitch)}</p>
            <h4>${u('aiTitle')}</h4>
            <ul class="bullets">${(p.ai || []).map(a => `<li><b>${t(a.name)}</b> : ${t(a.text)}</li>`).join('')}</ul>
            <p class="note">${t(p.aiNote)}</p>
          </div>
          <div class="pg" data-r="${r(g.mid - 0.004, g.mid + 0.012, g.out[0], g.out[1])}">
            <h4>${u('editorTitle')}</h4>
            <ul class="bullets">${(L(p.editor) || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            <h4>${u('techTitle')}</h4>
            ${tags(p.tags)}
          </div>
        </div>
      </div>
    </article>`;
  }

  return `
    <article class="panel win pcard" data-r="${rr}" data-stop="${g.id}" aria-labelledby="h-${g.id}">
      <header class="win-head"><h2>${t(d.name)}</h2><span class="win-tag">${g.index + 1}/${g.count}</span></header>
      <div class="win-body item">
        <h3 class="item-name" id="h-${g.id}">${t(p.name)}</h3>
        ${p.pitch ? `<p class="item-desc">${t(p.pitch)}</p>` : ''}
        ${p.parts ? `<ul class="bullets">${p.parts.map(a => `<li><b>${t(a.name)}</b> : ${t(a.text)}</li>`).join('')}</ul>` : ''}
        ${tags(p.tags)}
        ${p.url || p.live ? links(p) : `<p class="chip">${u('school')}</p>`}
      </div>
    </article>`;
}

function world(w) {
  return w.stops.map(projectCard).join('');
}

// ───────── Zone 3 : trophées + quête terminée ─────────
function summit() {
  const at = [0.115, 0.38];
  const j = JOBS[0];
  return `
    <article class="panel win" data-r="0.06,0.11,0.6,0.655" aria-labelledby="h-certs">
      <header class="win-head"><h2 id="h-certs">${u('achievements')}</h2><span class="win-tag">${CERTS.length}/${CERTS.length}</span></header>
      <div class="win-body trophies">${CERTS.map((c, i) => {
    const a = at[i] ?? at[at.length - 1];
    return `
        <section class="trophy" data-swap="${r(a, a + 0.05)}">
          <div class="t-off" aria-hidden="true">
            <img class="badge" src="${badgeURL('lock')}" width="64" height="64" alt="">
            <p>??? <span>${u('locked')}</span></p>
          </div>
          <div class="t-on">
            <div class="badge-wrap">
              <img class="badge" src="${badgeURL(c.badge || 'star')}" width="64" height="64" alt="">
              ${c.qubits ? '<i class="qubit q1" aria-hidden="true"></i><i class="qubit q2" aria-hidden="true"></i><i class="qubit q3" aria-hidden="true"></i>' : ''}
            </div>
            <div>
              <p class="cert-up">${u('unlocked')}</p>
              <h3>${t(c.name)}</h3>
              <p class="meta">${esc(c.issuer)} · ${t(c.date)}</p>
              ${tags(L(c.topics))}
            </div>
          </div>
        </section>`;
  }).join('')}
      </div>
    </article>

    <article class="panel win" data-r="0.635,0.7,0.955,0.985" aria-labelledby="h-job">
      <header class="win-head"><h2><span aria-hidden="true">✔</span> ${u('questDone')}</h2><span class="win-tag">${t(j.dates)}</span></header>
      <div class="win-body job">
        <h3 id="h-job">${t(j.title)}</h3>
        <p class="job-co">${esc(j.company)} <span class="meta">· ${esc(j.place)}</span></p>
        <ul class="bullets">${L(j.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="perk">${t(j.perk)}</p>
      </div>
    </article>`;
}

// ───────── Zone 4 : menu de sauvegarde (contact) ─────────
function save() {
  return `
    <article class="panel win" data-r="0.1,0.3,2,2" aria-labelledby="h-save">
      <header class="win-head"><h2 id="h-save">${u('saveTitle')}</h2></header>
      <ul class="win-body save-menu">
        <li><a href="${esc(CONTACT.github)}" target="_blank" rel="noopener"><b>${u('github')}</b><small>github.com/${esc(PROFILE.handle)} ↗</small></a></li>
        <li><a href="mailto:${esc(CONTACT.email)}"><b>${u('email')}</b><small>${esc(CONTACT.email)}</small></a></li>
        <li><a href="${esc(CONTACT.cv)}"><b>${u('cv')}</b><small>${esc(CONTACT.cv)}</small></a></li>
        <li><button type="button" data-act="top"><b>${u('toTop')}</b></button></li>
      </ul>
    </article>`;
}

const SCENES = { title, nest, world, summit, save };

/** HTML de la scène épinglée d'une zone. `w` = le monde construit par world.js. */
export function sceneHTML(zoneId, w) {
  return (SCENES[zoneId] || (() => ''))(w);
}
