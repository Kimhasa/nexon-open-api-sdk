/**
 * 브랜드 타입 유틸리티.
 *
 * 동일한 `string` 타입이지만 의미가 다른 식별자들을 컴파일 타임에 구분하여
 * 잘못된 인자 전달 실수를 방지합니다.
 *
 * 게임별 브랜드 타입(OCID, GuildId, OUID 등)은 각 게임 모듈에서 정의합니다.
 * @internal
 */

declare const __brand: unique symbol;
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * 브랜드 타입을 원시 타입으로 벗겨내는 유틸리티 타입.
 * @internal
 */
export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;
