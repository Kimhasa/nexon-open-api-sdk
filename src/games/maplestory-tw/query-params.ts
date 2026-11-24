import { assertNonEmptyString } from '../../core/validation/input.js';
import type { TWDate, TWOcidDateRequest } from './types.js';

export type TWFormatQueryDate = (
  date: TWDate | undefined,
  availableFrom: string,
) => string | undefined;

export function ocidDateParams(
  params: TWOcidDateRequest,
  formatDate: TWFormatQueryDate,
  availableFrom: string,
): { ocid: string; date: string | undefined } {
  assertNonEmptyString(params.ocid, 'ocid', 'Use the identifier returned by getOcid().');
  return { ocid: params.ocid, date: formatDate(params.date, availableFrom) };
}
