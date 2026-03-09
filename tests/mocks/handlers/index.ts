import type { RequestHandler } from 'msw';
import { mapleStoryHandlers } from './maplestory.handlers.js';
import { mapleStoryMHandlers } from './maplestory-m.handlers.js';
import { fcOnlineHandlers } from './fc-online.handlers.js';
import { mapleStorySEAHandlers } from './maplestory-sea.handlers.js';

export const handlers: RequestHandler[] = [
  ...mapleStoryHandlers,
  ...mapleStoryMHandlers,
  ...fcOnlineHandlers,
  ...mapleStorySEAHandlers,
];
