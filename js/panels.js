// Panneaux d'info (fenêtres « menu de jeu ») : le contenu réel, lisible, après les dialogues.

import { UI, PROFILE, CONTACT, EDUCATION, SKILLS, JOBS, L } from './i18n.js';
import { esc } from './quick.js';
import { badgeURL } from './pixels.js';

const t = v => esc(L(v));
const u = k => t(UI[k]);
const raw = k => L(UI[k]);          // texte brut (inséré via textContent)
const tags = list => `<ul class="tags">${list.map(x => `<li>${t(x)}</li>`).join('')}</ul>`;

const RENDER = {
  status: () => ({
    title: raw('statusTitle'),
    html: `
      <div class="status">
        <div class="status-top">
          <img class="portrait" src="assets/phoenix.png" width="64" height="64" alt="">
          <div>
            <p class="status-name">${esc(PROFILE.name)}</p>
            <p class="status-handle">@${esc(PROFILE.handle)}</p>
          </div>
        </div>
        <dl class="stats">
          <dt>${u('klass')}</dt><dd class="hl">${t(PROFILE.klass)}</dd>
          <dt>${u('guild')}</dt><dd>${t(PROFILE.guild)}</dd>
          <dt>${u('base')}</dt><dd>${esc(PROFILE.base)}</dd>
          <dt>${u('quest')}</dt><dd class="hl">${t(PROFILE.quest)}</dd>
          <dt>${u('langs')}</dt><dd><ul class="langs">${PROFILE.languages.map(l => `<li>${t(l.name)} <span class="stars">${t(l.stars)}</span></li>`).join('')}</ul></dd>
          <dt>${u('motto')}</dt><dd><em>${t(PROFILE.motto)}</em></dd>
        </dl>
      </div>`,
  }),

  education: () => ({
    title: raw('eduTitle'),
    html: `<ol class="quests">${EDUCATION.map(e => `
      <li class="quest">
        <p class="quest-status">${t(e.status)}</p>
        <h3>${t(e.title)}</h3>
        <p class="meta">${esc(e.place)} · ${t(e.dates)}</p>
        <p>${t(e.note)}</p>
      </li>`).join('')}</ol>`,
  }),

  skills: () => {
    let n = 0;
    return {
      title: raw('skillTitle'),
      html: `<div class="tree">${SKILLS.map((b, bi) => `
        <section class="branch${b.main ? ' main' : ''}" style="--d:${bi * 0.45}s">
          <h3><i class="gem" aria-hidden="true"></i>${t(b.name)}</h3>
          <ul>${b.nodes.map((nd, i) => `<li style="--d:${(bi * 0.45 + 0.15 + i * 0.07).toFixed(2)}s" data-n="${n++}">${t(nd)}</li>`).join('')}</ul>
        </section>`).join('')}</div>`,
    };
  },

  project: ({ data: p, zone }) => ({
    title: `${raw('item')} · ${L(zone.group || zone.name)}`,
    html: `
      <article class="item">
        <h3 class="item-name">${t(p.name)}</h3>
        <p class="item-desc">${t(p.desc)}</p>
        ${tags(p.tags)}
        ${p.url
    ? `<a class="btn btn-link" href="${esc(p.url)}" target="_blank" rel="noopener">[ ${u('viewGithub')} ↗ ]</a>`
    : `<p class="chip">${u('school')}</p>`}
      </article>`,
  }),

  cert: ({ data: c }) => ({
    title: raw('certTitle'),
    html: `
      <article class="cert">
        <img class="badge" src="${badgeURL(c.badge || 'star')}" width="96" height="96" alt="">
        <div>
          <p class="cert-up">${u('unlocked')}</p>
          <h3>${t(c.name)}</h3>
          <p class="meta">${esc(c.issuer)} · ${t(c.date)}</p>
          ${tags(L(c.topics))}
        </div>
      </article>`,
  }),

  jobs: () => ({
    title: raw('jobTitle'),
    html: JOBS.map(j => `
      <article class="job">
        <h3>${t(j.title)}</h3>
        <p class="job-co">${esc(j.company)}</p>
        <p class="meta">${esc(j.place)} · ${t(j.dates)}</p>
        <ul class="bullets">${L(j.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="perk"><span aria-hidden="true">✦</span> ${t(j.perk)}</p>
      </article>`).join(''),
  }),

  save: () => ({
    title: raw('saveTitle'),
    nextLabel: raw('finish'),
    html: `
      <ul class="save-menu">
        <li><a href="${esc(CONTACT.github)}" target="_blank" rel="noopener"><b>${u('github')}</b><small>github.com/Nix-Phoe ↗</small></a></li>
        <li><a href="mailto:${esc(CONTACT.email)}"><b>${u('email')}</b><small>${esc(CONTACT.email)}</small></a></li>
        <li><a href="${esc(CONTACT.cv)}"><b>${u('cv')}</b><small>PDF</small></a></li>
        <li><button type="button" data-act="replay"><b>${u('replay')}</b></button></li>
      </ul>`,
  }),
};

/** → { title, html, nextLabel, count } pour l'écran donné. */
export function renderPanel(spec) {
  const out = (RENDER[spec.type] || RENDER.status)(spec);
  return {
    title: out.title,
    html: out.html,
    nextLabel: out.nextLabel || raw('next'),
    count: spec.count > 1 ? `${spec.index + 1} / ${spec.count}` : '',
  };
}
