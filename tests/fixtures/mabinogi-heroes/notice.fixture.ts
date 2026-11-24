import type {
  HeroesEventNoticeDetail,
  HeroesEventNoticeList,
  HeroesNoticeDetail,
  HeroesNoticeList,
  HeroesPatchNoticeDetail,
  HeroesPatchNoticeList,
} from '../../../src/games/mabinogi-heroes/notice/types.js';

// 포털 스펙(specs/openapi/heroes/28.yaml) 스키마로 합성한 값이다. 실 API 응답이 아니다.

export const heroesNoticeListFixture: HeroesNoticeList = {
  notice: [
    {
      title: '정기 점검 안내',
      url: 'https://heroes.nexon.com/news/notice/view?postno=2001',
      notice_id: 2001,
      date: '2023-12-14T08:28:35Z',
    },
    {
      title: '임시 점검 완료 안내',
      url: 'https://heroes.nexon.com/news/notice/view?postno=2000',
      notice_id: 2000,
      date: '2023-12-13T02:00:00Z',
    },
  ],
};

export const heroesNoticeDetailFixture: HeroesNoticeDetail = {
  title: '정기 점검 안내',
  url: 'https://heroes.nexon.com/news/notice/view?postno=2001',
  contents: '<p>정기 점검 안내 본문입니다.</p>',
  date: '2023-12-14T08:28:35Z',
};

export const heroesPatchNoticeListFixture: HeroesPatchNoticeList = {
  patch_notice: [
    {
      title: '12월 업데이트 패치노트',
      url: 'https://heroes.nexon.com/news/update/view?postno=3001',
      notice_id: 3001,
      date: '2023-12-14T08:28:35Z',
    },
  ],
};

export const heroesPatchNoticeDetailFixture: HeroesPatchNoticeDetail = {
  title: '12월 업데이트 패치노트',
  url: 'https://heroes.nexon.com/news/update/view?postno=3001',
  contents: '<p>12월 업데이트 패치노트 본문입니다.</p>',
  date: '2023-12-14T08:28:35Z',
};

export const heroesEventNoticeListFixture: HeroesEventNoticeList = {
  event_notice: [
    {
      title: '겨울 출석 이벤트',
      url: 'https://heroes.nexon.com/news/events/view?postno=4001',
      notice_id: 4001,
      date_event_start: '2023-12-14T08:28:35Z',
      date_event_end: '2023-12-28T02:00:00Z',
      ongoing_flag: 'false',
    },
    {
      title: '상시 판매 패키지',
      url: 'https://heroes.nexon.com/news/events/view?postno=4000',
      notice_id: 4000,
      date_event_start: null,
      date_event_end: null,
      ongoing_flag: 'true',
    },
  ],
};

export const heroesEventNoticeDetailFixture: HeroesEventNoticeDetail = {
  title: '겨울 출석 이벤트',
  url: 'https://heroes.nexon.com/news/events/view?postno=4001',
  contents: '<p>겨울 출석 이벤트 본문입니다.</p>',
  date_event_start: '2023-12-14T08:28:35Z',
  date_event_end: '2023-12-28T02:00:00Z',
  ongoing_flag: 'false',
};
