// ─── Brand 기반 ──────────────────────────────────────────────────────────────

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * 캐릭터 고유 식별자 (OCID).
 *
 * 메이플스토리 패밀리(KMS, M, SEA, TW) 전용 브랜드 타입입니다.
 * `getOcid()` 로 획득합니다.
 */
export type OCID = Brand<string, 'OCID'>;

/**
 * Nexon Open API 날짜 형식 (YYYY-MM-DD).
 *
 * 메이플스토리 패밀리(KMS, M, SEA, TW)의 날짜 파라미터에 사용됩니다.
 * `toNexonDate()` 헬퍼로 생성합니다.
 */
export type NexonDate = Brand<string, 'NexonDate'>;

/**
 * 길드 고유 식별자.
 *
 * 메이플스토리 패밀리(KMS, M, SEA, TW) 전용 브랜드 타입입니다.
 * `guild.getId()` 로 획득합니다.
 */
export type GuildId = Brand<string, 'GuildId'>;

// ─── 요청 파라미터 ────────────────────────────────────────────────────────────

/** OCID 기반 기본 요청 파라미터 */
export interface OcidRequest {
  readonly ocid: OCID;
}

/** OCID + 날짜 기반 요청 파라미터 */
export interface OcidDateRequest {
  readonly ocid: OCID;
  /**
   * 조회 기준일 (YYYY-MM-DD).
   * 생략 시 전일 데이터를 반환합니다.
   */
  readonly date?: NexonDate | string;
}

/** 길드 ID 기반 기본 요청 파라미터 */
export interface GuildIdRequest {
  readonly oguild_id: GuildId;
}

/** 길드 ID + 날짜 기반 요청 파라미터 */
export interface GuildIdDateRequest {
  readonly oguild_id: GuildId;
  readonly date?: NexonDate | string;
}
