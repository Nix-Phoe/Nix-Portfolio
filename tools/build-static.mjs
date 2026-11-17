// Régénère la vue rapide statique de index.html (bloc QUICK:START … QUICK:END)
// à partir de js/content.js. Utile pour le SEO et le mode sans JavaScript.
//
//   node tools/build-static.mjs
//
// Facultatif : avec JavaScript, le navigateur régénère ce bloc tout seul.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { quickHTML } = await import(pathToFileURL(path.join(root, 'js', 'quick.js')).href);

const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const A = '<!-- QUICK:START -->', B = '<!-- QUICK:END -->';
const i = html.indexOf(A), j = html.indexOf(B);
if (i < 0 || j < 0) throw new Error('Marqueurs QUICK:START / QUICK:END introuvables dans index.html');

const out = html.slice(0, i + A.length) + '\n' + quickHTML('fr').replace(/^\s*\n/, '').trimEnd() + '\n' + html.slice(j);
fs.writeFileSync(file, out);
console.log('index.html : vue rapide statique régénérée (fr).');
