import type { PlatformNoticeList } from '../../../src/games/platform/notice/types.js';

// 포털 스펙(specs/openapi/platform/19.yaml) 스키마와 example 로 합성한 값.

export const platformNoticeListFixture: PlatformNoticeList = {
  notice: [
    {
      game_name: '공통',
      title: '[안내] 테스트 Open API 정기 점검 안내',
      url: 'https://openapi.nexon.com/ko/support/notice/1001/',
      contents: '<p>테스트 정기 점검 본문입니다.</p>',
      date: '2023-12-14T08:28:35Z',
      notice_tag: ['점검'],
    },
    {
      game_name: '메이플스토리',
      title: '[안내] 테스트 API 변경 안내',
      url: 'https://openapi.nexon.com/ko/support/notice/1002/',
      contents: '<p>테스트 API 변경 본문입니다.</p>',
      date: '2023-12-15T02:00:00Z',
      notice_tag: [],
    },
  ],
};
