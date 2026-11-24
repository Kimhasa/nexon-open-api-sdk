import type { ShapeDescriptor } from '../../core/validation/response-shape.js';

/**
 * 넥슨 Open API 플랫폼 응답 shape descriptors.
 *
 * 각 엔드포인트의 top-level 키와 타입을 정의합니다.
 * `responseValidation: true` 시 런타임에서 응답 shape drift를 감지하는 데 사용됩니다.
 */

// ─── Notice ─────────────────────────────────────────────────────────────────

export const PLATFORM_NOTICE_LIST_SHAPE: ShapeDescriptor = {
  expectedKeys: {
    notice: 'array',
  },
};
