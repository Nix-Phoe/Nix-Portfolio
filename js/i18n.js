// ═══════════════════════════════════════════════════════════════════════════
//  TOUT LE CONTENU DU SITE EST ICI (dialogues + infos), en français et anglais.
//
//  • Ajouter un projet  → ajoute un objet dans PROJECTS (voir le modèle plus bas).
//  • Ajouter une certif → ajoute un objet dans CERTS.
//  • Dans les répliques : {mot} = mot-clé surligné ; [think] [cool] [excited]
//    [unlock] en début de réplique = animation de Nix.
//  • Garde 2 à 4 répliques courtes par écran.
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

// ---------- Textes d'interface ----------
export const UI = {
  subtitle: { fr: 'Portfolio — le tutoriel', en: 'Portfolio — the tutorial' },
  pressStart: { fr: 'PRESS START', en: 'PRESS START' },
  newGame: { fr: 'NOUVELLE PARTIE', en: 'NEW GAME' },
  cont: { fr: 'CONTINUER', en: 'CONTINUE' },
  skip: { fr: 'Passer', en: 'Skip' },
  next: { fr: 'Suivant', en: 'Next' },
  prev: { fr: 'Précédent', en: 'Previous' },
  finish: { fr: 'Terminer', en: 'Finish' },
  quick: { fr: 'Mode CV rapide', en: 'Quick view' },
  play: { fr: 'Jouer le tutoriel', en: 'Play the tutorial' },
  sound: { fr: 'Son', en: 'Sound' },
  music: { fr: 'Musique', en: 'Music' },
  on: { fr: 'OUI', en: 'ON' },
  off: { fr: 'NON', en: 'OFF' },
  language: { fr: 'Langue', en: 'Language' },
  menu: { fr: 'MENU', en: 'MENU' },
  resume: { fr: 'Reprendre', en: 'Resume' },
  toTitle: { fr: 'Écran titre', en: 'Title screen' },
  zone: { fr: 'ZONE', en: 'ZONE' },
  map: { fr: 'Carte des zones', en: 'Zone map' },
  unlocked: { fr: 'SUCCÈS DÉBLOQUÉ !', en: 'ACHIEVEMENT UNLOCKED!' },
  viewGithub: { fr: 'VOIR SUR GITHUB', en: 'VIEW ON GITHUB' },
  school: { fr: 'Projet scolaire', en: 'School project' },
  item: { fr: 'OBJET', en: 'ITEM' },
  saveTitle: { fr: 'SAUVEGARDER LA PARTIE ?', en: 'SAVE YOUR GAME?' },
  github: { fr: 'GitHub', en: 'GitHub' },
  email: { fr: 'Courriel', en: 'Email' },
  cv: { fr: 'Télécharger le CV', en: 'Download résumé' },
  replay: { fr: 'Rejouer le tutoriel', en: 'Replay the tutorial' },
  theEnd: { fr: 'FIN ?', en: 'THE END?' },
  backSave: { fr: 'Retour au point de sauvegarde', en: 'Back to the save point' },
  hint: { fr: 'Espace / clic : suivant · ← → : zones · Échap : menu', en: 'Space / click: next · ← → : zones · Esc: menu' },
  hintTouch: { fr: 'Touche l’écran pour continuer', en: 'Tap the screen to continue' },
  statusTitle: { fr: 'FICHE JOUEUR', en: 'PLAYER CARD' },
  eduTitle: { fr: 'JOURNAL DE QUÊTES — FORMATION', en: 'QUEST LOG — EDUCATION' },
  skillTitle: { fr: 'ARBRE DE COMPÉTENCES', en: 'SKILL TREE' },
  jobTitle: { fr: 'EXPÉRIENCE', en: 'EXPERIENCE' },
  certTitle: { fr: 'SUCCÈS', en: 'ACHIEVEMENT' },
  name: { fr: 'Nom', en: 'Name' },
  klass: { fr: 'Classe', en: 'Class' },
  guild: { fr: 'Guilde', en: 'Guild' },
  base: { fr: 'Base', en: 'Home base' },
  quest: { fr: 'Quête en cours', en: 'Current quest' },
  langs: { fr: 'Langues', en: 'Languages' },
  motto: { fr: 'Devise', en: 'Motto' },
  // mode rapide
  qAbout: { fr: 'À propos', en: 'About' },
  qSkills: { fr: 'Compétences', en: 'Skills' },
  qProjects: { fr: 'Projets', en: 'Projects' },
  qCerts: { fr: 'Certifications', en: 'Certifications' },
  qXp: { fr: 'Expérience', en: 'Experience' },
  qEdu: { fr: 'Formation', en: 'Education' },
  qContact: { fr: 'Contact', en: 'Contact' },
  qMade: { fr: 'Fait par', en: 'Built by' },
  fileNote: {
    fr: 'Le mode jeu a besoin d’un petit serveur web (ou de GitHub Pages). Voici la version CV.',
    en: 'The game mode needs a small web server (or GitHub Pages). Here is the résumé version.',
  },
};

// ---------- Profil ----------
export const PROFILE = {
  name: 'Nick Mahandry Rasamoely',
  handle: 'Nix-Phoe',
  klass: { fr: 'Développeur C++', en: 'C++ Developer' },
  guild: { fr: 'Baccalauréat en informatique (coop) — Université de Sherbrooke', en: 'B.Sc. Computer Science (co-op) — Université de Sherbrooke' },
  base: 'Sherbrooke, QC',
  quest: { fr: 'Stage en développement logiciel C++ — Hiver 2027', en: 'C++ software development internship — Winter 2027' },
  motto: { fr: '« J’aime juste développer ce qui me passe par la tête »', en: '“I just like to develop what’s on my mind”' },
  languages: [
    { name: { fr: 'Français', en: 'French' }, stars: '★★★★★' },
    { name: { fr: 'Anglais', en: 'English' }, stars: { fr: '★★★½ (oral) · ★★★★ (écrit)', en: '★★★½ (spoken) · ★★★★ (written)' } },
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
  cv: 'cv.pdf',
};

// ---------- Formation ----------
export const EDUCATION = [
  {
    title: { fr: 'Baccalauréat en informatique (régime coopératif)', en: 'Bachelor of Computer Science (co-op program)' },
    place: 'Université de Sherbrooke',
    dates: { fr: 'Août 2025 – Déc. 2028', en: 'Aug 2025 – Dec 2028' },
    note: { fr: 'Excellent rendement scolaire.', en: 'Excellent academic standing.' },
    status: { fr: 'EN COURS', en: 'IN PROGRESS' },
  },
  {
    title: { fr: 'Certificat préparatoire en génie, sciences et santé', en: 'Preparatory Certificate in Engineering, Sciences and Health' },
    place: 'Université de Sherbrooke',
    dates: { fr: 'Août 2024 – Avril 2025', en: 'Aug 2024 – Apr 2025' },
    note: { fr: 'Mathématiques et physique.', en: 'Mathematics and physics.' },
    status: { fr: 'TERMINÉ', en: 'COMPLETED' },
  },
];

// ---------- Compétences (arbre) ----------
export const SKILLS = [
  {
    name: 'C++', main: true,
    nodes: [
      { fr: 'Programmation orientée objet', en: 'Object-oriented programming' },
      { fr: 'Conception de classes', en: 'Class design' },
      { fr: 'Architecture modulaire', en: 'Modular architecture' },
      { fr: 'Séparation logique / affichage', en: 'Logic / display separation' },
      { fr: 'Gestion mémoire', en: 'Memory management' },
      { fr: 'Interfaces interactives', en: 'Interactive interfaces' },
    ],
  },
  {
    name: { fr: 'Génie logiciel', en: 'Software engineering' },
    nodes: [
      { fr: 'Conception OO', en: 'OO design' }, { fr: 'Architecture testable', en: 'Testable architecture' },
      { fr: 'Tests & validation', en: 'Testing & validation' }, { fr: 'Revue de code', en: 'Code review' },
      { fr: 'Versionnement', en: 'Version control' },
    ],
  },
  {
    name: { fr: 'Simulation & calcul', en: 'Simulation & computing' },
    nodes: [
      { fr: 'Modélisation d’états et de règles', en: 'State & rule modelling' }, { fr: 'Calcul numérique', en: 'Numerical computing' },
      { fr: 'Statistiques', en: 'Statistics' }, { fr: 'Détection d’anomalies', en: 'Anomaly detection' },
      { fr: 'Visualisation de données', en: 'Data visualization' },
    ],
  },
  { name: { fr: 'Autres langages', en: 'Other languages' }, nodes: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML5', 'CSS', 'React'] },
  { name: { fr: 'Outils', en: 'Tools' }, nodes: ['UNIX/Linux', 'Windows', 'PostgreSQL', 'Docker', 'Git', 'GitHub', 'GitLab', 'Visual Studio', 'CLion', 'VS Code', 'AWS'] },
];

// ---------- Projets ----------
// Modèle pour ajouter un projet :
// {
//   zone: 'cpp' | 'data' | 'arcade',      ← dans quelle zone il apparaît
//   scene: 'radar',                        ← décor (voir js/scenes/index.js) ; sans décor → 'generic'
//   name: 'Mon projet',
//   url: 'https://github.com/…',           ← optionnel (sinon : school: true)
//   tags: ['C++', 'Qt'],
//   desc:  { fr: '…', en: '…' },
//   lines: { fr: ['réplique 1', 'réplique 2'], en: ['line 1', 'line 2'] },
// }
export const PROJECTS = [
  // ───── Zone 4 : Les Terres du C++ ─────
  {
    zone: 'cpp', scene: 'radar', name: 'Steins Gate Wave Sim',
    url: 'https://github.com/Nix-Phoe/Stein-s-Gate-wave-sims-',
    tags: ['C++', 'Qt Widgets', 'CMake', 'doctest', 'QPainter'],
    desc: {
      fr: 'Simulateur pédagogique de propagation d’ondes radio avec effet Doppler. Un émetteur mobile (trajectoire linéaire ou circulaire) et un récepteur fixe : distance, délai, décalage Doppler, atténuation en espace libre et signal reçu avec bruit gaussien. Le moteur physique (core/) n’a aucune dépendance Qt et est testé avec doctest ; les graphiques sont dessinés à la main avec QPainter.',
      en: 'Educational radio-wave propagation simulator with Doppler effect. A moving emitter (linear or circular path) and a fixed receiver: distance, delay, Doppler shift, free-space path loss and a received signal with Gaussian noise. The physics engine (core/) has zero Qt dependency and is tested with doctest; the plots are hand-drawn with QPainter.',
    },
    lines: {
      fr: [
        '[think]Premier arrêt : une station radar. Un émetteur qui bouge, un récepteur fixe, et l’{effet Doppler} entre les deux.',
        '[cool]Le moteur physique tourne {sans aucune dépendance Qt}, testé avec {doctest}. Les graphiques ? Dessinés à la main avec {QPainter}.',
      ],
      en: [
        '[think]First stop: a radar station. A moving emitter, a fixed receiver, and the {Doppler effect} in between.',
        '[cool]The physics core runs with {zero Qt dependency}, tested with {doctest}. The plots? Hand-drawn with {QPainter}.',
      ],
    },
  },
  {
    zone: 'cpp', scene: 'warehouse', name: 'PlatypusIMS',
    url: 'https://github.com/Nix-Phoe/PlatypusIMS',
    tags: ['C++', 'PostgreSQL', { fr: 'POO', en: 'OOP' }, 'Transactions'],
    desc: {
      fr: 'Système de gestion d’inventaire pour un entrepôt de jeux vidéo : suivi des produits, ajustement automatique des stocks et détection des niveaux critiques. Architecture orientée objet, transactions, et séparation nette entre la logique métier et l’accès aux données.',
      en: 'Inventory management system for a video game warehouse: product tracking, automatic stock adjustment and critical-level detection. Object-oriented architecture, transactions, and a clean split between business logic and data access.',
    },
    lines: {
      fr: [
        'Un entrepôt de jeux vidéo. Des milliers de cartouches, et {PlatypusIMS} sait où est chacune.',
        '{C++} branché sur {PostgreSQL} : stocks ajustés tout seuls, alertes de niveaux critiques, {transactions} propres.',
      ],
      en: [
        'A video game warehouse. Thousands of cartridges, and {PlatypusIMS} knows where every one is.',
        '{C++} wired to {PostgreSQL}: stock adjusts itself, critical-level alerts, clean {transactions}.',
      ],
    },
  },
  {
    zone: 'cpp', scene: 'minefield', name: { fr: 'Démineur', en: 'Minesweeper' }, school: true,
    tags: ['C++', { fr: 'POO', en: 'OOP' }, { fr: 'Récursivité', en: 'Recursion' }],
    desc: {
      fr: 'Démineur à l’architecture orientée objet complète : le plateau, les cellules et l’algorithme de propagation récursive vivent dans des classes distinctes, avec une séparation stricte entre la logique et l’affichage.',
      en: 'Minesweeper with a full object-oriented architecture: the board, the cells and the recursive reveal algorithm live in separate classes, with a strict split between logic and display.',
    },
    lines: {
      fr: [
        'Attention où tu voles. Ici, chaque case d’herbe cache peut-être une surprise.',
        'Plateau, cellules et {propagation récursive} : chacun sa classe. La logique ignore complètement l’affichage.',
      ],
      en: [
        'Watch where you fly. Every grass tile here might be hiding a surprise.',
        'Board, cells and {recursive reveal}: each gets its own class. The logic knows nothing about the display.',
      ],
    },
  },
  {
    zone: 'cpp', scene: 'sea', name: { fr: 'Bataille navale', en: 'Battleship' }, school: true,
    tags: ['C++', { fr: 'Machine à états', en: 'State machine' }, { fr: 'POO', en: 'OOP' }],
    desc: {
      fr: 'Simulateur à états : classes de navires, grille et tour de jeu, avec validation des états et des règles de placement à chaque transition.',
      en: 'State-based simulator: ship classes, grid and turn logic, with state and placement-rule validation at every transition.',
    },
    lines: {
      fr: [
        'Tous à bord ! Une {bataille navale} pilotée par une {machine à états}.',
        '[think]Navires, grille, tour de jeu : chaque transition valide l’état et les {règles de placement}. Zéro coup illégal.',
      ],
      en: [
        'All aboard! A {battleship} game driven by a {state machine}.',
        '[think]Ships, grid, turns: every transition validates the state and the {placement rules}. Zero illegal moves.',
      ],
    },
  },

  // ───── Zone 5 : Le Laboratoire des Données ─────
  {
    zone: 'data', scene: 'aerofactory', name: 'Quality Data Toolkit',
    url: 'https://github.com/Nix-Phoe/Quality-Data-Toolkit-',
    tags: ['Python', 'pandas', 'numpy', 'matplotlib', 'seaborn'],
    desc: {
      fr: 'Simule le travail d’un analyste qualité dans un contexte inspiré de l’aérospatial : les CSV bruts de trois lignes de production sont nettoyés, fusionnés puis analysés — détection d’outliers par z-score, statistiques et graphiques.',
      en: 'Simulates a quality analyst’s work in an aerospace-inspired setting: raw CSVs from three production lines are cleaned, merged, then analysed — z-score outlier detection, statistics and charts.',
    },
    lines: {
      fr: [
        'Tapis roulant, scanner laser. Trois lignes de production, et quelques pièces louches à repérer.',
        '{pandas} nettoie et fusionne, le {z-score} démasque les {outliers}. Le boulot d’un analyste qualité, en {Python}.',
      ],
      en: [
        'Conveyor belt, laser scanner. Three production lines, and a few shady parts to catch.',
        '{pandas} cleans and merges, the {z-score} exposes the {outliers}. A quality analyst’s job, in {Python}.',
      ],
    },
  },
  {
    zone: 'data', scene: 'cyber', name: 'Incident Tracker',
    url: 'https://github.com/Nix-Phoe/Incident-Tracker',
    tags: ['Python', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'faker', 'Power BI'],
    desc: {
      fr: 'Simule le suivi d’incidents d’une équipe CSIRT : génération de tickets synthétiques réalistes (sévérité pondérée, temps de résolution log-normal), KPI, suivi des SLA dépassés, graphiques et export pour Power BI. Données 100 % synthétiques.',
      en: 'Simulates incident tracking for a CSIRT team: realistic synthetic ticket generation (weighted severity, log-normal resolution times), KPIs, SLA-breach tracking, charts and an export for Power BI. 100% synthetic data.',
    },
    lines: {
      fr: [
        'Alerte rouge ! …Relax, c’est une simulation. Les tickets sont {100 % synthétiques}.',
        '[think]Sévérité pondérée, résolution {log-normale}, {SLA dépassés} traqués, export {Power BI}. Comme une vraie équipe {CSIRT}.',
      ],
      en: [
        'Red alert! …Relax, it’s a simulation. The tickets are {100% synthetic}.',
        '[think]Weighted severity, {log-normal} resolution times, {SLA breaches} tracked, {Power BI} export. Just like a real {CSIRT} team.',
      ],
    },
  },
  {
    zone: 'data', scene: 'stadium', name: 'La Liga Dashboard',
    url: 'https://github.com/Nix-Phoe/La-liga-dashboard-',
    tags: ['React', 'Recharts', 'JavaScript'],
    desc: {
      fr: 'Tableau de bord de la saison La Liga 2025/26 : résumés de données et probabilités de victoire en face-à-face.',
      en: 'Dashboard for the 2025/26 La Liga season: data summaries and head-to-head win probabilities.',
    },
    lines: {
      fr: [
        'Projecteurs allumés. La saison {La Liga 2025/26}, en chiffres.',
        '{React} + {Recharts} : résumés de données et probabilités de victoire en face-à-face. Moi, je parie sur le phénix.',
      ],
      en: [
        'Floodlights on. The {La Liga 2025/26} season, in numbers.',
        '{React} + {Recharts}: data summaries and head-to-head win probabilities. My money’s on the phoenix.',
      ],
    },
  },

  // ───── Zone 6 : L'Arcade ─────
  {
    zone: 'arcade', scene: 'bedroom', name: 'STUDY-HOMIE',
    url: 'https://github.com/Nix-Phoe/STUDY-HOMIE',
    tags: ['React', 'Vite', { fr: 'API Claude', en: 'Claude API' }],
    desc: {
      fr: 'Application qui génère un plan d’étude personnalisé selon la matière, le niveau, les objectifs et le temps disponible. Génération via l’API Claude d’Anthropic.',
      en: 'App that generates a personalized study plan based on the subject, level, goals and time available. Generation through Anthropic’s Claude API.',
    },
    lines: {
      fr: [
        'Chambre d’étudiant, 23 h, examen demain. On connaît tous.',
        '{STUDY-HOMIE} te pond un {plan d’étude personnalisé} : matière, niveau, objectifs, temps dispo. {React + Vite}, généré par l’{API Claude}.',
      ],
      en: [
        'Student bedroom, 11 PM, exam tomorrow. We’ve all been there.',
        '{STUDY-HOMIE} whips up a {personalized study plan}: subject, level, goals, time left. {React + Vite}, generated through the {Claude API}.',
      ],
    },
  },
  {
    zone: 'arcade', scene: 'clocktower', name: 'time-sphere',
    url: 'https://github.com/Nix-Phoe/time-sphere',
    tags: ['JavaScript', 'Chrome Manifest V3', 'chrome.storage'],
    desc: {
      fr: 'Extension Chrome (Manifest V3) pour poser des signets à des horodatages précis dans les vidéos YouTube.',
      en: 'Chrome extension (Manifest V3) that drops bookmarks at precise timestamps inside YouTube videos.',
    },
    lines: {
      fr: [
        'Tic, tac. Tu cherches encore « le passage à 14:32 » dans une vidéo de deux heures ?',
        '{time-sphere} : une extension {Chrome (Manifest V3)} qui pose des signets à la seconde près sur YouTube. Rangés dans {chrome.storage}.',
      ],
      en: [
        'Tick, tock. Still hunting for “that bit at 14:32” in a two-hour video?',
        '{time-sphere}: a {Chrome extension (Manifest V3)} that drops to-the-second bookmarks on YouTube. Kept in {chrome.storage}.',
      ],
    },
  },
  {
    zone: 'arcade', scene: 'tvset', name: 'Don’t Be BrainDead 😈',
    url: 'https://github.com/Nix-Phoe/Don-t-Be-BrainDead-',
    tags: ['HTML', 'CSS', 'JavaScript', 'JSON'],
    desc: {
      fr: 'Quiz de culture générale : 3 niveaux (facile, moyen, difficile), 5 questions par niveau, un chrono de 30 s par question et un message final selon le score.',
      en: 'General-knowledge quiz: 3 levels (easy, medium, hard), 5 questions per level, a 30-second timer per question and a final message based on the score.',
    },
    lines: {
      fr: [
        'Mesdames et messieurs… {Don’t Be BrainDead} ! Le quiz qui juge ta culture générale.',
        '3 niveaux, 5 questions chacun, {30 secondes} au chrono. Et un message final… selon ton score. 😈',
      ],
      en: [
        'Ladies and gentlemen… {Don’t Be BrainDead}! The quiz that judges your general knowledge.',
        '3 levels, 5 questions each, {30 seconds} on the clock. And a final message… depending on your score. 😈',
      ],
    },
  },
  {
    zone: 'arcade', scene: 'western', name: 'Le jeu du pendu',
    url: 'https://github.com/Nix-Phoe/Le-jeu-du-pendu',
    tags: ['Python', 'Pygame'],
    desc: {
      fr: 'Jeu du pendu interactif : saisie des lettres au clavier, 10 essais et un bouton Rejouer.',
      en: 'Interactive hangman game: keyboard letter input, 10 tries and a Replay button.',
    },
    lines: {
      fr: [
        'Dernier arrêt de l’Arcade : le Far West. Ici, on devine le mot… ou ça finit mal.',
        'Un pendu en {Python + Pygame} : tu tapes tes lettres, t’as {10 essais}, et un bouton Rejouer pour la revanche.',
      ],
      en: [
        'Last stop in the Arcade: the Wild West. Guess the word… or else.',
        'Hangman in {Python + Pygame}: type your letters, you get {10 tries}, and a Replay button for the rematch.',
      ],
    },
  },
];

// ---------- Certifications ----------
// badge : 'cloud' | 'atom' | 'star' (dessinés dans js/pixels.js)
export const CERTS = [
  {
    scene: 'temple', badge: 'cloud',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: { fr: 'Juillet 2026', en: 'July 2026' },
    topics: { fr: ['Infonuagique', 'Services principaux', 'Sécurité', 'Architecture'], en: ['Cloud concepts', 'Core services', 'Security', 'Architecture'] },
    lines: {
      fr: [
        '[unlock]Certif débloquée ! ☁️ {AWS Cloud Practitioner}. Il flotte au-dessus des nuages, comme moi.',
        'Infonuagique, services principaux, sécurité, architecture. Obtenue en {juillet 2026}.',
      ],
      en: [
        '[unlock]Achievement unlocked! ☁️ {AWS Cloud Practitioner}. He floats above the clouds. Like me.',
        'Cloud concepts, core services, security, architecture. Earned in {July 2026}.',
      ],
    },
  },
  {
    scene: 'quantum', badge: 'atom',
    name: 'Qiskit Global Summer School 2026',
    issuer: 'IBM Quantum',
    date: { fr: 'Juillet 2026', en: 'July 2026' },
    topics: { fr: ['Algorithmes quantiques', 'Circuits', 'Simulation numérique', 'Python'], en: ['Quantum algorithms', 'Circuits', 'Numerical simulation', 'Python'] },
    lines: {
      fr: [
        '[think]Et là, ça devient bizarre. Bienvenue dans le labo {quantique}.',
        '[unlock]{Qiskit Global Summer School 2026}, par IBM Quantum. Je suis à la fois impressionné et pas impressionné.',
      ],
      en: [
        '[think]And this is where it gets weird. Welcome to the {quantum} lab.',
        '[unlock]{Qiskit Global Summer School 2026}, by IBM Quantum. I’m both impressed and not impressed.',
      ],
    },
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
      fr: 'Rigueur et souci du détail — les mêmes réflexes que pour les tests et la qualité logicielle.',
      en: 'Rigor and attention to detail — the same reflexes as software testing and quality.',
    },
  },
];

// ---------- Zones ----------
// kind : 'title' | 'status' | 'education' | 'skills' | 'projects' | 'certs' | 'jobs' | 'save'
// transition : 'rebirth' | 'flight' | 'mosaic' | 'shake' | 'iris'
export const ZONES = [
  { id: 'title', kind: 'title', scene: 'title', name: { fr: 'Écran titre', en: 'Title screen' } },
  {
    id: 'nest', kind: 'status', scene: 'nest', transition: 'rebirth',
    name: { fr: 'Le Nid', en: 'The Nest' },
    lines: {
      fr: [
        'Yo. Moi c’est {Nix}. Je renais de mes cendres, lui il renaît de ses bugs. On fait la visite ?',
        '« Lui », c’est {Nick Mahandry Rasamoely}. Mon créateur. Étudiant en informatique à l’{Université de Sherbrooke}.',
        '[think]Sa quête en cours : un {stage en développement C++} pour l’{hiver 2027}.',
        'Sa devise ? « J’aime juste développer ce qui me passe par la tête. » Tiens, sa fiche.',
      ],
      en: [
        'Yo. Name’s {Nix}. I rise from ashes, he rises from bugs. Wanna take the tour?',
        '“He” is {Nick Mahandry Rasamoely}. My creator. Computer science student at {Université de Sherbrooke}.',
        '[think]His current quest: a {C++ development internship} for {Winter 2027}.',
        'His motto? “I just like to develop what’s on my mind.” Here, his player card.',
      ],
    },
  },
  {
    id: 'academy', kind: 'education', scene: 'academy', transition: 'flight',
    name: { fr: 'L’Académie', en: 'The Academy' },
    lines: {
      fr: [
        'Bienvenue à l’{Académie}. Chut… les livres volent, mais ils mordent pas.',
        '{Baccalauréat en informatique}, régime {coop}, à l’UdeS. Traduction : il étudie ET il bosse.',
        'Avant ça, un certificat préparatoire. {Maths} et {physique} à haute dose. Il a survécu.',
      ],
      en: [
        'Welcome to the {Academy}. Shh… the books fly, but they don’t bite.',
        '{Bachelor’s in Computer Science}, {co-op} program, at UdeS. Translation: he studies AND he works.',
        'Before that, a preparatory certificate. Heavy doses of {math} and {physics}. He survived.',
      ],
    },
  },
  {
    id: 'forge', kind: 'skills', scene: 'forge', transition: 'mosaic',
    name: { fr: 'La Forge', en: 'The Forge' },
    lines: {
      fr: [
        'La {Forge}. Ici on forge des compétences. Pas de barres de pourcentage bidon.',
        '[think]La grosse branche, c’est le {C++} : classes, architecture, mémoire. Le métal de base.',
        'Autour : {génie logiciel}, {simulation}, et une ceinture d’outils bien remplie. Regarde l’arbre s’allumer.',
      ],
      en: [
        'The {Forge}. Skills get hammered out here. No made-up percentage bars.',
        '[think]The big branch is {C++}: classes, architecture, memory. The base metal.',
        'Around it: {software engineering}, {simulation}, and a well-stocked tool belt. Watch the tree light up.',
      ],
    },
  },
  {
    id: 'cpp', kind: 'projects', transition: 'shake',
    name: { fr: 'Les Terres du C++', en: 'The C++ Lands' },
    group: { fr: 'Projets C++', en: 'C++ projects' },
    lines: {
      fr: ['Cette zone, c’est du {C++} pur. Pas de raccourcis ici, que de la mémoire gérée à la main.'],
      en: ['This zone is pure {C++}. No shortcuts — memory managed by hand.'],
    },
  },
  {
    id: 'data', kind: 'projects', transition: 'iris',
    name: { fr: 'Le Laboratoire des Données', en: 'The Data Lab' },
    group: { fr: 'Python & données', en: 'Python & data' },
    lines: {
      fr: ['Le {Laboratoire des Données}. Des CSV sales qui entrent, des graphiques propres qui sortent.'],
      en: ['The {Data Lab}. Dirty CSVs go in, clean charts come out.'],
    },
  },
  {
    id: 'arcade', kind: 'projects', transition: 'flight',
    name: { fr: 'L’Arcade', en: 'The Arcade' },
    group: { fr: 'Web, outils & jeux', en: 'Web, tools & games' },
    lines: {
      fr: ['L’{Arcade}. Zone détente. Enfin… détente avec du {React} dedans.'],
      en: ['The {Arcade}. Chill zone. Well… chill with {React} in it.'],
    },
  },
  {
    id: 'temple', kind: 'certs', transition: 'rebirth',
    name: { fr: 'Le Temple des Succès', en: 'The Temple of Achievements' },
    lines: {
      fr: ['Le {Temple des Succès}. Ici, on n’entre qu’avec des badges.'],
      en: ['The {Temple of Achievements}. Badges only beyond this point.'],
    },
  },
  {
    id: 'factory', kind: 'jobs', scene: 'factory', transition: 'mosaic',
    name: { fr: 'L’Usine', en: 'The Factory' },
    lines: {
      fr: [
        'L’{Usine}. Avant le code, il y a eu la chaîne d’assemblage.',
        'Été 2025 : {opérateur de production} chez {MANN+HUMMEL}, à Trois-Rivières. Assemblage, inspection, expédition.',
        '[think]Une pièce hors spec ne sort pas de l’usine. Depuis, il teste son code pareil : {rigueur} et {souci du détail}.',
      ],
      en: [
        'The {Factory}. Before the code, there was the assembly line.',
        'Summer 2025: {production operator} at {MANN+HUMMEL}, in Trois-Rivières. Assembly, inspection, shipping.',
        '[think]An out-of-spec part never leaves the plant. He’s tested his code the same way ever since: {rigor} and {attention to detail}.',
      ],
    },
  },
  {
    id: 'save', kind: 'save', scene: 'campfire', transition: 'iris',
    name: { fr: 'Point de sauvegarde', en: 'Save Point' },
    lines: {
      fr: [
        'Un feu de camp. Tu sais ce que ça veut dire : {point de sauvegarde}.',
        '[cool]Fin du tutoriel. Le vrai jeu, c’est de l’embaucher. Stage {C++}, {hiver 2027}. Je dis ça, je dis rien.',
      ],
      en: [
        'A campfire. You know what that means: {save point}.',
        '[cool]End of tutorial. The real game is hiring him. {C++} internship, {Winter 2027}. Just saying.',
      ],
    },
    outro: {
      fr: 'Allez, je retourne à mes cendres. Fais pas attendre le dev trop longtemps. ✌',
      en: 'Alright, back to my ashes. Don’t keep the dev waiting too long. ✌',
    },
  },
];
