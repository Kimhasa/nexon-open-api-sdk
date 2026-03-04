import type { RequestHandler } from 'msw';
import { mapleStoryHandlers } from './maplestory.handlers.js';
import { mapleStoryMHandlers } from './maplestory-m.handlers.js';

export const handlers: RequestHandler[] = [...mapleStoryHandlers, ...mapleStoryMHandlers];
