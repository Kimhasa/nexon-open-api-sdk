import type {
  CashshopNoticeDetail,
  CashshopNoticeList,
  EventNoticeDetail,
  EventNoticeList,
  NoticeDetail,
  NoticeList,
  UpdateNoticeList,
} from '../../../src/games/maplestory/notice/types.js';

export const noticeListFixture: NoticeList = {
  notice: [
    {
      title: '테스트 공지사항',
      url: 'https://maplestory.nexon.com/News/Notice/1',
      notice_id: 1,
      date: '2024-01-15T10:00+09:00',
    },
  ],
};

export const noticeDetailFixture: NoticeDetail = {
  title: '테스트 공지사항',
  url: 'https://maplestory.nexon.com/News/Notice/1',
  date: '2024-01-15T10:00+09:00',
  contents: '<p>공지 내용입니다.</p>',
};

/** GET /maplestory/v1/notice-update — 포털 스펙 스키마로 합성한 응답 */
export const noticeUpdateFixture: UpdateNoticeList = {
  update_notice: [
    {
      title: '테스트 공지사항',
      url: 'https://maplestory.nexon.com/News/Notice/1',
      notice_id: 1,
      date: '2023-12-21T00:00+09:00',
    },
  ],
};

/** GET /maplestory/v1/notice-update/detail — 포털 스펙 스키마로 합성한 응답 */
export const noticeUpdateDetailFixture: NoticeDetail = {
  title: '테스트 공지사항',
  url: 'https://maplestory.nexon.com/News/Notice/1',
  contents: '<p>내용입니다.</p>',
  date: '2023-12-21T00:00+09:00',
};

/** GET /maplestory/v1/notice-event — 포털 스펙 스키마로 합성한 응답 */
export const noticeEventFixture: EventNoticeList = {
  event_notice: [
    {
      title: '테스트 공지사항',
      url: 'https://maplestory.nexon.com/News/Notice/1',
      notice_id: 1,
      date: '2023-12-21T00:00+09:00',
      date_event_start: '2023-12-21T00:00+09:00',
      date_event_end: '2023-12-21T00:00+09:00',
    },
  ],
};

/** GET /maplestory/v1/notice-event/detail — 포털 스펙 스키마로 합성한 응답 */
export const noticeEventDetailFixture: EventNoticeDetail = {
  title: '테스트 공지사항',
  url: 'https://maplestory.nexon.com/News/Notice/1',
  contents: '<p>내용입니다.</p>',
  date: '2023-12-21T00:00+09:00',
  date_event_start: '2023-12-21T00:00+09:00',
  date_event_end: '2023-12-21T00:00+09:00',
};

/** GET /maplestory/v1/notice-cashshop — 포털 스펙 스키마로 합성한 응답 */
export const noticeCashshopFixture: CashshopNoticeList = {
  cashshop_notice: [
    {
      title: '테스트 공지사항',
      url: 'https://maplestory.nexon.com/News/Notice/1',
      notice_id: 1,
      date: '2023-12-21T00:00+09:00',
      date_sale_start: '2023-12-21T00:00+09:00',
      date_sale_end: '2023-12-21T00:00+09:00',
      ongoing_flag: 'true',
    },
  ],
};

/** GET /maplestory/v1/notice-cashshop/detail — 포털 스펙 스키마로 합성한 응답 */
export const noticeCashshopDetailFixture: CashshopNoticeDetail = {
  title: '테스트 공지사항',
  url: 'https://maplestory.nexon.com/News/Notice/1',
  contents: '<p>내용입니다.</p>',
  date: '2023-12-21T00:00+09:00',
  date_sale_start: '2023-12-21T00:00+09:00',
  date_sale_end: '2023-12-21T00:00+09:00',
  ongoing_flag: 'true',
};
