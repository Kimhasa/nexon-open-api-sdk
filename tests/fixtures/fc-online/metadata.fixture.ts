import type {
  FcSpidMeta,
  FcSeasonIdMeta,
  FcSpPositionMeta,
  FcDivisionMeta,
  FcDivisionVoltaMeta,
  FcClassMeta,
  FcSeasonMeta,
} from '../../../src/games/fc-online/metadata/types.js';

// Samples from the public static JSON endpoints.

export const fcSpidMetaFixture: FcSpidMeta[] = [
  {
    id: 100000041,
    name: '이니에스타',
  },
  {
    id: 100000051,
    name: '앨런 시어러',
  },
];

export const fcSeasonIdMetaFixture: FcSeasonIdMeta[] = [
  {
    seasonId: 100,
    className: 'ICON TM (ICON The Moment)',
    seasonImg: 'https://ssl.nexon.com/s2/game/fc/online/obt/externalAssets/new/season/icontm.png',
  },
];

export const fcSpPositionMetaFixture: FcSpPositionMeta[] = [
  {
    spposition: 0,
    desc: 'GK',
  },
  {
    spposition: 1,
    desc: 'SW',
  },
];

export const fcDivisionMetaFixture: FcDivisionMeta[] = [
  {
    divisionId: 800,
    divisionName: '슈퍼 챔피언스',
  },
  {
    divisionId: 900,
    divisionName: '챔피언스',
  },
];

export const fcDivisionVoltaMetaFixture: FcDivisionVoltaMeta[] = [
  {
    divisionId: 1100,
    divisionName: '월드 스타',
  },
  {
    divisionId: 2000,
    divisionName: '내셔널 스타1부',
  },
];

export const fcClassMetaFixture: FcClassMeta[] = [
  {
    class: 100,
    className: 'ICON TM (ICON The Moment)',
    classImg: 'https://ssl.nexon.com/s2/game/fc/online/obt/externalAssets/new/season/icontm.png',
  },
  {
    class: 110,
    className: 'ICON TM(제한) (ICON The Moment Bound)',
    classImg: 'https://ssl.nexon.com/s2/game/fc/online/obt/externalAssets/new/season/icontm_b.png',
  },
];

// The live response uses seasonid as a string.
export const fcSeasonMetaWireFixture = [
  { matchtype: 50, seasonid: '202606' },
  { matchtype: 52, seasonid: '202606' },
];

export const fcSeasonMetaFixture: FcSeasonMeta[] = [
  { matchtype: 50, seasonId: 202606 },
  { matchtype: 52, seasonId: 202606 },
];
