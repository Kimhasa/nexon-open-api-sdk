// 마비노기 장보기 도구에서 경매장에 올라온 아이템의 개당 최저가와 평균가를 보여 줍니다.
// 실행: node --env-file=.env examples/mabinogi-auction-price.mjs "롱 소드"
// @ts-check

import { NexonClient } from 'nexon-open-api';

const apiKey = process.env['NEXON_MABINOGI_API_KEY']?.trim();
if (!apiKey) {
  console.error('🪙 마비노기 API 키가 필요해요. .env에 NEXON_MABINOGI_API_KEY를 설정해 주세요.');
  process.exitCode = 1;
} else {
  try {
    const itemName = process.argv[2]?.trim() || '롱 소드';
    const client = new NexonClient({ apiKey });
    const maxPages = 3;
    let pages = 0;
    let listingCount = 0;
    let lowestPrice = Infinity;
    let totalPrice = 0;
    /** @type {string | undefined} */
    let cursor;

    do {
      const page = await client.mabinogi.auction.listItems({ item_name: itemName, cursor });
      for (const { auction_price_per_unit: unitPrice } of page.auction_item) {
        listingCount += 1;
        lowestPrice = Math.min(lowestPrice, unitPrice);
        totalPrice += unitPrice;
      }
      // 다음 장이 있으면 받은 커서(next_cursor)를 그대로 넘깁니다.
      cursor = page.next_cursor ?? undefined;
      pages += 1;
    } while (cursor && pages < maxPages);

    console.log(`🪙 마비노기 경매장 · ${itemName}`);
    if (listingCount === 0) {
      console.log('판매 중인 매물이 없어요.');
    } else {
      const average = (totalPrice / listingCount).toLocaleString('ko-KR', {
        maximumFractionDigits: 1,
      });
      console.log(`조회한 매물 ${listingCount.toLocaleString('ko-KR')}건`);
      console.log(`개당 최저 ${lowestPrice.toLocaleString('ko-KR')} 골드 · 평균 ${average} 골드`);
      if (cursor) console.log(`처음 ${maxPages}페이지에서 확인한 가격이에요.`);
    }
    // 출력 예시: 개당 최저 1,000 골드 · 평균 1,250 골드
  } catch {
    console.error(
      '🪙 경매장 시세를 불러오지 못했어요. 아이템 이름과 마비노기 API 키를 확인해 주세요.',
    );
    process.exitCode = 1;
  }
}
