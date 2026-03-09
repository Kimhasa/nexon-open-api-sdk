import type { FcUserBasic, FcMaxDivision } from '../../../src/games/fc-online/user/types.js';
import type { FcMatchDetail } from '../../../src/games/fc-online/match/types.js';
import type { FcMatchTypeMeta } from '../../../src/games/fc-online/metadata/types.js';

// ─── OUID ────────────────────────────────────────────────────────────────────

export const fcOuidFixture = {
  ouid: 'fc-ouid-aabb1122334455667788',
};

// ─── User Basic ──────────────────────────────────────────────────────────────

export const fcUserBasicFixture: FcUserBasic = {
  ouid: 'fc-ouid-aabb1122334455667788' as FcUserBasic['ouid'],
  nickname: '테스트유저FC',
  level: 42,
};

// ─── Max Division ────────────────────────────────────────────────────────────

export const fcMaxDivisionFixture: FcMaxDivision[] = [
  {
    matchType: 50,
    division: 800,
    achievementDate: '2024-01-15T12:00:00',
  },
  {
    matchType: 52,
    division: 900,
    achievementDate: '2024-02-20T08:30:00',
  },
];

// ─── Match List ──────────────────────────────────────────────────────────────

export const fcMatchListFixture: string[] = [
  '6572d9bbc7331d2a45f3d755',
  '6572da1bc7331d2a45f3d800',
  '6572da5bc7331d2a45f3d900',
];

// ─── All Match List ──────────────────────────────────────────────────────────

export const fcAllMatchListFixture: string[] = [
  '6572e0bbc7331d2a45f3e100',
  '6572e1bbc7331d2a45f3e200',
];

// ─── Match Detail ────────────────────────────────────────────────────────────

export const fcMatchDetailFixture: FcMatchDetail = {
  matchId: '6572d9bbc7331d2a45f3d755',
  matchDate: '2024-01-10T15:30:00',
  matchType: 50,
  matchInfo: [
    {
      ouid: 'fc-ouid-aabb1122334455667788',
      nickname: '테스트유저FC',
      matchDetail: {
        seasonId: 1,
        matchResult: '승',
        matchEndType: 0,
        systemPause: 0,
        foul: 3,
        injury: 0,
        redCards: 0,
        yellowCards: 1,
        dribble: 120,
        cornerKick: 4,
        possession: 55,
        OffsideCount: 1,
        averageRating: 7.2,
        controller: 'keyboard',
      },
      shoot: {
        shootTotal: 10,
        effectiveShootTotal: 5,
        shootOutScore: 0,
        goalTotal: 2,
        goalTotalDisplay: 2,
        ownGoal: 0,
        shootHeading: 1,
        goalHeading: 0,
        shootFreekick: 1,
        goalFreekick: 0,
        shootInPenalty: 4,
        goalInPenalty: 1,
        shootOutPenalty: 5,
        goalOutPenalty: 1,
        shootPenaltyKick: 1,
        goalPenaltyKick: 0,
      },
      shootDetail: [],
      pass: {
        passTry: 200,
        passSuccess: 170,
        shortPassTry: 150,
        shortPassSuccess: 135,
        longPassTry: 30,
        longPassSuccess: 20,
        bouncingLobPassTry: 5,
        bouncingLobPassSuccess: 3,
        drivenGroundPassTry: 10,
        drivenGroundPassSuccess: 8,
        throughPassTry: 5,
        throughPassSuccess: 4,
        lobbedThroughPassTry: 0,
        lobbedThroughPassSuccess: 0,
      },
      defence: {
        blockTry: 8,
        blockSuccess: 5,
        tackleTry: 12,
        tackleSuccess: 9,
      },
      player: [
        {
          spId: 272167135,
          spPosition: 18,
          spGrade: 5,
          status: {
            shoot: 3,
            effectiveShoot: 2,
            assist: 1,
            goal: 1,
            dribble: 30,
            intercept: 0,
            defending: 0,
            passTry: 25,
            passSuccess: 22,
            dribbleTry: 5,
            dribbleSuccess: 4,
            ballPossesionTry: 10,
            ballPossesionSuc: 8,
            aerialTry: 2,
            aerialSuccess: 1,
            blockTry: 0,
            block: 0,
            tackleTry: 0,
            tackle: 0,
            yellowCards: 0,
            redCards: 0,
            spRating: 8.5,
          },
        },
      ],
    },
  ],
};

// ─── Metadata ────────────────────────────────────────────────────────────────

export const fcMatchTypeMetaFixture: FcMatchTypeMeta[] = [
  { matchtype: 50, desc: '공식경기' },
  { matchtype: 52, desc: '감독모드' },
];
