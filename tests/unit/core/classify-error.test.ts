import { describe, it, expect } from 'vitest';
import { classifyError } from '../../../src/core/errors/classify-error.js';
import { NexonRateLimitError } from '../../../src/core/errors/NexonRateLimitError.js';
import { NexonAuthError } from '../../../src/core/errors/NexonAuthError.js';
import { NexonNotFoundError } from '../../../src/core/errors/NexonNotFoundError.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonDataNotReadyError } from '../../../src/core/errors/NexonDataNotReadyError.js';
import { NexonServerError } from '../../../src/core/errors/NexonServerError.js';
import { NexonMaintenanceError } from '../../../src/core/errors/NexonMaintenanceError.js';
import { NexonError } from '../../../src/core/errors/NexonError.js';
import { NEXON_ERROR_CODES } from '../../../src/core/errors/error-codes.js';
import type { NexonErrorCode } from '../../../src/core/errors/error-codes.js';

const makePayload = (
  name: string,
  message = 'Test error',
): { error: { name: NexonErrorCode; message: string } } => ({
  error: { name: name as NexonErrorCode, message },
});

type ErrorClass = new (...args: never[]) => NexonError;

/**
 * 넥슨 포털 응답코드 표 (https://openapi.nexon.com/ko/guide/request-api/, 2026-11-24 확인).
 * status 는 표의 HTTP 상태, hint 는 힌트에 반드시 들어가야 하는 핵심 단어.
 */
const PORTAL_TABLE: ReadonlyArray<{
  code: string;
  status: number;
  meaning: string;
  cls: ErrorClass;
  expectedStatus: number;
  hint: readonly string[];
}> = [
  {
    code: 'OPENAPI00001',
    status: 500,
    meaning: '서버 내부 오류',
    cls: NexonServerError,
    expectedStatus: 500,
    hint: ['NEXON Open API 서버에 문제', '잠시 뒤'],
  },
  {
    code: 'OPENAPI00002',
    status: 403,
    meaning: '권한이 없는 경우',
    cls: NexonAuthError,
    expectedStatus: 403,
    hint: ['이 API Key로는 이 API를 쓸 수 없습니다', '게임마다 따로'],
  },
  {
    code: 'OPENAPI00003',
    status: 400,
    meaning: '유효하지 않은 식별자',
    cls: NexonNotFoundError,
    expectedStatus: 400,
    hint: ['찾을 수 없습니다', '월드·서버', '식별자(ocid·ouid)', '이름으로 다시'],
  },
  {
    code: 'OPENAPI00004',
    status: 400,
    meaning: '파라미터 누락 또는 유효하지 않음',
    cls: NexonBadRequestError,
    expectedStatus: 400,
    hint: ['빠졌거나 형식이 틀린 값', '이름', 'YYYY-MM-DD', '번호'],
  },
  {
    code: 'OPENAPI00005',
    status: 400,
    meaning: '유효하지 않은 API Key',
    cls: NexonAuthError,
    expectedStatus: 400,
    hint: ['API Key가 올바르지 않습니다', '공백', '따옴표', '새로 발급'],
  },
  {
    code: 'OPENAPI00006',
    status: 400,
    meaning: '유효하지 않은 게임 또는 API PATH',
    cls: NexonAuthError,
    expectedStatus: 400,
    hint: ['게임마다 따로 발급', '조회하려는 게임의 애플리케이션', '최신 버전'],
  },
  {
    code: 'OPENAPI00007',
    status: 429,
    meaning: 'API 호출량 초과',
    cls: NexonRateLimitError,
    expectedStatus: 429,
    hint: ['호출 허용량을 초과했습니다', '잠시 뒤'],
  },
  {
    code: 'OPENAPI00009',
    status: 400,
    meaning: '데이터 준비 중',
    cls: NexonDataNotReadyError,
    expectedStatus: 400,
    hint: ['아직 준비되지 않았습니다', '하루 전', '오전 2시', '오전 9시 30분'],
  },
  {
    code: 'OPENAPI00010',
    status: 400,
    meaning: '게임 점검 중',
    cls: NexonMaintenanceError,
    expectedStatus: 400,
    hint: ['게임이 점검 중', '점검이 끝난 뒤'],
  },
  {
    code: 'OPENAPI00011',
    status: 503,
    meaning: 'API 점검 중',
    cls: NexonMaintenanceError,
    expectedStatus: 503,
    hint: ['NEXON Open API가 점검 중', 'client.platform.getNoticeList()'],
  },
];

describe('classifyError', () => {
  describe('포털 응답코드 표', () => {
    it.each(PORTAL_TABLE)(
      '$code ($meaning) → 클래스, code, status, 원문, 힌트',
      ({ code, status, cls, expectedStatus, hint }) => {
        const err = classifyError(status, makePayload(code, 'Raw server text'));

        expect(err).toBeInstanceOf(cls);
        expect(err).toBeInstanceOf(NexonError);
        expect(err.code).toBe(code);
        expect(err.status).toBe(expectedStatus);
        expect(err.nexonMessage).toBe('Raw server text');
        expect(err.message).toContain(`[${code}] Raw server text`);
        expect(err.message).toContain('→');
        for (const word of hint) {
          expect(err.message).toContain(word);
        }
      },
    );

    it('어떤 힌트에도 근거 없는 "오전 1시" 가 없다', () => {
      for (const { code, status } of PORTAL_TABLE) {
        expect(classifyError(status, makePayload(code)).message).not.toContain('오전 1시');
      }
    });
  });

  describe('다른 게임용 키 또는 유효하지 않은 API 주소 (OPENAPI00006)', () => {
    it.each([
      ['maplestory', '메이플스토리'],
      ['maplestorym', '메이플스토리M'],
      ['maplestorysea', 'MapleStorySEA'],
      ['maplestorytw', 'MapleStoryTaiwan'],
      ['fconline', 'EA SPORTS FC 온라인'],
      ['tfd', '퍼스트 디센던트'],
      ['heroes', '마비노기 영웅전'],
      ['suddenattack', '서든어택'],
      ['kartrush', '카트라이더 러쉬플러스'],
      ['baram', '바람의나라'],
      ['mabinogi', '마비노기'],
      ['baramy', '바람의나라: 연'],
      ['v4', 'V4'],
      ['hit2', '히트2'],
      ['platform', 'NEXON Open API 공지'],
    ])('/%s 경로가 거부되면 %s 이름을 안내한다', (prefix, game) => {
      const payload = makePayload('OPENAPI00006', 'Invalid game or path');
      const err = classifyError(403, payload, undefined, {
        url: `https://open.api.nexon.com/${prefix}/v1/id`,
      });

      expect(err).toBeInstanceOf(NexonAuthError);
      expect(err.status).toBe(403);
      expect(err.code).toBe('OPENAPI00006');
      expect(err.nexonMessage).toBe('Invalid game or path');
      expect(err.message).toContain(`${game} API`);
      expect(err.message).toContain(`${game}용 애플리케이션`);
      expect(err.message).toContain('https://openapi.nexon.com/ko/my-application/');
    });

    it.each([undefined, 'not-a-url', 'https://open.api.nexon.com/unknown/maplestory'])(
      '첫 경로에서 게임을 알 수 없으면 일반 안내를 표시한다 (%s)',
      (url) => {
        const err = classifyError(400, makePayload('OPENAPI00006'), undefined, { url });

        expect(err).toBeInstanceOf(NexonAuthError);
        expect(err.message).toContain('이 API Key로는 이 API를 부를 수 없습니다');
        expect(err.message).not.toContain('메이플스토리');
      },
    );
  });

  describe('점검 (OPENAPI00010, OPENAPI00011)', () => {
    it.each([
      ['OPENAPI00010', 400],
      ['OPENAPI00011', 503],
    ])('%s 는 NexonMaintenanceError 이면서 NexonServerError 이다', (code, status) => {
      const err = classifyError(status, makePayload(code));
      expect(err).toBeInstanceOf(NexonMaintenanceError);
      expect(err).toBeInstanceOf(NexonServerError);
      expect(err.name).toBe('NexonMaintenanceError');
      expect(err).not.toBeInstanceOf(NexonDataNotReadyError);
    });

    it('status 는 서버가 준 값을 그대로 담는다', () => {
      expect(classifyError(400, makePayload('OPENAPI00011')).status).toBe(400);
      expect(classifyError(503, makePayload('OPENAPI00010')).status).toBe(503);
    });

    it('OPENAPI00010 은 더 이상 NexonDataNotReadyError 가 아니다', () => {
      const err = classifyError(400, makePayload('OPENAPI00010'));
      expect(err).not.toBeInstanceOf(NexonDataNotReadyError);
      expect(err.message).not.toContain('데이터');
    });
  });

  describe('표에 없는 응답', () => {
    it('OPENAPI00008 → 일반 NexonServerError (점검이라고 하지 않는다)', () => {
      const err = classifyError(500, makePayload('OPENAPI00008', 'Raw server text'));
      expect(err).toBeInstanceOf(NexonServerError);
      expect(err).not.toBeInstanceOf(NexonMaintenanceError);
      expect(err.code).toBe('OPENAPI00008');
      expect(err.status).toBe(500);
      expect(err.nexonMessage).toBe('Raw server text');
      expect(err.message).not.toContain('점검');
    });

    it('알 수 없는 코드 → NexonError (base), 코드와 상태와 원문을 그대로 담는다', () => {
      const err = classifyError(418, makePayload('UNKNOWN_CODE', 'Raw server text'));
      expect(err).toBeInstanceOf(NexonError);
      expect(err.constructor).toBe(NexonError);
      expect(err.code).toBe('UNKNOWN_CODE');
      expect(err.status).toBe(418);
      expect(err.nexonMessage).toBe('Raw server text');
      expect(err.message).toBe('[UNKNOWN_CODE] Raw server text');
    });

    it('HTTP 429 (코드 없어도) → NexonRateLimitError', () => {
      const err = classifyError(429, undefined);
      expect(err).toBeInstanceOf(NexonRateLimitError);
      expect(err.nexonMessage).toBeUndefined();
    });

    it('HTTP 500 (코드 없어도) → NexonServerError', () => {
      const err = classifyError(500, undefined);
      expect(err).toBeInstanceOf(NexonServerError);
      expect(err).not.toBeInstanceOf(NexonMaintenanceError);
      expect(err.status).toBe(500);
      expect(err.code).toBeUndefined();
      expect(err.nexonMessage).toBeUndefined();
    });

    it('HTTP 503 (코드 없어도) → 일반 NexonServerError', () => {
      const err = classifyError(503, undefined);
      expect(err).toBeInstanceOf(NexonServerError);
      expect(err).not.toBeInstanceOf(NexonMaintenanceError);
    });
  });

  it('OPENAPI00007 → retryAfterMs 를 담는다', () => {
    const err = classifyError(429, makePayload('OPENAPI00007'), 1000);
    expect(err).toBeInstanceOf(NexonRateLimitError);
    expect((err as NexonRateLimitError).retryAfterMs).toBe(1000);
  });

  it('실서버처럼 HTTP 400 + OPENAPI00005 여도 NexonAuthError 이고 status 는 400 이다', () => {
    const err = classifyError(400, makePayload('OPENAPI00005', 'The apikey is not valid.'));
    expect(err).toBeInstanceOf(NexonAuthError);
    expect(err.status).toBe(400);
    expect(err.nexonMessage).toBe('The apikey is not valid.');
  });

  it('에러 메시지에 원문 메시지가 포함된다', () => {
    const err = classifyError(403, makePayload('OPENAPI00002', 'Invalid API key'));
    expect(err.message).toContain('Invalid API key');
  });
});

describe('NEXON_ERROR_CODES', () => {
  it('포털 표의 의미에 맞는 새 키가 있다', () => {
    expect(NEXON_ERROR_CODES.INVALID_API_KEY).toBe('OPENAPI00005');
    expect(NEXON_ERROR_CODES.INVALID_GAME_OR_PATH).toBe('OPENAPI00006');
    expect(NEXON_ERROR_CODES.GAME_MAINTENANCE).toBe('OPENAPI00010');
    expect(NEXON_ERROR_CODES.API_MAINTENANCE).toBe('OPENAPI00011');
  });

  it('기존 키와 값은 그대로다 (deprecated 포함)', () => {
    expect(NEXON_ERROR_CODES).toMatchObject({
      SERVER_ERROR: 'OPENAPI00001',
      UNAUTHORIZED: 'OPENAPI00002',
      NOT_FOUND: 'OPENAPI00003',
      BAD_REQUEST: 'OPENAPI00004',
      FORBIDDEN: 'OPENAPI00005',
      INVALID_PARAM: 'OPENAPI00006',
      RATE_LIMIT: 'OPENAPI00007',
      MAINTENANCE: 'OPENAPI00008',
      DATA_NOT_READY: 'OPENAPI00009',
      DATA_PREPARING: 'OPENAPI00010',
      SERVER_OVERLOAD: 'OPENAPI00011',
    });
  });
});
