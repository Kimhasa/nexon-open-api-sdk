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
}

/** 무릉도장 랭킹 요청 파라미터 */
export interface MDojangRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
}

/** 시간의 근원 랭킹 요청 파라미터 */
export interface MRootOfTimeRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
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
}

/** 커닝M타워 랭킹 요청 파라미터 */
export interface MKerningMTowerRankingRequest extends MRankingBaseRequest {
  /** 월드 명 */
  readonly world_name?: MWorldName | undefined;
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

// ─── 랭킹 응답 ──────────────────────────────────────────────────────────────

/** 레벨 랭킹 항목 */
export interface MLevelRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly character_class: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 길드 명 */
  readonly guild_name: string;
  /** 길드 마크 아이콘 */
  readonly guild_mark_icon: string;
}

/** GET /maplestorym/v1/ranking/level 응답 */
export interface MLevelRanking {
  /** 랭킹 목록 */
  readonly ranking: MLevelRankingItem[];
}

/** 무릉도장 랭킹 항목 */
export interface MDojangRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly character_class: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 무릉도장 층수 */
  readonly dojang_floor: number;
  /** 길드 명 */
  readonly guild_name: string;
}

/** GET /maplestorym/v1/ranking/dojang 응답 */
export interface MDojangRanking {
  /** 랭킹 목록 */
  readonly ranking: MDojangRankingItem[];
}

/** 시간의 근원 랭킹 항목 */
export interface MRootOfTimeRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly character_class: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 최대 데미지 */
  readonly max_damage: number;
  /** 길드 명 */
  readonly guild_name: string;
}

/** GET /maplestorym/v1/ranking/root-of-time 응답 */
export interface MRootOfTimeRanking {
  /** 랭킹 목록 */
  readonly ranking: MRootOfTimeRankingItem[];
}

/** 유니온 랭킹 항목 */
export interface MUnionRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly character_class: string;
  /** 유니온 등급 */
  readonly union_grade: string;
  /** 유니온 등급 아이콘 */
  readonly union_grade_icon: string;
  /** 유니온 레벨 */
  readonly union_level: number;
  /** 길드 명 */
  readonly guild_name: string;
}

/** GET /maplestorym/v1/ranking/union 응답 */
export interface MUnionRanking {
  /** 랭킹 목록 */
  readonly ranking: MUnionRankingItem[];
}

/** 전투력 랭킹 항목 */
export interface MCombatPowerRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly character_class: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 캐릭터 전투력 */
  readonly character_combat_power: number;
  /** 길드 명 */
  readonly guild_name: string;
}

/** GET /maplestorym/v1/ranking/combat-power 응답 */
export interface MCombatPowerRanking {
  /** 랭킹 목록 */
  readonly ranking: MCombatPowerRankingItem[];
}

/** 커닝M타워 랭킹 항목 */
export interface MKerningMTowerRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 직업 명 */
  readonly character_class: string;
  /** 캐릭터 레벨 */
  readonly character_level: number;
  /** 최고 도달 층 */
  readonly tower_floor: number;
  /** 길드 명 */
  readonly guild_name: string;
}

/** GET /maplestorym/v1/ranking/kerning-m-tower 응답 */
export interface MKerningMTowerRanking {
  /** 랭킹 목록 */
  readonly ranking: MKerningMTowerRankingItem[];
}

/** 대표 명예 배지 정보 */
export interface MHonorBadge {
  /** 대표 명예 배지 번호 */
  readonly badge_no: number;
  /** 대표 명예 배지 명 */
  readonly badge_name: string;
  /** 대표 명예 배지 착용 옵션 */
  readonly badge_option: string;
  /** 대표 명예 배지 아이콘 */
  readonly badge_icon: string;
}

/** 업적 랭킹 항목 */
export interface MAchievementRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 캐릭터 명 */
  readonly character_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 업적 점수 */
  readonly achievement_score: number;
  /** 업적 등급 명 */
  readonly achievement_grade_name: string;
  /** 업적 등급 아이콘 */
  readonly achievement_grade_icon: string;
  /** 대표 명예 배지 정보 */
  readonly main_honor_badge: MHonorBadge[];
}

/** GET /maplestorym/v1/ranking/achievement 응답 */
export interface MAchievementRanking {
  /** 랭킹 목록 */
  readonly ranking: MAchievementRankingItem[];
}

/** 샤레니안 길드 랭킹 항목 (전장/지하수로 공용) */
export interface MSharenianRankingItem {
  /** 랭킹 조회 기준일 (KST) */
  readonly date: string;
  /** 랭킹 순위 */
  readonly ranking: number;
  /** 월드 랭킹 순위 */
  readonly world_ranking: number;
  /** 길드 명 */
  readonly guild_name: string;
  /** 월드 명 */
  readonly world_name: string;
  /** 길드 마스터 캐릭터 명 */
  readonly guild_master_name: string;
  /** 길드 아이콘 */
  readonly guild_mark_icon: string;
  /** 시즌 점수 */
  readonly season_score: string;
  /** 등급 아이콘 */
  readonly grade_icon: string;
}

/** GET /maplestorym/v1/ranking/sharenian-battlefield 응답 */
export interface MSharenianBattlefieldRanking {
  /** 랭킹 목록 */
  readonly ranking: MSharenianRankingItem[];
}

/** GET /maplestorym/v1/ranking/sharenian-waterway 응답 */
export interface MSharenianWaterwayRanking {
  /** 랭킹 목록 */
  readonly ranking: MSharenianRankingItem[];
}
