// Mode CV rapide : même contenu que le jeu, en HTML sémantique classique.
// Fonction pure (aucun accès au DOM) : elle sert aussi à générer la version
// statique de index.html (tools/build-static.mjs) pour le SEO et le mode sans JS.

import { UI, PROFILE, CONTACT, EDUCATION, SKILLS, PROJECTS, CERTS, JOBS, ZONES, L } from './i18n.js';

export const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

export function quickHTML(lang) {
  const t = v => esc(L(v, lang));
  const u = k => t(UI[k]);
  const tags = list => `<ul class="tags">${list.map(x => `<li>${t(x)}</li>`).join('')}</ul>`;

  const card = p => `
        <article class="card">
          <header class="card-head">
            <h4>${t(p.name)}</h4>
            ${p.url
    ? `<a class="card-link" href="${esc(p.url)}" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>`
    : `<span class="chip">${u('school')}</span>`}
          </header>
          <p>${t(p.desc)}</p>
          ${tags(p.tags)}
        </article>`;

  const groups = ZONES.filter(z => z.kind === 'projects').map(z => {
    const ps = PROJECTS.filter(p => p.zone === z.id);
    return ps.length ? `
      <h3 class="${z.id === 'cpp' ? 'star' : ''}">${t(z.group || z.name)}</h3>
      <div class="cards">${ps.map(card).join('')}
      </div>` : '';
  }).join('');

  return `
    <header class="q-hero">
      <img class="q-avatar" src="assets/phoenix.png" width="96" height="96" alt="${lang === 'fr' ? 'Nix, un phénix bleu en pixel art' : 'Nix, a blue pixel-art phoenix'}">
      <p class="q-pre">// ${esc(PROFILE.handle)}</p>
      <h1>${esc(PROFILE.name)}</h1>
      <p class="q-role">${t(PROFILE.klass)} <span aria-hidden="true">·</span> ${esc(PROFILE.base)}</p>
      <p class="q-quest">${t(PROFILE.quest)}</p>
      <p class="q-motto">${t(PROFILE.motto)}</p>
      <p class="q-cta">
        <a class="btn btn-main" href="${esc(CONTACT.github)}" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>
        <a class="btn" href="mailto:${esc(CONTACT.email)}">${u('email')}</a>
        <a class="btn" href="${esc(CONTACT.cv)}">${u('cv')}</a>
      </p>
    </header>

    <section id="q-about">
      <h2>${u('qAbout')}</h2>
      <p>${t(PROFILE.summary)}</p>
      <dl class="q-langs">
        <dt>${u('langs')}</dt>
        <dd>${PROFILE.languages.map(l => `${t(l.name)} <span class="stars">${t(l.stars)}</span>`).join(' <span aria-hidden="true">·</span> ')}</dd>
      </dl>
    </section>

    <section id="q-projects">
      <h2>${u('qProjects')}</h2>${groups}
    </section>

    <section id="q-skills">
      <h2>${u('qSkills')}</h2>
      <div class="q-skills">${SKILLS.map(b => `
        <div class="q-branch${b.main ? ' main' : ''}">
          <h3>${t(b.name)}</h3>
          ${tags(b.nodes)}
        </div>`).join('')}
      </div>
    </section>

    <section id="q-certs">
      <h2>${u('qCerts')}</h2>
      <div class="cards">${CERTS.map(c => `
        <article class="card">
          <header class="card-head"><h4>${t(c.name)}</h4><span class="chip">${t(c.date)}</span></header>
          <p>${esc(c.issuer)}</p>
          ${tags(L(c.topics, lang))}
        </article>`).join('')}
      </div>
    </section>

    <section id="q-xp">
      <h2>${u('qXp')}</h2>${JOBS.map(j => `
      <article class="entry">
        <h3>${t(j.title)} — ${esc(j.company)}</h3>
        <p class="meta">${esc(j.place)} <span aria-hidden="true">·</span> ${t(j.dates)}</p>
        <ul>${L(j.bullets, lang).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="perk">${t(j.perk)}</p>
      </article>`).join('')}
    </section>

    <section id="q-edu">
      <h2>${u('qEdu')}</h2>${EDUCATION.map(e => `
      <article class="entry">
        <h3>${t(e.title)}</h3>
        <p class="meta">${esc(e.place)} <span aria-hidden="true">·</span> ${t(e.dates)}</p>
        <p>${t(e.note)}</p>
      </article>`).join('')}
    </section>

    <section id="q-contact">
      <h2>${u('qContact')}</h2>
      <ul class="q-contact">
        <li><a href="${esc(CONTACT.github)}" target="_blank" rel="noopener">github.com/Nix-Phoe <span aria-hidden="true">↗</span></a></li>
        <li><a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></li>
        <li><a href="${esc(CONTACT.cv)}">${u('cv')}</a></li>
      </ul>
    </section>

    <footer class="q-foot"><p>${u('qMade')} <span>Nix-Phoe</span></p></footer>
  `;
}
