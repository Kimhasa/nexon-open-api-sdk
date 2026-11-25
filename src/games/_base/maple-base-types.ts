// ─── Brand 기반 ──────────────────────────────────────────────────────────────

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * 캐릭터 식별자(ocid).
 *
 * 메이플스토리 패밀리(KMS, M, SEA, TW) 전용 브랜드 타입입니다.
 * `getOcid()` 로 획득합니다.
 */
export type OCID = Brand<string, 'OCID'>;

/**
 * NEXON Open API 날짜 형식 (YYYY-MM-DD).
 *
 * 메이플스토리 패밀리(KMS, M, SEA, TW)의 날짜 파라미터에 사용됩니다.
 * `toNexonDate()` 헬퍼로 생성합니다.
 */
export type NexonDate = Brand<string, 'NexonDate'>;

/**
 * 길드 식별자.
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
   *
   * - 생략하면 가장 최근 데이터를 조회합니다. 게임에서 바뀐 내용은 평균 15분 뒤 반영됩니다.
   * - 날짜를 넣으면 그날 0시~24시의 데이터를 조회합니다.
   * - 지난 날짜의 데이터는 다음날 오전 2시부터 조회할 수 있습니다.
   *
   * 날짜와 시각의 기준은 게임 지역 시각입니다 (메이플스토리는 KST, MapleStorySEA·MapleStoryTaiwan은 UTC+8).
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
  /**
   * 조회 기준일 (YYYY-MM-DD).
   *
   * - 생략하면 가장 최근 데이터를 조회합니다. 게임에서 바뀐 내용은 평균 15분 뒤 반영됩니다.
   * - 날짜를 넣으면 그날 0시~24시의 데이터를 조회합니다.
   * - 지난 날짜의 데이터는 다음날 오전 2시부터 조회할 수 있습니다.
   *
   * 날짜와 시각의 기준은 게임 지역 시각입니다 (메이플스토리는 KST, MapleStorySEA·MapleStoryTaiwan은 UTC+8).
   */
  readonly date?: NexonDate | string;
}
