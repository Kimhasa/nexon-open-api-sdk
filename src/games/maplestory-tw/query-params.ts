import type { TWDate, TWOcidDateRequest } from './types.js';

export type TWFormatQueryDate = (
  date: TWDate | undefined,
  availableFrom: string,
) => string | undefined;

export function requireNonBlank(value: string, parameter: string, guidance: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${parameter} must be a non-empty string. ${guidance}`);
  }
}

export function ocidDateParams(
  params: TWOcidDateRequest,
  formatDate: TWFormatQueryDate,
  availableFrom: string,
): { ocid: string; date: string | undefined } {
  requireNonBlank(params.ocid, 'ocid', 'Use the identifier returned by getOcid().');
  return { ocid: params.ocid, date: formatDate(params.date, availableFrom) };
}
