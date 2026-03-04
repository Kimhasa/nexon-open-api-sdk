import type { OCID, NexonDate } from '../../../core/types/branded.js';
import type { MWorldName } from '../guild/types.js';

// ─── 공통 요청 파라미터 ──────────────────────────────────────────────────────

/** 랭킹 기본 요청 파라미터 */
export interface MRankingBaseRequest {
  /** 조회 기준일 (KST, YYYY-MM-DD) */
  readonly date: NexonDate | string;
  /** 캐릭터 식별자 (특정 캐릭터 랭킹 조회 시) */
  readonly ocid?: OCID | undefined;
  /** 페이지 번호 */
  readonly page?: number | undefined;
}

/** 레벨 랭킹 요청 파라미터 */
export interface MLevelRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 무릉도장 랭킹 요청 파라미터 */
export interface MDojangRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 시간의 근원 랭킹 요청 파라미터 */
export interface MRootOfTimeRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 유니온 랭킹 요청 파라미터 */
export interface MUnionRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
}

/** 전투력 랭킹 요청 파라미터 */
export interface MCombatPowerRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 커닝M타워 랭킹 요청 파라미터 */
export interface MKerningMTowerRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
  /** 직업 및 전직 */
  readonly class?: string | undefined;
}

/** 업적 랭킹 요청 파라미터 */
export interface MAchievementRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
}

/** 샤레니안의 전장 랭킹 요청 파라미터 */
export interface MSharenianBattlefieldRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
}

/** 샤레니안의 지하수로 랭킹 요청 파라미터 */
export interface MSharenianWaterwayRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
}

// ─── GET /maplestorym/v1/ranking/level ───────────────────────────────────────

/** 레벨 랭킹 항목 */
export interface MLevelRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
}

/** 레벨 랭킹 응답 */
export interface MLevelRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MLevelRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/dojang ──────────────────────────────────────

/** 무릉도장 랭킹 항목 */
export interface MDojangRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
export interface MDojangRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MDojangRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/root-of-time ────────────────────────────────

/** 시간의 근원 랭킹 항목 */
export interface MRootOfTimeRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
  /** 시간의 근원 달성 층 */
  readonly root_of_time_floor: number;
  /** 시간의 근원 클리어 시간 기록 (초 단위) */
  readonly root_of_time_time_record: number;
}

/** 시간의 근원 랭킹 응답 */
export interface MRootOfTimeRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MRootOfTimeRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/union ───────────────────────────────────────

/** 유니온 랭킹 항목 */
export interface MUnionRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
export interface MUnionRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MUnionRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/combat-power ────────────────────────────────

/** 전투력 랭킹 항목 */
export interface MCombatPowerRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
  /** 전투력 */
  readonly combat_power: number;
}

/** 전투력 랭킹 응답 */
export interface MCombatPowerRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MCombatPowerRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/kerning-m-tower ─────────────────────────────

/** 커닝M타워 랭킹 항목 */
export interface MKerningMTowerRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
  /** 커닝M타워 달성 층 */
  readonly kerning_m_tower_floor: number;
  /** 커닝M타워 클리어 시간 기록 (초 단위) */
  readonly kerning_m_tower_time_record: number;
}

/** 커닝M타워 랭킹 응답 */
export interface MKerningMTowerRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MKerningMTowerRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/achievement ─────────────────────────────────

/** 업적 랭킹 항목 */
export interface MAchievementRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
export interface MAchievementRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MAchievementRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/sharenian-battlefield ───────────────────────

/** 샤레니안의 전장 랭킹 항목 */
export interface MSharenianBattlefieldRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
  /** 샤레니안의 전장 점수 */
  readonly sharenian_battlefield_score: number;
}

/** 샤레니안의 전장 랭킹 응답 */
export interface MSharenianBattlefieldRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MSharenianBattlefieldRankingItem[];
}

// ─── GET /maplestorym/v1/ranking/sharenian-waterway ──────────────────────────

/** 샤레니안의 지하수로 랭킹 항목 */
export interface MSharenianWaterwayRankingItem {
  /** 랭킹 업데이트 일자 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
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
  /** 샤레니안의 지하수로 점수 */
  readonly sharenian_waterway_score: number;
}

/** 샤레니안의 지하수로 랭킹 응답 */
export interface MSharenianWaterwayRanking {
  /** 랭킹 정보 */
  readonly ranking: readonly MSharenianWaterwayRankingItem[];
}
