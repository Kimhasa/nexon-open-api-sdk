import { NexonBadRequestError } from '../../core/errors/NexonBadRequestError.js';

export function assertNonBlank(value: string, parameter: string): void {
  if (!value.trim()) {
    throw new NexonBadRequestError(`Provide a non-empty value for ${parameter}.`, {
      code: 'OPENAPI00004',
    });
  }
}
