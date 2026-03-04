import type { OCID, NexonDate } from '../../../core/types/branded.js';
import type { WorldName } from '../guild/types.js';

// ─── 공통 요청 파라미터 ──────────────────────────────────────────────────────

/** 랭킹 기본 요청 파라미터 */
export interface RankingBaseRequest {
  /** 조회 기준일 (KST, YYYY-MM-DD) */
  readonly date: NexonDate | string;
  /** 캐릭터 식별자 (특정 캐릭터 랭킹 조회 시) */
  readonly ocid?: OCID | undefined;
  /** 페이지 번호 */
  readonly page?: number | undefined;
}

/** 종합 랭킹 요청 파라미터 */
export interface OverallRankingRequest extends RankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: WorldName | (string & {}) | undefined;
  /** 월드 타입 (0: 일반, 1: 에오스/핼리오스). world_name 입력 시 미 반영 */
  readonly world_type?: 0 | 1 | undefined;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 유니온 랭킹 요청 파라미터 */
export interface UnionRankingRequest extends RankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: WorldName | (string & {}) | undefined;
}

/** 길드 랭킹 요청 파라미터 */
export interface GuildRankingRequest extends RankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: WorldName | (string & {}) | undefined;
  /** 랭킹 타입 (0: 주간 명성치, 1: 플래그 레이스, 2: 지하 수로) */
  readonly ranking_type: 0 | 1 | 2;
  /** 길드 명 */
  readonly guild_name?: string | undefined;
}

/** 무릉도장 랭킹 요청 파라미터 */
export interface DojangRankingRequest extends RankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: WorldName | (string & {}) | undefined;
  /** 구간 (0: 일반, 1: 통달) */
  readonly difficulty: 0 | 1;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 더 시드 랭킹 요청 파라미터 */
export interface TheSeedRankingRequest extends RankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: WorldName | (string & {}) | undefined;
}

// ─── GET /maplestory/v1/ranking/overall ──────────────────────────────────────

/** 종합 랭킹 항목 */
export interface OverallRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 종합 랭킹 순위 */
  readonly ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly class_name: string;
  /** 전직 직업 명 */
  readonly sub_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 캐릭터 경험치 */
  readonly character_exp: number;
  /** 캐릭터 인기도 */
  readonly character_popularity: number;
  /** 길드 명 */
  readonly character_guildname: string;
}

/** 종합 랭킹 응답 */
export interface OverallRanking {
  /** 종합 랭킹 정보 */
  readonly ranking: readonly OverallRankingItem[];
}

// ─── GET /maplestory/v1/ranking/union ────────────────────────────────────────

/** 유니온 랭킹 항목 */
export interface UnionRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 유니온 랭킹 순위 */
  readonly ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly class_name: string;
  /** 전직 직업 명 */
  readonly sub_class_name: string;
  /** 유니온 레벨 */
  readonly union_level: number;
  /** 유니온 파워 */
  readonly union_power: number;
}

/** 유니온 랭킹 응답 */
export interface UnionRanking {
  /** 유니온 랭킹 정보 */
  readonly ranking: readonly UnionRankingItem[];
}

// ─── GET /maplestory/v1/ranking/guild ────────────────────────────────────────

/** 길드 랭킹 항목 */
export interface GuildRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 길드 랭킹 순위 */
  readonly ranking: number;
  /** 길드 명 */
  readonly guild_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 길드 레벨 */
  readonly guild_level: number;
  /** 길드 마스터 캐릭터 명 */
  readonly guild_master_name: string;
  /** 길드 마크 */
  readonly guild_mark: string;
  /** 길드 포인트 */
  readonly guild_point: number;
}

/** 길드 랭킹 응답 */
export interface GuildRanking {
  /** 길드 랭킹 정보 */
  readonly ranking: readonly GuildRankingItem[];
}

// ─── GET /maplestory/v1/ranking/dojang ───────────────────────────────────────

/** 무릉도장 랭킹 항목 */
export interface DojangRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 무릉도장 랭킹 순위 */
  readonly ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly class_name: string;
  /** 전직 직업 명 */
  readonly sub_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 무릉도장 구간 */
  readonly dojang_floor: number;
  /** 무릉도장 클리어 시간 기록 (초 단위) */
  readonly dojang_time_record: number;
}

/** 무릉도장 랭킹 응답 */
export interface DojangRanking {
  /** 무릉도장 랭킹 정보 */
  readonly ranking: readonly DojangRankingItem[];
}

// ─── GET /maplestory/v1/ranking/theseed ──────────────────────────────────────

/** 더 시드 랭킹 항목 */
export interface TheSeedRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 더 시드 랭킹 순위 */
  readonly ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly class_name: string;
  /** 전직 직업 명 */
  readonly sub_class_name: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 더 시드 도달 층 */
  readonly theseed_floor: number;
  /** 더 시드 클리어 시간 기록 (초 단위) */
  readonly theseed_time_record: number;
}

/** 더 시드 랭킹 응답 */
export interface TheSeedRanking {
  /** 더 시드 랭킹 정보 */
  readonly ranking: readonly TheSeedRankingItem[];
}

// ─── GET /maplestory/v1/ranking/achievement ──────────────────────────────────

/** 업적 랭킹 항목 */
export interface AchievementRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 업적 랭킹 순위 */
  readonly ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly class_name: string;
  /** 전직 직업 명 */
  readonly sub_class_name: string;
  /** 업적 등급 */
  readonly trophy_grade: string;
  /** 업적 점수 */
  readonly trophy_score: number;
}

/** 업적 랭킹 응답 */
export interface AchievementRanking {
  /** 업적 랭킹 정보 */
  readonly ranking: readonly AchievementRankingItem[];
}
