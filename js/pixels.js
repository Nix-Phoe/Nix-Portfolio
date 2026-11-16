// Petits dessins pixel art de l'interface : icônes de la carte et badges de succès.
// Tout est dessiné en code puis converti en image (data URL).

const ICONS = {
  title:   ['...#...', '...#...', '.#####.', '..###..', '..###..', '.##.##.', '.#...#.'],
  nest:    ['..###..', '.#####.', '.#####.', '.#####.', '#.###.#', '##...##', '.#####.'],
  academy: ['.......', '###.###', '###.###', '###.###', '###.###', '#######', '.......'],
  forge:   ['.......', '######.', '.#####.', '..###..', '..###..', '.#####.', '.#####.'],
  cpp:     ['.##....', '#..#.#.', '#...###', '#....#.', '#..#...', '.##....', '.......'],
  data:    ['......#', '......#', '...#..#', '...#..#', '#..#..#', '#..#..#', '#######'],
  arcade:  ['..###..', '..###..', '...#...', '...#...', '.#####.', '#######', '#######'],
  temple:  ['#######', '#.###.#', '#.###.#', '.#####.', '...#...', '..###..', '.#####.'],
  factory: ['.....#.', '.....#.', '#.#.###', '#######', '#######', '#.#.#.#', '#######'],
  save:    ['...#...', '..##...', '..###..', '.####..', '.#####.', '.##.##.', '..###..'],
};

const urls = new Map();

export function iconURL(id, color = '#d6ecff') {
  const key = id + color;
  if (urls.has(key)) return urls.get(key);
  const rows = ICONS[id] || ICONS.title, cv = document.createElement('canvas');
  cv.width = cv.height = 7;
  const c = cv.getContext('2d');
  c.fillStyle = color;
  rows.forEach((r, y) => { for (let x = 0; x < 7; x++) if (r[x] === '#') c.fillRect(x, y, 1, 1); });
  const u = cv.toDataURL();
  urls.set(key, u);
  return u;
}

/** Badge de succès original (pas de logo officiel). kind : 'cloud' | 'atom' | 'star' */
export function badgeURL(kind) {
  if (urls.has('b' + kind)) return urls.get('b' + kind);
  const S = 32, cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const c = cv.getContext('2d');
  const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const disc = (cx, cy, r, col) => { for (let dy = -r; dy <= r; dy++) { const hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.4); R(cx - hw, cy + dy, hw * 2 + 1, 1, col); } };
  // rubans
  R(9, 20, 5, 11, '#00b8a8'); R(18, 20, 5, 11, '#00d8c8'); R(9, 29, 2, 2, '#0a0f24'); R(12, 29, 2, 2, '#0a0f24'); R(18, 29, 2, 2, '#0a0f24'); R(21, 29, 2, 2, '#0a0f24');
  c.clearRect(11, 30, 1, 1); c.clearRect(20, 30, 1, 1);
  // médaille
  disc(16, 13, 13, '#8a6a1a'); disc(16, 13, 12, '#f2c14e'); disc(16, 13, 10, '#1b2a5c'); disc(16, 13, 9, '#27407e');
  R(8, 5, 5, 1, '#ffe9a8'); R(6, 7, 2, 3, '#ffe9a8');
  if (kind === 'cloud') {
    R(10, 14, 13, 4, '#ffffff'); R(11, 12, 5, 2, '#ffffff'); R(14, 10, 6, 4, '#ffffff'); R(19, 12, 3, 2, '#ffffff');
    R(11, 17, 11, 1, '#a8d0ff'); R(15, 6, 1, 3, '#00ffe0'); R(14, 7, 3, 1, '#00ffe0');
  } else if (kind === 'atom') {
    for (let k = 0; k < 3; k++) for (let i = 0; i < 40; i++) {
      const a = i / 40 * Math.PI * 2, rot = k * Math.PI / 3;
      const x = Math.cos(a) * 8, y = Math.sin(a) * 3;
      R(Math.round(16 + x * Math.cos(rot) - y * Math.sin(rot)), Math.round(13 + x * Math.sin(rot) + y * Math.cos(rot)), 1, 1, k === 0 ? '#00ffe0' : '#b06ae8');
    }
    disc(16, 13, 2, '#ffffff');
  } else {
    R(15, 7, 3, 12, '#ffffff'); R(10, 12, 13, 3, '#ffffff'); R(12, 9, 9, 9, '#ffffff'); disc(16, 13, 2, '#f2c14e');
  }
  const u = cv.toDataURL();
  urls.set('b' + kind, u);
  return u;
}
