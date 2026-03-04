import type { NoticeList, NoticeDetail } from '../../../src/games/maplestory/notice/types.js';

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
  notice_id: 1,
  date: '2024-01-15T10:00+09:00',
  contents: '<p>공지 내용입니다.</p>',
};
