import type { FcTradeRecord } from '../../../src/games/fc-online/user/types.js';
import type { FcRankerStats } from '../../../src/games/fc-online/ranker/types.js';

export const fcTradeFixture: FcTradeRecord[] = [
  {
    tradeDate: '2023-12-14T09:55:45',
    saleSn: 'example-sale-id-0001',
    spid: 298199236,
    grade: 1,
    value: 10000,
  },
];

export const fcRankerFixture: FcRankerStats[] = [
  {
    spId: 100167680,
    spPosition: 18,
    status: {
      shoot: 0,
      effectiveShoot: 0,
      assist: 0,
      goal: 0,
      dribble: 165,
      dribbleTry: 9,
      dribbleSuccess: 9,
      passTry: 14,
      passSuccess: 11,
      block: 0,
      tackle: 0,
      matchCount: 1,
    },
    createDate: '2023-12-14T01:12:34',
  },
];
