const _warned = new Set<string>();

/**
 * 일회성 deprecation 경고를 출력한다.
 *
 * 동일한 `id`에 대해 프로세스 수명 동안 한 번만 경고합니다.
 *
 * @param id - 고유 식별자 (예: `'VCoreEquipment.slot_level'`)
 * @param message - 마이그레이션 안내를 포함한 메시지
 *
 * @example
 * ```ts
 * emitDeprecation(
 *   'VCoreEquipment.slot_level',
 *   'VCoreEquipment.slot_level은 2025-12-18부터 항상 0을 반환합니다. v_core_level을 사용하세요.',
 * );
 * ```
 */
export function emitDeprecation(id: string, message: string): void {
  if (_warned.has(id)) return;
  _warned.add(id);
  console.warn(`[nexon-sdk] DEPRECATED: ${message}`);
}

/**
 * 메서드를 deprecated로 표시하는 래퍼를 반환한다.
 *
 * 첫 호출 시 deprecation 경고를 출력한 뒤, 원본 함수에 위임합니다.
 *
 * @param id - 고유 식별자 (예: `'MapleStoryClient.getCharacterBasic'`)
 * @param message - 마이그레이션 안내를 포함한 메시지
 * @param fn - 원본 함수
 *
 * @example
 * ```ts
 * class MyClient {
 *   /** @deprecated Use getBasic() instead *​/
 *   getCharacterBasic = deprecated(
 *     'MyClient.getCharacterBasic',
 *     'getCharacterBasic()은 v1.0에서 제거됩니다. getBasic()을 사용하세요.',
 *     (params: OcidDateRequest) => this.getBasic(params),
 *   );
 * }
 * ```
 */
export function deprecated<TArgs extends unknown[], TReturn>(
  id: string,
  message: string,
  fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    emitDeprecation(id, message);
    return fn(...args);
  };
}

/**
 * deprecation 경고 기록을 초기화한다.
 *
 * @internal 테스트 전용. 프로덕션에서 사용하지 마세요.
 */
export function _resetDeprecationWarnings(): void {
  _warned.clear();
}
