// ═══════════════════════════════════════════════════════════════════════════
//  TOUT LE CONTENU DU SITE EST ICI (répliques + panneaux), en français et anglais.
//
//  • Ajouter un projet  → ajoute un objet dans PROJECTS (modèle plus bas) : son
//    bâtiment apparaît tout seul dans le bon quartier du Monde des Projets.
//  • Ajouter une certif → ajoute un objet dans CERTS.
//  • Régler la longueur d'une zone → champ `len` de ZONES (en vh de scroll).
//  • Répliques de Nix   → LINES (12 au maximum, une ou deux lignes chacune).
//    {mot} = mot technique surligné.
// ═══════════════════════════════════════════════════════════════════════════

// ---------- Préférences (localStorage, toujours dans un try/catch) ----------
export const store = {
  get(k, d = null) { try { const v = localStorage.getItem('nix.' + k); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('nix.' + k, String(v)); } catch { /* stockage indisponible */ } },
};

export let lang = store.get('lang', 'fr') === 'en' ? 'en' : 'fr';
export function setLang(l) { lang = l === 'en' ? 'en' : 'fr'; store.set('lang', lang); }

/** Renvoie la version localisée d'une valeur { fr, en } (ou la valeur telle quelle). */
export function L(v, l = lang) {
  return v && typeof v === 'object' && !Array.isArray(v) && ('fr' in v || 'en' in v) ? (v[l] ?? v.fr) : v;
}

// ---------- Zones ----------
// len   : longueur de la zone, en vh de scroll (100 = une hauteur d'écran).
// enter : transition jouée en arrivant dans la zone, pilotée par le scroll
//         ('dither' | 'flight' | 'ascent' | 'rebirth').
// side  : côté des panneaux sur grand écran.
// stops : arrêts (progression 0..1) où le visiteur se pose : ↓ / Espace y mènent, et un
//         scroll qui s'arrête juste avant s'y cale en douceur. Dans le Monde des
//         Projets, les arrêts sont calculés : un par projet.
// Total visé : 1 400 à 1 600 vh (zones + 4 transitions de TRANSITION_VH + 1 écran).
export const TRANSITION_VH = 60;
export const ZONES = [
  { id: 'title', len: 40, scene: 'title', name: { fr: 'Écran titre', en: 'Title screen' } },
  { id: 'nest', len: 240, scene: 'nest', enter: 'dither', side: 'right', stops: [0.26, 0.9], name: { fr: 'Le Nid', en: 'The Nest' } },
  { id: 'world', len: 520, enter: 'flight', side: 'left', name: { fr: 'Le Monde des Projets', en: 'The Project World' } },
  { id: 'summit', len: 250, scene: 'temple', enter: 'ascent', side: 'left', stops: [0.22, 0.5, 0.85], name: { fr: 'Le Sommet', en: 'The Summit' } },
  { id: 'save', len: 110, scene: 'campfire', enter: 'rebirth', side: 'left', stops: [0.45, 1], name: { fr: 'Point de sauvegarde', en: 'Save Point' } },
];

// ---------- Les 12 répliques de Nix ----------
// zone : id de la zone.
// at   : moment où la réplique démarre — un nombre entre 0 et 1 (progression dans
//        la zone), ou, dans le Monde des Projets, l'id d'un quartier / d'un projet.
// mood : 'excited' (saut + étincelles) | 'cool' (lunettes, une seule fois).
// sfx  : 'jingle' (succès débloqué).
export const LINES = [
  { zone: 'nest', at: 0.04,
    fr: 'Yo, moi c’est {Nix}. Je renais de mes cendres, lui il renaît de ses bugs. Scrolle, je te fais la visite.',
    en: 'Yo, I’m {Nix}. I rise from ashes, he rises from bugs. Scroll, I’ll show you around.' },
  { zone: 'nest', at: 0.54,
    fr: '« Lui », c’est {Nick}. Sa branche maîtresse : le {C++}. Regarde l’arbre s’allumer.',
    en: '“He” is {Nick}. His main branch: {C++}. Watch the tree light up.' },

  { zone: 'world', at: 'star',
    fr: 'Le {Monde des Projets}. Quatre quartiers. On commence par le plus gros morceau.',
    en: 'The {Project World}. Four districts. We start with the big one.' },
  { zone: 'world', at: 'stickflow', mood: 'excited',
    fr: '{StickFlow} : de l’animation de stickman en {WebGL 2}. L’{IA} assiste, toi tu décides.',
    en: '{StickFlow}: stickman animation in {WebGL 2}. The {AI} assists, you decide.' },
  { zone: 'world', at: 'cpp', mood: 'cool',
    fr: 'Ici, c’est du {C++} pur. Pas de raccourcis, la mémoire se gère à la main.',
    en: 'Pure {C++} here. No shortcuts, memory managed by hand.' },
  { zone: 'world', at: 'data',
    fr: 'Le {Labo}. Des CSV sales entrent, des graphiques propres sortent. Merci {Python}.',
    en: 'The {Lab}. Dirty CSVs go in, clean charts come out. Thanks, {Python}.' },
  { zone: 'world', at: 'arcade',
    fr: 'L’{Arcade}. Zone détente… enfin, détente avec du {React} dedans.',
    en: 'The {Arcade}. Chill zone… well, chill with {React} in it.' },

  { zone: 'summit', at: 0.1, mood: 'excited', sfx: 'jingle',
    fr: 'Succès débloqué ☁️ {AWS Cloud Practitioner}. Il plane au-dessus des nuages. Comme moi.',
    en: 'Achievement unlocked ☁️ {AWS Cloud Practitioner}. He floats above the clouds. Like me.' },
  { zone: 'summit', at: 0.37, mood: 'excited', sfx: 'jingle',
    fr: '{Qiskit Global Summer School}. Du {quantique} : je suis impressionné et pas impressionné à la fois.',
    en: '{Qiskit Global Summer School}. {Quantum} stuff: I’m impressed and not impressed at the same time.' },
  { zone: 'summit', at: 0.66,
    fr: 'Quête terminée : l’usine. Une pièce hors spec ne sort pas. Depuis, il {teste} son code pareil.',
    en: 'Quest complete: the factory. No out-of-spec part ships. He {tests} his code the same way.' },

  { zone: 'save', at: 0.1,
    fr: 'Un feu de camp. Tu sais ce que ça veut dire : {point de sauvegarde}.',
    en: 'A campfire. You know what that means: {save point}.' },
  { zone: 'save', at: 0.72,
    fr: 'Fin du tuto. Le vrai jeu, c’est de l’embaucher : stage {C++}, {hiver 2027}. Moi, je dors. ✌',
    en: 'Tutorial over. The real game is hiring him: {C++} internship, {Winter 2027}. I’m off to sleep. ✌' },
];

// ---------- Textes d'interface ----------
export const UI = {
  subtitle: { fr: 'Portfolio — le tutoriel', en: 'Portfolio — the tutorial' },
  scrollStart: { fr: 'SCROLL TO START', en: 'SCROLL TO START' },
  hint: { fr: 'Molette, ↓ ou Espace', en: 'Wheel, ↓ or Space' },
  hintTouch: { fr: 'Glisse vers le haut', en: 'Swipe up' },
  quick: { fr: 'Vue rapide', en: 'Quick view' },
  play: { fr: 'Jouer le tutoriel', en: 'Play the tutorial' },
  sound: { fr: 'Son', en: 'Sound' },
  on: { fr: 'activé', en: 'on' },
  off: { fr: 'coupé', en: 'off' },
  zone: { fr: 'ZONE', en: 'ZONE' },
  map: { fr: 'Carte du monde', en: 'World map' },
  districts: { fr: 'Quartiers du Monde des Projets', en: 'Project World districts' },
  unlocked: { fr: 'SUCCÈS DÉBLOQUÉ !', en: 'ACHIEVEMENT UNLOCKED!' },
  locked: { fr: 'Succès verrouillé', en: 'Locked achievement' },
  achievements: { fr: 'SUCCÈS', en: 'ACHIEVEMENTS' },
  questDone: { fr: 'QUÊTE TERMINÉE', en: 'QUEST COMPLETE' },
  viewGithub: { fr: 'VOIR SUR GITHUB', en: 'VIEW ON GITHUB' },
  tryIt: { fr: 'ESSAYER', en: 'TRY IT' },
  featured: { fr: 'PROJET PHARE', en: 'FLAGSHIP PROJECT' },
  aiTitle: { fr: 'Fonctions IA', en: 'AI features' },
  editorTitle: { fr: 'Éditeur complet', en: 'Full editor' },
  techTitle: { fr: 'Technique', en: 'Under the hood' },
  school: { fr: 'Projets scolaires', en: 'School projects' },
  projectsCount: { fr: 'projets', en: 'projects' },
  saveTitle: { fr: 'SAUVEGARDER LA PARTIE ?', en: 'SAVE YOUR GAME?' },
  github: { fr: 'GitHub', en: 'GitHub' },
  email: { fr: 'Courriel', en: 'Email' },
  cv: { fr: 'Télécharger le CV', en: 'Download résumé' },
  toTop: { fr: 'Revenir au début', en: 'Back to the start' },
  statusTitle: { fr: 'FICHE JOUEUR', en: 'PLAYER CARD' },
  skillTitle: { fr: 'ARBRE DE COMPÉTENCES', en: 'SKILL TREE' },
  klass: { fr: 'Classe', en: 'Class' },
  base: { fr: 'Base', en: 'Home base' },
  quest: { fr: 'Quête', en: 'Quest' },
  langs: { fr: 'Langues', en: 'Languages' },
  edu: { fr: 'Formation', en: 'Education' },
  // vue rapide
  qAbout: { fr: 'À propos', en: 'About' },
  qFeatured: { fr: 'Projet phare', en: 'Flagship project' },
  qSkills: { fr: 'Compétences', en: 'Skills' },
  qProjects: { fr: 'Autres projets', en: 'Other projects' },
  qCerts: { fr: 'Certifications', en: 'Certifications' },
  qXp: { fr: 'Expérience', en: 'Experience' },
  qEdu: { fr: 'Formation', en: 'Education' },
  qContact: { fr: 'Contact', en: 'Contact' },
  qMade: { fr: 'Fait par', en: 'Built by' },
};

// ---------- Profil ----------
export const PROFILE = {
  name: 'Nick Mahandry Rasamoely',
  handle: 'Nix-Phoe',
  klass: { fr: 'Développeur C++', en: 'C++ Developer' },
  base: 'Sherbrooke, QC',
  quest: { fr: 'Stage en développement logiciel C++ — Hiver 2027', en: 'C++ software development internship — Winter 2027' },
  motto: { fr: '« J’aime juste développer ce qui me passe par la tête »', en: '“I just like to develop what’s on my mind”' },
  languages: [
    { name: { fr: 'Français', en: 'French' }, stars: '★★★★★' },
    { name: { fr: 'Anglais', en: 'English' }, stars: { fr: '★★★½ à l’oral · ★★★★ à l’écrit', en: '★★★½ spoken · ★★★★ written' } },
    { name: { fr: 'Malgache', en: 'Malagasy' }, stars: { fr: 'langue maternelle', en: 'native language' } },
  ],
  summary: {
    fr: 'Étudiant au baccalauréat en informatique (régime coopératif) à l’Université de Sherbrooke, à la recherche d’un stage en développement logiciel C++ pour l’hiver 2027.',
    en: 'Computer science undergraduate (co-op program) at Université de Sherbrooke, looking for a C++ software development internship for Winter 2027.',
  },
};

export const CONTACT = {
  github: 'https://github.com/Nix-Phoe',
  email: 'Nick.Mahandry.Rasamoely@usherbrooke.ca',
  cv: 'cv.pdf',                       // emplacement : dépose cv.pdf à la racine du dépôt
};

// ---------- Formation ----------
export const EDUCATION = [
  {
    title: { fr: 'Baccalauréat en informatique (coop)', en: 'B.Sc. in Computer Science (co-op)' },
    place: 'Université de Sherbrooke',
    dates: { fr: 'août 2025 – déc. 2028', en: 'Aug 2025 – Dec 2028' },
    note: { fr: 'Excellent rendement scolaire', en: 'Excellent academic standing' },
  },
  {
    title: { fr: 'Certificat préparatoire en génie, sciences et santé', en: 'Preparatory Certificate in Engineering, Sciences and Health' },
    place: 'Université de Sherbrooke',
    dates: '2024 – 2025',
  },
];

// ---------- Compétences (arbre ; aucune barre de pourcentage inventée) ----------
export const SKILLS = [
  {
    name: 'C++', main: true,
    nodes: [
      { fr: 'POO', en: 'OOP' },
      { fr: 'Architecture modulaire', en: 'Modular architecture' },
      { fr: 'Séparation logique / affichage', en: 'Logic / display separation' },
      { fr: 'Gestion mémoire', en: 'Memory management' },
    ],
  },
  {
    name: { fr: 'Génie logiciel', en: 'Software engineering' },
    nodes: [{ fr: 'Tests', en: 'Testing' }, { fr: 'Revue de code', en: 'Code review' }, { fr: 'Versionnement', en: 'Version control' }],
  },
  {
    name: { fr: 'Simulation & données', en: 'Simulation & data' },
    nodes: [
      { fr: 'Modélisation d’états et de règles', en: 'State & rule modelling' }, { fr: 'Calcul numérique', en: 'Numerical computing' },
      { fr: 'Statistiques', en: 'Statistics' }, { fr: 'Visualisation', en: 'Visualization' },
    ],
  },
  { name: { fr: 'Autres langages', en: 'Other languages' }, nodes: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS', 'React'] },
  { name: { fr: 'Outils', en: 'Tools' }, nodes: ['Linux', 'PostgreSQL', 'Docker', 'Git / GitHub / GitLab', 'CLion', 'Visual Studio', 'AWS'] },
];

// ---------- Quartiers du Monde des Projets (dans l'ordre de la visite) ----------
// compact : true → tous les projets du quartier partagent un seul décor (`scene`)
//           et s'affichent en cartes d'une ligne.
export const DISTRICTS = [
  { id: 'star', tab: '★ StickFlow', name: { fr: 'L’Atelier StickFlow', en: 'The StickFlow Studio' } },
  { id: 'cpp', tab: 'C++', name: { fr: 'Les Terres du C++', en: 'The C++ Lands' } },
  { id: 'data', tab: 'Data', name: { fr: 'Le Laboratoire', en: 'The Lab' } },
  { id: 'arcade', tab: 'Arcade', name: { fr: 'L’Arcade', en: 'The Arcade' }, compact: true, scene: 'arcade' },
];

// ---------- Projets ----------
// Modèle pour ajouter un projet :
// {
//   id: 'mon-projet',                      ← identifiant unique (sert aussi à `at` dans LINES)
//   district: 'cpp' | 'data' | 'arcade',   ← quartier où son bâtiment apparaît
//   scene: 'radar',                        ← décor (voir js/scenes/index.js) ; absent → décor générique
//   name: 'Mon projet',
//   url: 'https://github.com/…',           ← optionnel
//   live: 'https://…',                     ← optionnel : bouton [ ESSAYER ↗ ]
//   tags: ['C++', 'Qt'],
//   pitch: { fr: 'Une phrase.', en: 'One sentence.' },       ← carte du jeu
//   desc:  { fr: '…', en: '…' },                             ← vue rapide (plus détaillé)
// }
export const PROJECTS = [
  // ───── ★ L'Atelier StickFlow (projet phare) ─────
  {
    id: 'stickflow', district: 'star', scene: 'studio', featured: true,
    name: 'StickFlow', version: '2.2.0',
    url: 'https://github.com/Nix-Phoe/StickFlow',
    live: 'https://stickflow.stickflow.workers.dev',
    tags: ['TypeScript', 'Vite', 'WebGL 2', 'PWA', 'Cloudflare Workers', 'Vitest', 'GitHub Actions', 'ADR'],
    pitch: {
      fr: 'Application d’animation de stickman par pivots, assistée par IA. Le principe : « l’IA assiste, l’utilisateur décide ».',
      en: 'Pivot-based stickman animation app, AI-assisted. The principle: “the AI assists, the user decides.”',
    },
    ai: [
      {
        name: { fr: 'Fluidité', en: 'Smoothness' },
        text: {
          fr: 'génère les images intermédiaires entre les images clés (linéaire, spline Catmull-Rom, ease-in-out).',
          en: 'generates the in-between frames between keyframes (linear, Catmull-Rom spline, ease-in-out).',
        },
      },
      {
        name: { fr: 'Répétition', en: 'Loop' },
        text: { fr: 'boucle fluide de la dernière image vers la première.', en: 'seamless loop from the last frame back to the first.' },
      },
    ],
    aiNote: {
      fr: 'Les images générées sont distinguées dans la timeline ; l’effet est non destructif.',
      en: 'Generated frames are marked in the timeline; the effect is non-destructive.',
    },
    editor: {
      fr: [
        'Timeline, pelure d’oignon, annuler / rétablir',
        'Plusieurs personnages, coloration partielle',
        'Calques de formes et de dessin, arrière-plans personnalisés',
        'Formats 16:9, 9:16, 1:1, 4:5 · export GIF / PNG / MP4',
      ],
      en: [
        'Timeline, onion skin, undo / redo',
        'Multiple characters, partial colouring',
        'Shape and drawing layers, custom backgrounds',
        '16:9, 9:16, 1:1, 4:5 formats · GIF / PNG / MP4 export',
      ],
    },
    tech: {
      fr: 'TypeScript et Vite, rendu WebGL 2, PWA installable et hors ligne, déployée sur Cloudflare Workers. Tests Vitest, intégration continue GitHub Actions, décisions d’architecture documentées (ADR).',
      en: 'TypeScript and Vite, WebGL 2 rendering, installable offline-capable PWA, deployed on Cloudflare Workers. Vitest tests, GitHub Actions CI, documented architecture decisions (ADRs).',
    },
  },

  // ───── Les Terres du C++ ─────
  {
    id: 'wavesim', district: 'cpp', scene: 'radar', name: 'Steins Gate Wave Sim',
    url: 'https://github.com/Nix-Phoe/Stein-s-Gate-wave-sims-',
    tags: ['C++', 'Qt Widgets', 'CMake', 'doctest', 'QPainter'],
    pitch: {
      fr: 'Simulateur pédagogique de propagation d’ondes radio avec effet Doppler. Moteur physique sans dépendance Qt, testé avec doctest ; graphiques dessinés avec QPainter.',
      en: 'Educational radio-wave propagation simulator with Doppler effect. Physics engine with zero Qt dependency, tested with doctest; plots drawn with QPainter.',
    },
    desc: {
      fr: 'Simulateur pédagogique de propagation d’ondes radio avec effet Doppler, en C++ / Qt Widgets / CMake. Le moteur physique n’a aucune dépendance Qt et est testé avec doctest ; les graphiques sont dessinés avec QPainter.',
      en: 'Educational radio-wave propagation simulator with Doppler effect, in C++ / Qt Widgets / CMake. The physics engine has zero Qt dependency and is tested with doctest; the plots are drawn with QPainter.',
    },
  },
  {
    id: 'platypus', district: 'cpp', scene: 'warehouse', name: 'PlatypusIMS',
    url: 'https://github.com/Nix-Phoe/PlatypusIMS',
    tags: ['C++', 'PostgreSQL', { fr: 'POO', en: 'OOP' }, 'Transactions'],
    pitch: {
      fr: 'Gestion d’inventaire d’un entrepôt de jeux vidéo : ajustement automatique des stocks, détection des niveaux critiques, transactions.',
      en: 'Inventory management for a video game warehouse: automatic stock adjustment, critical-level detection, transactions.',
    },
    desc: {
      fr: 'Gestion d’inventaire d’un entrepôt de jeux vidéo en C++ + PostgreSQL : ajustement automatique des stocks, détection des niveaux critiques, transactions, logique métier séparée de l’accès aux données.',
      en: 'Inventory management for a video game warehouse in C++ + PostgreSQL: automatic stock adjustment, critical-level detection, transactions, business logic kept separate from data access.',
    },
  },
  {
    id: 'school', district: 'cpp', scenes: ['minefield', 'sea'], school: true,
    name: { fr: 'Projets d’école', en: 'School projects' },
    tags: ['C++', { fr: 'POO', en: 'OOP' }, { fr: 'Récursivité', en: 'Recursion' }, { fr: 'Machine à états', en: 'State machine' }],
    parts: [
      {
        name: { fr: 'Démineur', en: 'Minesweeper' },
        text: { fr: 'architecture orientée objet, propagation récursive.', en: 'object-oriented architecture, recursive reveal.' },
      },
      {
        name: { fr: 'Bataille navale', en: 'Battleship' },
        text: {
          fr: 'simulateur à états, règles validées à chaque transition.',
          en: 'state-based simulator, rules validated at every transition.',
        },
      },
    ],
    desc: {
      fr: 'Démineur et Bataille navale : architecture orientée objet, propagation récursive, simulateur à états avec validation des règles à chaque transition.',
      en: 'Minesweeper and Battleship: object-oriented architecture, recursive reveal, state-based simulator with rule validation at every transition.',
    },
  },

  // ───── Le Laboratoire ─────
  {
    id: 'quality', district: 'data', scene: 'aerofactory', name: 'Quality Data Toolkit',
    url: 'https://github.com/Nix-Phoe/Quality-Data-Toolkit-',
    tags: ['Python', 'pandas', 'numpy', 'matplotlib', 'seaborn'],
    pitch: {
      fr: 'Simule un analyste qualité (contexte aérospatial) : nettoyage et fusion des CSV de 3 lignes de production, détection d’anomalies par z-score, graphiques.',
      en: 'Simulates a quality analyst (aerospace setting): cleaning and merging CSVs from 3 production lines, z-score anomaly detection, charts.',
    },
  },
  {
    id: 'incident', district: 'data', scene: 'cyber', name: 'Incident Tracker',
    url: 'https://github.com/Nix-Phoe/Incident-Tracker',
    tags: ['Python', 'pandas', 'KPI', 'SLA', 'Power BI'],
    pitch: {
      fr: 'Suivi d’incidents d’une équipe CSIRT : tickets synthétiques réalistes, KPI, SLA dépassés, export Power BI.',
      en: 'Incident tracking for a CSIRT team: realistic synthetic tickets, KPIs, SLA breaches, Power BI export.',
    },
  },
  {
    id: 'laliga', district: 'data', scene: 'stadium', name: 'La Liga Dashboard',
    url: 'https://github.com/Nix-Phoe/La-liga-dashboard-',
    tags: ['React', 'Recharts', 'JavaScript'],
    pitch: {
      fr: 'Saison 2025/26 : résumés de données et probabilités de victoire en face-à-face.',
      en: '2025/26 season: data summaries and head-to-head win probabilities.',
    },
  },

  // ───── L'Arcade (cartes compactes) ─────
  {
    id: 'studyhomie', district: 'arcade', name: 'STUDY-HOMIE',
    url: 'https://github.com/Nix-Phoe/STUDY-HOMIE',
    tags: ['React', 'Vite', { fr: 'API Claude', en: 'Claude API' }],
    pitch: { fr: 'Plan d’étude personnalisé généré avec l’API Claude.', en: 'Personalized study plan generated with the Claude API.' },
  },
  {
    id: 'timesphere', district: 'arcade', name: 'time-sphere',
    url: 'https://github.com/Nix-Phoe/time-sphere',
    tags: ['JavaScript', 'Chrome Manifest V3'],
    pitch: {
      fr: 'Extension Chrome (Manifest V3) : des signets à des moments précis des vidéos YouTube.',
      en: 'Chrome extension (Manifest V3): bookmarks at precise moments in YouTube videos.',
    },
  },
  {
    id: 'braindead', district: 'arcade', name: 'Don’t Be BrainDead 😈',
    url: 'https://github.com/Nix-Phoe/Don-t-Be-BrainDead-',
    tags: ['HTML', 'CSS', 'JavaScript'],
    pitch: { fr: 'Quiz à 3 niveaux, chrono de 30 s par question.', en: 'Three-level quiz, 30-second timer per question.' },
  },
  {
    id: 'pendu', district: 'arcade', name: 'Le jeu du pendu',
    url: 'https://github.com/Nix-Phoe/Le-jeu-du-pendu',
    tags: ['Python', 'Pygame'],
    pitch: { fr: 'Jeu du pendu : 10 essais, bouton Rejouer.', en: 'Hangman game: 10 tries, Replay button.' },
  },
];

// ---------- Certifications ----------
// badge : 'cloud' | 'atom' | 'star' — pixel arts originaux dessinés dans js/pixels.js
// (pas de logos officiels). qubits : true → petites sphères en orbite autour du trophée.
export const CERTS = [
  {
    badge: 'cloud',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: { fr: 'Juillet 2026', en: 'July 2026' },
    topics: { fr: ['Infonuagique', 'Services principaux', 'Sécurité'], en: ['Cloud concepts', 'Core services', 'Security'] },
  },
  {
    badge: 'atom', qubits: true,
    name: 'Qiskit Global Summer School 2026',
    issuer: 'IBM Quantum',
    date: { fr: 'Juillet 2026', en: 'July 2026' },
    topics: { fr: ['Algorithmes quantiques', 'Circuits', 'Simulation', 'Python'], en: ['Quantum algorithms', 'Circuits', 'Simulation', 'Python'] },
  },
];

// ---------- Expérience ----------
export const JOBS = [
  {
    title: { fr: 'Opérateur de production', en: 'Production Operator' },
    company: 'MANN+HUMMEL',
    place: 'Trois-Rivières, QC',
    dates: { fr: 'Mai – août 2025', en: 'May – Aug 2025' },
    bullets: {
      fr: ['Assemblage selon les spécifications client', 'Inspection qualité', 'Préparation des expéditions'],
      en: ['Assembly to customer specifications', 'Quality inspection', 'Shipment preparation'],
    },
    perk: {
      fr: 'Rigueur et souci du détail : les mêmes réflexes que pour les tests en logiciel.',
      en: 'Rigor and attention to detail: the same reflexes as software testing.',
    },
  },
];
