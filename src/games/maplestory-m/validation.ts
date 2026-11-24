export function assertNonBlank(value: string, message: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(message);
  }
}

export function assertOcid(ocid: string): void {
  assertNonBlank(ocid, 'ocid가 비어 있습니다. maplestorym.getOcid()로 캐릭터 식별자를 조회하세요.');
}
