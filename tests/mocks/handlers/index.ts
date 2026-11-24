import type { RequestHandler } from 'msw';
import { mapleStoryHandlers } from './maplestory.handlers.js';
import { mapleStoryMHandlers } from './maplestory-m.handlers.js';
import { fcOnlineHandlers } from './fc-online.handlers.js';
import { mapleStorySEAHandlers } from './maplestory-sea.handlers.js';
import { mapleStoryTWHandlers } from './maplestory-tw.handlers.js';
import { firstDescendantHandlers } from './first-descendant.handlers.js';
import { mabinogiHeroesHandlers } from './mabinogi-heroes.handlers.js';
import { suddenAttackHandlers } from './sudden-attack.handlers.js';
import { kartriderHandlers } from './kartrider.handlers.js';
import { baramHandlers } from './baram.handlers.js';
import { mabinogiHandlers } from './mabinogi.handlers.js';
import { baramYeonHandlers } from './baram-yeon.handlers.js';
import { v4Handlers } from './v4.handlers.js';
import { hit2Handlers } from './hit2.handlers.js';
import { platformHandlers } from './platform.handlers.js';

export const handlers: RequestHandler[] = [
  ...mapleStoryHandlers,
  ...mapleStoryMHandlers,
  ...fcOnlineHandlers,
  ...mapleStorySEAHandlers,
  ...mapleStoryTWHandlers,
  ...firstDescendantHandlers,
  ...mabinogiHeroesHandlers,
  ...suddenAttackHandlers,
  ...kartriderHandlers,
  ...baramHandlers,
  ...mabinogiHandlers,
  ...baramYeonHandlers,
  ...v4Handlers,
  ...hit2Handlers,
  ...platformHandlers,
];
