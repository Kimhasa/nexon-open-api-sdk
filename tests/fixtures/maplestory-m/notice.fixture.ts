import type { MNoticeList, MNoticeDetail } from '../../../src/games/maplestory-m/notice/types.js';

export const mNoticeListFixture: MNoticeList = {
  notice: [
    {
      title: '메이플스토리M 업데이트 공지',
      url: 'https://maplestorym.nexon.com/notice/1',
      notice_id: 1001,
      date: '2024-01-01T10:00+09:00',
    },
  ],
};

export const mNoticeDetailFixture: MNoticeDetail = {
  title: '메이플스토리M 업데이트 공지',
  url: 'https://maplestorym.nexon.com/notice/1',
  contents: '<p>메이플스토리M 업데이트 내용입니다.</p>',
  date: '2024-01-01T10:00+09:00',
};
