/**
 * 브랜드 타입 기반 타입 시스템.
 *
 * 동일한 `string` 타입이지만 의미가 다른 식별자들을 컴파일 타임에 구분하여
 * 잘못된 인자 전달 실수를 방지합니다.
 *
 * @example
 * ```ts
 * // 런타임 400 에러 — 컴파일 타임에 잡히지 않음
 * client.character.getBasic({ ocid: guildId });
 *
 * // 브랜드 타입 사용 시 컴파일 에러
 * // Argument of type 'GuildId' is not assignable to parameter of type 'OCID'
 * ```
 */

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * 캐릭터 고유 식별자 (OCID).
 * `MapleStoryClient.getOcid()` 또는 `getBasicByName()` 로 획득합니다.
 */
export type OCID = Brand<string, 'OCID'>;

/**
 * 길드 고유 식별자.
 * `MapleStoryClient.guild.getOguildId()` 로 획득합니다.
 */
export type GuildId = Brand<string, 'GuildId'>;

/**
 * EA SPORTS FC Online 계정 고유 식별자 (OUID).
 * `FcOnlineClient.getOuid()` 로 획득합니다.
 */
export type OUID = Brand<string, 'OUID'>;

/**
 * Nexon Open API 날짜 형식 (YYYY-MM-DD).
 * `toNexonDate()` 헬퍼로 생성합니다.
 */
export type NexonDate = Brand<string, 'NexonDate'>;

/**
 * 브랜드 타입을 원시 타입으로 벗겨내는 유틸리티 타입.
 * @internal
 */
export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;
