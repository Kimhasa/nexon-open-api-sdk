import type {
  TfdLeaderboardVoidErosionPurgeChallenge,
  TfdLeaderboardVoidInterceptBattle,
} from '../../../src/games/first-descendant/leaderboard/types.js';

// 리더보드 API는 API 키가 있어야 실응답을 볼 수 있다.
// 아래 값은 스펙 스키마로 합성한 가상 데이터이며 닉네임도 실제 계정이 아니다.

export const tfdLeaderboardVoidInterceptBattleFixture: TfdLeaderboardVoidInterceptBattle = {
  leaderboard: [
    {
      ranking: 1,
      score: '00:01:23.456',
      member: [
        {
          user_name: '테스트계승자#1234',
          mastery_rank_level: 30,
          descendant_id: '101000001',
          platform_type: 'Pc',
        },
      ],
    },
    {
      ranking: null,
      score: null,
      member: [
        { user_name: null, mastery_rank_level: null, descendant_id: null, platform_type: null },
      ],
    },
  ],
};

/** 기록이 없어 leaderboard가 null인 경우 (스펙상 nullable) */
export const tfdLeaderboardVoidInterceptBattleNullFixture: TfdLeaderboardVoidInterceptBattle = {
  leaderboard: null,
};

export const tfdLeaderboardVoidErosionPurgeChallengeFixture: TfdLeaderboardVoidErosionPurgeChallenge =
  {
    leaderboard: [
      {
        ranking: 1,
        score: '00:04:56.789',
        stage: '30',
        member: [
          {
            user_name: '테스트계승자#1234',
            mastery_rank_level: 30,
            descendant_id: '101000001',
            platform_type: 'Pc',
          },
          {
            user_name: '가상스쿼드원#5678',
            mastery_rank_level: 28,
            descendant_id: null,
            platform_type: 'Xbox',
          },
        ],
      },
    ],
  };
