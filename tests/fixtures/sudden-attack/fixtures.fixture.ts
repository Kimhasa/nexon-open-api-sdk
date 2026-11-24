import type {
  SuddenAttackMatchDetail,
  SuddenAttackMatchList,
  SuddenAttackOuid,
  SuddenAttackOuidResponse,
  SuddenAttackUserBasic,
  SuddenAttackUserRank,
  SuddenAttackUserRecentInfo,
  SuddenAttackUserTier,
} from '../../../src/games/sudden-attack/index.js';

const userName = '합성테스트유저';
const dateMatch = '2023-12-14T08:28:35Z';

export const suddenAttackOuidFixture: SuddenAttackOuidResponse = {
  ouid: 'test-sudden-attack-ouid' as SuddenAttackOuid,
};

export const suddenAttackUserBasicFixture: SuddenAttackUserBasic = {
  user_name: userName,
  user_date_create: '2023-12-14T08:28:35Z',
  title_name: '테스트 칭호',
  clan_name: '합성테스트클랜',
  manner_grade: '매너',
};

export const suddenAttackUserRankFixture: SuddenAttackUserRank = {
  user_name: userName,
  grade: '이병',
  grade_exp: 123,
  grade_ranking: 234,
  season_grade: '특등이병',
  season_grade_exp: 345,
  season_grade_ranking: 456,
};

export const suddenAttackUserTierFixture: SuddenAttackUserTier = {
  user_name: userName,
  solo_rank_match_tier: 2,
  solo_rank_match_score: 1200,
  party_rank_match_tier: 3,
  party_rank_match_score: 1500,
};

export const suddenAttackUserRecentInfoFixture: SuddenAttackUserRecentInfo = {
  user_name: userName,
  recent_win_rate: 50.5,
  recent_kill_death_rate: 52.2,
  recent_assault_rate: 49.2,
  recent_sniper_rate: 51.1,
  recent_special_rate: 53.1,
};

export const suddenAttackMatchListFixture: SuddenAttackMatchList = {
  match: [
    {
      match_id: 'test-sudden-attack-match-id',
      match_type: '퀵매치 클랜전',
      match_mode: '폭파미션',
      date_match: dateMatch,
      match_result: '1',
      kill: 10,
      death: 4,
      assist: 2,
    },
  ],
};

export const suddenAttackMatchDetailFixture: SuddenAttackMatchDetail = {
  match_id: 'test-sudden-attack-match-id',
  match_type: '퀵매치 클랜전',
  match_mode: '폭파미션',
  date_match: dateMatch,
  match_map: '제3보급창고',
  match_detail: [
    {
      team_id: '1',
      match_result: '1',
      user_name: userName,
      season_grade: '특등이병',
      clan_name: '합성테스트클랜',
      kill: 10,
      death: 4,
      headshot: 3,
      damage: 1350,
      assist: 2,
    },
  ],
};
