// ─── GET /heroes/v2/meta/enchant ────────────────────────────────────────────

/** 접두/접미 타입. `"0"`: 접두 인챈트, `"1"`: 접미 인챈트 (숫자가 아닌 문자열) */
export type HeroesEnchantType = '0' | '1';

/** 인챈트 메타 데이터 조회 요청 파라미터 */
export interface HeroesEnchantMetaRequest {
  /** 접두/접미 타입. `"0"`: 접두 인챈트, `"1"`: 접미 인챈트 */
  readonly enchant_type: HeroesEnchantType;
  /** 인챈트 명 */
  readonly enchant_name: string;
}

/** 인챈트 메타 데이터 응답 */
export interface HeroesEnchantMeta {
  /** 인챈트 등급. 숫자가 아닌 문자열로 온다 (포털 스펙은 숫자로 적지만 2026-11-24 실제 응답은 문자열) */
  readonly enchant_grade: string;
  /** 인챈트 가능 부위 */
  readonly enchant_available_slot_name: readonly string[];
  /** 인챈트 능력치 (능력치 설명 문자열 목록) */
  readonly enchant_stat: readonly string[];
}
