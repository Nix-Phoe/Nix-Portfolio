// Registre des décors. La clé est utilisée par le champ `scene` dans js/content.js.
// Un projet sans décor (ou avec un nom inconnu) reçoit le décor `generic`.
import { title, generic } from './zone0-title.js';
import { nest } from './zone1-nest.js';
import { studio } from './zone2-studio.js';
import { radar, warehouse, minefield, sea } from './zone2-cpp.js';
import { aerofactory, cyber, stadium } from './zone2-data.js';
import { arcade } from './zone2-arcade.js';
import { temple } from './zone3-summit.js';
import { campfire } from './zone4-save.js';

export const DECORS = {
  title, generic, nest,
  studio, radar, warehouse, minefield, sea,
  aerofactory, cyber, stadium, arcade,
  temple, campfire,
};
