import { describe, expect, it } from 'vitest';
import { lookupByName, requireFoundId } from '../../../src/core/errors/name-lookup.js';
import { NexonBadRequestError } from '../../../src/core/errors/NexonBadRequestError.js';
import { NexonNotFoundError } from '../../../src/core/errors/NexonNotFoundError.js';
import { NexonServerError } from '../../../src/core/errors/NexonServerError.js';

const notFound = {
  message: "'캐릭터명' 캐릭터를 찾을 수 없습니다.",
  hint: '캐릭터 이름의 띄어쓰기와 대소문자를 확인하세요.',
};

describe('lookupByName', () => {
  it('성공하면 결과를 그대로 돌려준다', async () => {
    await expect(lookupByName(() => Promise.resolve('ocid-1'), notFound)).resolves.toBe('ocid-1');
  });

  it('넥슨의 OPENAPI00004 를 NexonNotFoundError 로 바꾸고 원래 코드와 원문을 남긴다', async () => {
    const original = new NexonBadRequestError('[OPENAPI00004] Please input valid parameter', {
      code: 'OPENAPI00004',
      nexonMessage: 'Please input valid parameter',
    });
    const error: unknown = await lookupByName(() => Promise.reject(original), notFound).catch(
      (err: unknown) => err,
    );
    expect(error).toBeInstanceOf(NexonNotFoundError);
    expect(error).toMatchObject({
      code: 'OPENAPI00004',
      status: 400,
      nexonMessage: 'Please input valid parameter',
      cause: original,
    });
    expect((error as Error).message).toContain("'캐릭터명' 캐릭터를 찾을 수 없습니다.");
    expect((error as Error).message).toContain('→ 캐릭터 이름의 띄어쓰기');
  });

  it('다른 에러는 그대로 던진다', async () => {
    const server = new NexonServerError('[OPENAPI00001] error', {
      status: 500,
      code: 'OPENAPI00001',
    });
    await expect(lookupByName(() => Promise.reject(server), notFound)).rejects.toBe(server);
    const other = new NexonBadRequestError('bad', { code: 'OPENAPI00006' });
    await expect(lookupByName(() => Promise.reject(other), notFound)).rejects.toBe(other);
  });
});

describe('requireFoundId', () => {
  it('고유 번호가 있으면 그대로 돌려준다', () => {
    expect(requireFoundId('oguild-1', notFound)).toBe('oguild-1');
  });

  it.each([null, undefined, ''])('%s 이면 NexonNotFoundError (status 200, code 없음)', (id) => {
    let error: unknown;
    try {
      requireFoundId(id, notFound);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NexonNotFoundError);
    expect(error).toMatchObject({ status: 200, code: undefined });
  });
});
