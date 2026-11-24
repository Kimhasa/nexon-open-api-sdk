import { describe, expect, it } from 'vitest';
import { maskIdentifier, maskIdentifiers } from '../../../src/index.js';

describe('maskIdentifier', () => {
  it('앞 8자 뒤에 말줄임표를 붙인다', () => {
    expect(maskIdentifier('0123456789abcdef')).toBe('01234567…');
  });

  it.each(['', 'id', '01234567'])('8자 이하인 %j는 그대로 반환한다', (value) => {
    expect(maskIdentifier(value)).toBe(value);
  });
});

describe('maskIdentifiers', () => {
  const baseUrl = 'https://open.api.nexon.com/maplestory/v1/character/basic';

  it('캐릭터·계정·길드 고유 번호와 같은 이름의 여러 값을 모두 가린다', () => {
    const url = new URL(
      maskIdentifiers(
        `${baseUrl}?ocid=character-id&%6Fcid=another-character&ouid=account-id&oguild_id=guild-id-123&OCID=short`,
      ),
    );

    expect(url.searchParams.getAll('ocid')).toEqual(['characte…', 'another-…']);
    expect(url.searchParams.get('ouid')).toBe('account-…');
    expect(url.searchParams.get('oguild_id')).toBe('guild-id…');
    expect(url.searchParams.get('OCID')).toBe('short');
  });

  it('32자 이상의 16진수는 쿼리 이름과 무관하게 가리고 캐릭터명과 날짜는 유지한다', () => {
    const params = new URLSearchParams({
      account_id: 'AbCdEF09'.repeat(4),
      user_id: '0123456789abcdef'.repeat(4),
      character_name: '메이플 용사+1',
      date: '2024-01-15',
      short_hex: 'a'.repeat(31),
      other: `${'a'.repeat(32)}g`,
    });
    const search = new URL(maskIdentifiers(`${baseUrl}?${params}`)).searchParams;

    expect(search.get('account_id')).toBe('AbCdEF09…');
    expect(search.get('user_id')).toBe('01234567…');
    expect(search.get('character_name')).toBe('메이플 용사+1');
    expect(search.get('date')).toBe('2024-01-15');
    expect(search.get('short_hex')).toBe(params.get('short_hex'));
    expect(search.get('other')).toBe(params.get('other'));
  });

  it('가릴 값이 없는 URL의 표기를 유지한다', () => {
    const url = `${baseUrl}?character_name=Maple%20Hero#game`;
    expect(maskIdentifiers(url)).toBe(url);
  });

  it('URL을 파싱할 수 없으면 원문을 숨긴다', () => {
    expect(maskIdentifiers('https://[invalid]?ocid=secret-identifier')).toBe('?…');
  });
});

describe('readableUrl', () => {
  it('로그용으로 쿼리의 퍼센트 인코딩을 푼다', async () => {
    const { readableUrl } = await import('../../../src/core/http/mask.js');
    const url = `https://open.api.nexon.com/maplestory/v1/id?${new URLSearchParams({ character_name: '메이플 용사', ocid: '01234567…' })}`;
    expect(readableUrl(url)).toBe(
      'https://open.api.nexon.com/maplestory/v1/id?character_name=메이플 용사&ocid=01234567…',
    );
  });

  it('쿼리가 없거나 풀 수 없는 값은 그대로 둔다', async () => {
    const { readableUrl } = await import('../../../src/core/http/mask.js');
    expect(readableUrl('https://open.api.nexon.com/static/x.json')).toBe(
      'https://open.api.nexon.com/static/x.json',
    );
    expect(readableUrl('https://h/?a=%E0%A4%A')).toBe('https://h/?a=%E0%A4%A');
  });
});
