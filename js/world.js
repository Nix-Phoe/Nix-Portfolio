// Le Monde des Projets : un grand panorama horizontal composé de « parcelles »
// (un décor par parcelle) rangées côte à côte, quartier après quartier.
// Le scroll vertical fait glisser la caméra : elle s'arrête devant chaque projet
// (sa carte s'ouvre), puis file vers le suivant.
//
// Tout est déduit de DISTRICTS et PROJECTS : ajouter un projet ajoute une parcelle.

import { lerp, range, easeInOutCubic } from './scroll-engine.js';

const TRAVEL = 0.6;          // durée d'un trajet entre deux arrêts (1 = arrêt standard)

export function buildWorld(districts, projects) {
  const plots = [], stops = [];
  for (const d of districts) {
    const list = projects.filter(p => p.district === d.id);
    if (!list.length) continue;
    const groups = d.compact
      ? [{ id: d.id, district: d.id, projects: list, scenes: [d.scene || 'generic'], weight: 1.5, compact: true }]
      : list.map(p => {
        const scenes = p.scenes || [p.scene || 'generic'];
        return { id: p.id, district: d.id, projects: [p], scenes, weight: p.featured ? 2.6 : 1 + 0.6 * (scenes.length - 1), featured: !!p.featured };
      });
    groups.forEach((g, i) => {
      g.x0 = plots.length;
      g.index = i; g.count = groups.length;
      g.scenes.forEach((scene, k) => plots.push({ scene, district: d.id, n: g.projects.length, gate: i === 0 && k === 0 }));
      g.x1 = plots.length - 1;
      stops.push(g);
    });
  }

  // ligne de temps : arrêt, trajet, arrêt, trajet…
  const total = stops.reduce((a, g) => a + g.weight, 0) + TRAVEL * (stops.length - 1);
  const segs = [];
  let u = 0;
  stops.forEach((g, i) => {
    g.p0 = u / total; u += g.weight; g.p1 = u / total;
    g.mid = (g.p0 + g.p1) / 2;
    segs.push({ p0: g.p0, p1: g.p1, x0: g.x0, x1: g.x1, dwell: true });
    if (i < stops.length - 1) { const a = u / total; u += TRAVEL; segs.push({ p0: a, p1: u / total, x0: g.x1, x1: stops[i + 1].x0 }); }
  });
  // plages d'apparition des cartes : [début, fin] de l'entrée et de la sortie
  stops.forEach((g, i) => {
    const prev = stops[i - 1], next = stops[i + 1];
    g.in = prev ? [lerp(prev.p1, g.p0, 0.5), g.p0] : [0.035, 0.056];
    g.out = next ? [g.p1, lerp(g.p1, next.p0, 0.5)] : [0.962, 0.988];
    // points où se poser (clavier, onglets) : deux pour le projet phare (deux pages)
    g.rest = g.featured ? [lerp(g.p0, g.p1, 0.25), lerp(g.p0, g.p1, 0.78)] : [g.mid];
  });

  /** Position de la caméra (en parcelles) pour la progression p de la zone. */
  function cam(p) {
    for (const s of segs) {
      if (p > s.p1) continue;
      const t = range(p, s.p0, s.p1);
      if (s.x0 === s.x1) return s.x0;
      return lerp(s.x0, s.x1, s.dwell ? easeInOutCubic(range(t, 0.12, 0.88)) : easeInOutCubic(t));
    }
    return segs[segs.length - 1].x1;
  }

  /** Quartier visible à la progression p. */
  function districtAt(p) {
    const x = Math.round(cam(p));
    return plots[Math.max(0, Math.min(plots.length - 1, x))].district;
  }

  /** Résout le champ `at` d'une réplique : nombre, id de quartier ou id de projet. */
  function resolve(at) {
    if (typeof at === 'number') return at;
    const first = stops.find(g => g.district === at);
    if (first) return lerp(first.in[0], first.in[1], 0.6);
    const g = stops.find(s => s.projects.some(p => p.id === at));
    return g ? g.mid : 0;
  }

  return { plots, stops, cam, districtAt, resolve };
}
