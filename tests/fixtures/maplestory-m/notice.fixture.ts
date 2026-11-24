import type {
  MNoticeList,
  MNoticeDetail,
  MPatchNoticeList,
  MEventNoticeList,
  MEventNoticeDetail,
} from '../../../src/games/maplestory-m/notice/types.js';

export const mNoticeListFixture: MNoticeList = {
  notice: [
    {
      title: '메이플스토리M 업데이트 공지',
      url: 'https://maplestorym.nexon.com/notice/1',
      notice_id: 1001,
      date: '2023-12-14T08:28:35Z',
    },
  ],
};

export const mNoticeDetailFixture: MNoticeDetail = {
  title: '메이플스토리M 업데이트 공지',
  url: 'https://maplestorym.nexon.com/notice/1',
  contents: '<p>메이플스토리M 업데이트 내용입니다.</p>',
  date: '2023-12-14T08:28:35Z',
};

export const mPatchNoticeListFixture: MPatchNoticeList = {
  patch_notice: [
    {
      title: '테스트 패치 노트',
      url: 'https://example.com/patch/1002',
      notice_id: 1002,
      date: '2023-12-14T08:28:35Z',
    },
  ],
};

export const mPatchNoticeDetailFixture: MNoticeDetail = {
  title: '테스트 패치 노트',
  url: 'https://example.com/patch/1002',
  contents: '<p>패치 내용을 확인하세요.</p>',
  date: '2023-12-14T08:28:35Z',
};

export const mEventNoticeListFixture: MEventNoticeList = {
  event_notice: [
    {
      title: '테스트 이벤트',
      url: 'https://example.com/event/1003',
      notice_id: 1003,
      date: '2023-12-14T08:28:35Z',
    },
  ],
};

export const mEventNoticeDetailFixture: MEventNoticeDetail = {
  title: '테스트 이벤트',
  url: 'https://example.com/event/1003',
  contents: '<p>이벤트 내용을 확인하세요.</p>',
  date: '2023-12-14T08:28:35Z',
};
