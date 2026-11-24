import type {
  KartriderEventNoticeList,
  KartriderNoticeDetail,
  KartriderNoticeList,
  KartriderSeasonNoticeList,
} from '../../../src/games/kartrider/notice/types.js';

// 포털 스펙(specs/openapi/kartrush/27.yaml) 스키마와 example 로 합성한 값.

export const kartriderNoticeListFixture: KartriderNoticeList = {
  notice: [
    {
      title: '[안내] 테스트 정기 점검 안내',
      url: 'https://kartrush.nexon.com/news/notice/1001',
      notice_id: 1001,
      date: '2023-12-14T08:28:35Z',
      notice_tag: ['점검', '안내'],
    },
    {
      title: '[안내] 테스트 업데이트 안내',
      url: 'https://kartrush.nexon.com/news/notice/1002',
      notice_id: 1002,
      date: '2023-12-15T02:00:00Z',
      notice_tag: [],
    },
  ],
};

export const kartriderNoticeDetailFixture: KartriderNoticeDetail = {
  title: '[안내] 테스트 정기 점검 안내',
  url: 'https://kartrush.nexon.com/news/notice/1001',
  contents: '<p>테스트 정기 점검 본문입니다.</p>',
  date: '2023-12-14T08:28:35Z',
  notice_tag: ['점검', '안내'],
};

export const kartriderSeasonNoticeListFixture: KartriderSeasonNoticeList = {
  season_notice: [
    {
      title: '테스트 시즌 알림판',
      url: 'https://kartrush.nexon.com/news/season/2001',
      notice_id: 2001,
      date: '2023-12-14T08:28:35Z',
      notice_tag: ['시즌'],
    },
  ],
};

export const kartriderSeasonNoticeDetailFixture: KartriderNoticeDetail = {
  title: '테스트 시즌 알림판',
  url: 'https://kartrush.nexon.com/news/season/2001',
  contents: '<p>테스트 시즌 알림판 본문입니다.</p>',
  date: '2023-12-14T08:28:35Z',
  notice_tag: ['시즌'],
};

export const kartriderEventNoticeListFixture: KartriderEventNoticeList = {
  event_notice: [
    {
      title: '테스트 이벤트&대회 공지',
      url: 'https://kartrush.nexon.com/news/event/3001',
      notice_id: 3001,
      date: '2023-12-14T08:28:35Z',
      notice_tag: ['이벤트', '대회'],
    },
  ],
};

export const kartriderEventNoticeDetailFixture: KartriderNoticeDetail = {
  title: '테스트 이벤트&대회 공지',
  url: 'https://kartrush.nexon.com/news/event/3001',
  contents: '<p>테스트 이벤트&대회 본문입니다.</p>',
  date: '2023-12-14T08:28:35Z',
  notice_tag: ['이벤트', '대회'],
};
