import { assertInteger, assertOneOf } from '../../../core/validation/input.js';
import type { HttpClient } from '../../../core/http/HttpClient.js';
import { HEROES_RANKING_SHAPE } from '../shapes.js';
import type {
  HeroesHallOfHonorRankingRequest,
  HeroesRankingEntry,
  HeroesRealTimeRankingRequest,
} from './types.js';

const RANKING_TYPE_HINT = "'0' 은 공격력, '1' 은 마법 공격력 기준 순위입니다.";

/** 서버가 실제로 돌려주는 형태. 포털 스펙은 최상위를 배열로 적지만 실제 응답은 `ranking` 에 담겨 온다 (2026-11-24 실측) */
interface HeroesRankingEnvelope {
  readonly ranking: HeroesRankingEntry[];
}

/** 실제 응답(`{ ranking: [...] }`)과 스펙 형태(배열) 어느 쪽이 와도 순위 항목 배열로 맞춘다. */
function toRankingEntries(
  response: HeroesRankingEnvelope | HeroesRankingEntry[],
): HeroesRankingEntry[] {
  if (Array.isArray(response)) return response;
  // 사용자가 받은 값에서 .length, [0] 을 바로 쓰므로 ranking 이 빠진 응답도 배열로 돌려준다
  return Array.isArray(response.ranking) ? response.ranking : [];
}

/**
 * 마비노기 영웅전 랭킹 API 클라이언트 (V2).
 *
 * 두 메서드 모두 순위 항목의 배열을 반환합니다. 서버 응답은 `{ ranking: [...] }` 객체지만 SDK가 `ranking` 배열만 꺼내 돌려줍니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 * const honor = await client.mabinogiHeroes.ranking.getHallOfHonor({ ranking_type: '0' });
 * const realTime = await client.mabinogiHeroes.ranking.getRealTime({ ranking_type: '0', page_no: 1 });
 * ```
 */
export class MabinogiHeroesRankingClient {
  private static readonly BASE = 'https://open.api.nexon.com/heroes/v2';

  constructor(private readonly http: HttpClient) {}

  /**
   * 명예의 전당에서 공격력 또는 마법 공격력 순위를 조회한다.
   *
   * 매일 오전 9시(KST)의 실시간 랭킹 순위를 기준으로 반영됩니다.
   * 공격력은 200위, 마법 공격력은 100위까지 조회됩니다.
   * 서버 응답의 `ranking` 배열을 꺼내 순위 항목 배열로 돌려줍니다.
   *
   * @param params.ranking_type - 랭킹 유형. `'0'`: 공격력, `'1'`: 마법 공격력 (문자열)
   * @throws {NexonBadRequestError} ranking_type이 `'0'`/`'1'` 이 아닐 때 (요청 전에 SDK가 throw)
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 허용량을 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 길드 디스코드에 명예의 전당 순위를 표시할 때
   * const ranking = await client.mabinogiHeroes.ranking.getHallOfHonor({ ranking_type: '0' });
   * for (const entry of ranking.slice(0, 10)) {
   *   console.log(`${entry.ranking}위 ${entry.character_name} (${entry.score})`);
   * }
   * ```
   */
  async getHallOfHonor(params: HeroesHallOfHonorRankingRequest): Promise<HeroesRankingEntry[]> {
    assertOneOf(
      (params as HeroesHallOfHonorRankingRequest | undefined)?.ranking_type,
      ['0', '1'],
      'ranking_type',
      RANKING_TYPE_HINT,
    );
    const response = await this.http.get<HeroesRankingEnvelope | HeroesRankingEntry[]>(
      `${MabinogiHeroesRankingClient.BASE}/ranking/hall-of-honor`,
      { ranking_type: params.ranking_type },
      HEROES_RANKING_SHAPE,
    );
    return toRankingEntries(response);
  }

  /**
   * 실시간 랭킹에서 공격력 또는 마법 공격력 순위를 한 페이지 조회한다.
   *
   * 1시간마다 반영됩니다. 공격력은 4000위(8페이지), 마법 공격력은 2000위(4페이지)까지 조회됩니다.
   * 서버 응답의 `ranking` 배열을 꺼내 순위 항목 배열로 돌려줍니다.
   *
   * @param params.ranking_type - 랭킹 유형. `'0'`: 공격력, `'1'`: 마법 공격력 (문자열)
   * @param params.page_no - 실시간 랭킹 페이지 번호. 1부터 시작한다.
   * @throws {NexonBadRequestError} ranking_type이 `'0'`/`'1'` 이 아니거나 page_no가 1 이상의 정수가 아닐 때 (요청 전에 SDK가 throw)
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 허용량을 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 랭킹 위젯에 첫 페이지의 실시간 순위를 표시할 때
   * const page1 = await client.mabinogiHeroes.ranking.getRealTime({ ranking_type: '1', page_no: 1 });
   * console.log(page1[0]?.character_name, page1[0]?.score);
   *
   * const page2 = await client.mabinogiHeroes.ranking.getRealTime({ ranking_type: '1', page_no: 2 });
   * console.log(page2.length);
   * ```
   */
  async getRealTime(params: HeroesRealTimeRankingRequest): Promise<HeroesRankingEntry[]> {
    const request = params as HeroesRealTimeRankingRequest | undefined;
    assertOneOf(request?.ranking_type, ['0', '1'], 'ranking_type', RANKING_TYPE_HINT);
    assertInteger(request?.page_no, 'page_no', {
      min: 1,
      hint: "첫 페이지는 1입니다 (예: { ranking_type: '0', page_no: 1 }).",
    });
    const response = await this.http.get<HeroesRankingEnvelope | HeroesRankingEntry[]>(
      `${MabinogiHeroesRankingClient.BASE}/ranking/real-time`,
      { ranking_type: params.ranking_type, page_no: params.page_no },
      HEROES_RANKING_SHAPE,
    );
    return toRankingEntries(response);
  }
}
