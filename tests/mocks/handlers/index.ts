import type { RequestHandler } from 'msw';
import { mapleStoryHandlers } from './maplestory.handlers.js';

export const handlers: RequestHandler[] = [...mapleStoryHandlers];
