import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import type { OUID } from './user/types.js';
import {
  FC_OUID_SHAPE,
  FC_USER_BASIC_SHAPE,
  FC_MAX_DIVISION_SHAPE,
  FC_MATCH_DETAIL_SHAPE,
} from './shapes.js';
import type {
  FcUserBasic,
  FcMaxDivision,
  FcUserMatchRequest,
  FcUserTradeRequest,
  FcTradeRecord,
} from './user/types.js';
import type { FcMatchListRequest, FcMatchDetail } from './match/types.js';
import type { FcRankerStatsRequest, FcRankerStats } from './ranker/types.js';
import { FC_METADATA_ENDPOINTS, FC_IMAGE_ENDPOINTS } from './endpoints.js';
import type {
  FcMatchTypeMeta,
  FcSpidMeta,
  FcSeasonIdMeta,
  FcSpPositionMeta,
  FcDivisionMeta,
  FcDivisionVoltaMeta,
} from './metadata/types.js';

/**
 * EA SPORTS FC Online 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ouid = await client.fcOnline.getOuid('닉네임');
 * const basic = await client.fcOnline.getBasic(ouid);
 * const maxDiv = await client.fcOnline.getMaxDivision(ouid);
 * ```
 */
export class FcOnlineClient extends AbstractGameClient {
  protected readonly pathPrefix = 'fconline';

  // ─── 계정 정보 조회 (User) ──────────────────────────────────────────────

  /**
   * 닉네임으로 계정 식별자(ouid)를 조회한다.
   *
   * @param nickname - 조회할 유저 닉네임
   * @throws {NexonNotFoundError} 유저를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ouid = await client.fcOnline.getOuid('닉네임');
   * ```
   */
  async getOuid(nickname: string): Promise<OUID> {
    const url = this.buildUrl('id');
    const response = await this.http.get<{ ouid: string }>(url, { nickname }, FC_OUID_SHAPE);
    return response.ouid as OUID;
  }

  /**
   * 유저 기본 정보를 조회한다.
   *
   * @param ouid - {@link FcOnlineClient.getOuid}로 얻은 계정 식별자
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ouid = await client.fcOnline.getOuid('닉네임');
   * const basic = await client.fcOnline.getBasic(ouid);
   * console.log(`${basic.nickname} (Lv.${basic.level})`);
   * ```
   */
  async getBasic(ouid: OUID): Promise<FcUserBasic> {
    const url = this.buildUrl('user/basic');
    return this.http.get<FcUserBasic>(url, { ouid: ouid as string }, FC_USER_BASIC_SHAPE);
  }

  /**
   * 역대 최고 등급과 달성일자를 조회한다.
   *
   * @param ouid - 계정 식별자
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const maxDiv = await client.fcOnline.getMaxDivision(ouid);
   * console.log(`매치 ${maxDiv.matchType} — 등급 ${maxDiv.division}`);
   * ```
   */
  async getMaxDivision(ouid: OUID): Promise<FcMaxDivision> {
    const url = this.buildUrl('user/maxdivision');
    return this.http.get<FcMaxDivision>(url, { ouid: ouid as string }, FC_MAX_DIVISION_SHAPE);
  }

  /**
   * 유저의 매치 종류별 기록(매치 ID 목록)을 조회한다.
   *
   * 가장 최근 매치부터 내림차순으로 반환됩니다.
   * `offset`/`limit`으로 페이지네이션 가능합니다.
   *
   * @param params.ouid - 계정 식별자
   * @param params.matchtype - 매치 종류 (/metadata/matchtype 참고)
   * @param params.offset - 시작 위치 (기본값: 0)
   * @param params.limit - 가져올 갯수 (최대 100, 기본값: 100)
   * @throws {NexonBadRequestError} ouid 또는 matchtype이 유효하지 않을 때
   *
   * @example
   * ```ts
   * const matchIds = await client.fcOnline.getMatchList({
   *   ouid,
   *   matchtype: 50,
   *   limit: 10,
   * });
   * for (const id of matchIds) {
   *   console.log(id);
   * }
   * ```
   */
  async getMatchList(params: FcUserMatchRequest): Promise<string[]> {
    const url = this.buildUrl('user/match');
    return this.http.get<string[]>(url, {
      ouid: params.ouid as string,
      matchtype: params.matchtype,
      offset: params.offset,
      limit: params.limit,
    });
  }

  /**
   * 유저의 이적시장 거래 기록을 조회한다. (본인 거래 기록만 조회 가능)
   *
   * 가장 최근 거래부터 내림차순으로 반환됩니다.
   * `offset`/`limit`으로 페이지네이션 가능합니다.
   *
   * @param params.tradetype - 거래 종류 (`'buy'` | `'sell'`)
   * @param params.offset - 시작 위치 (기본값: 0)
   * @param params.limit - 가져올 갯수 (최대 100, 기본값: 100)
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const trades = await client.fcOnline.getTradeList({ tradetype: 'buy', limit: 10 });
   * for (const t of trades) {
   *   console.log(`${t.spid} — ${t.value}BP (${t.tradeDate})`);
   * }
   * ```
   */
  async getTradeList(params: FcUserTradeRequest): Promise<FcTradeRecord[]> {
    const url = this.buildUrl('user/trade');
    return this.http.get<FcTradeRecord[]>(url, {
      tradetype: params.tradetype,
      offset: params.offset,
      limit: params.limit,
    });
  }

  // ─── 매치 정보 조회 (Match) ─────────────────────────────────────────────

  /**
   * 모든 매치의 종류별 기록(매치 ID 목록)을 조회한다.
   *
   * 가장 최근 매치부터 내림차순으로 반환됩니다.
   * `offset`/`limit`으로 페이지네이션 가능합니다.
   *
   * @param params.matchtype - 매치 종류 (/metadata/matchtype 참고)
   * @param params.offset - 시작 위치 (기본값: 0)
   * @param params.limit - 가져올 갯수 (최대 100, 기본값: 100)
   * @param params.orderby - 정렬 순서 (`'desc'` | `'asc'`, 기본값: `'desc'`)
   *
   * @example
   * ```ts
   * const matchIds = await client.fcOnline.getAllMatchList({ matchtype: 50, limit: 10 });
   * ```
   */
  async getAllMatchList(params: FcMatchListRequest): Promise<string[]> {
    const url = this.buildUrl('match');
    return this.http.get<string[]>(url, {
      matchtype: params.matchtype,
      offset: params.offset,
      limit: params.limit,
      orderby: params.orderby,
    });
  }

  /**
   * 매치 상세 기록을 조회한다.
   *
   * 매치 시점, 매치 종류와 참여 유저의 상세한 매치 통계가 반환됩니다.
   * 매치 통계가 생성되기 전에 상대방이 종료하면 상대 정보가 없을 수 있습니다.
   *
   * @param matchId - 매치 고유 식별자 ({@link FcOnlineClient.getMatchList} 또는 {@link FcOnlineClient.getAllMatchList}로 획득)
   * @throws {NexonBadRequestError} matchId가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const detail = await client.fcOnline.getMatchDetail('6572d9bbc7331d2a45f3d755');
   * console.log(`${detail.matchDate} — 매치타입 ${detail.matchType}`);
   * for (const info of detail.matchInfo) {
   *   console.log(`${info.nickname}: ${info.matchDetail.matchResult}`);
   * }
   * ```
   */
  async getMatchDetail(matchId: string): Promise<FcMatchDetail> {
    const url = this.buildUrl('match-detail');
    return this.http.get<FcMatchDetail>(url, { matchid: matchId }, FC_MATCH_DETAIL_SHAPE);
  }

  // ─── 랭커 정보 조회 (Ranker) ────────────────────────────────────────────

  /**
   * TOP 10,000 랭커 유저가 사용한 선수의 20경기 평균 스탯을 조회한다.
   *
   * `players` 배열은 SDK 내부에서 JSON 직렬화 후 URL 인코딩하여 전송합니다.
   * 1회 요청 시 50명 이내를 권장합니다 (초과 시 413 에러 가능).
   *
   * @param params.matchtype - 매치 종류 (/metadata/matchtype 참고)
   * @param params.players - 조회할 선수 목록 (`{ id: spid, po: position }[]`)
   * @throws {NexonBadRequestError} matchtype 또는 players가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const stats = await client.fcOnline.getRankerStats({
   *   matchtype: 52,
   *   players: [
   *     { id: 100167680, po: 18 },
   *     { id: 277205401, po: 28 },
   *   ],
   * });
   * for (const s of stats) {
   *   console.log(`spId ${s.spId} — 평균 골 ${s.status.goal}, 패스 ${s.status.passSuccess}`);
   * }
   * ```
   */
  async getRankerStats(params: FcRankerStatsRequest): Promise<FcRankerStats[]> {
    const url = this.buildUrl('ranker-stats');
    return this.http.get<FcRankerStats[]>(url, {
      matchtype: params.matchtype,
      players: JSON.stringify(params.players),
    });
  }

  // ─── 메타데이터 정보 조회 (MetaData) ──────────────────────────────────

  /**
   * 매치 종류(matchtype) 메타데이터를 조회한다.
   *
   * @example
   * ```ts
   * const matchTypes = await client.fcOnline.getMatchTypeMeta();
   * for (const mt of matchTypes) {
   *   console.log(`${mt.matchtype}: ${mt.desc}`);
   * }
   * ```
   */
  async getMatchTypeMeta(): Promise<FcMatchTypeMeta[]> {
    return this.http.get<FcMatchTypeMeta[]>(FC_METADATA_ENDPOINTS.MATCH_TYPE);
  }

  /**
   * 선수 고유 식별자(spid) 메타데이터를 조회한다.
   *
   * spid = seasonId(3자리) + pid(6자리)로 구성됩니다.
   *
   * @example
   * ```ts
   * const players = await client.fcOnline.getSpidMeta();
   * const player = players.find(p => p.name === '손흥민');
   * ```
   */
  async getSpidMeta(): Promise<FcSpidMeta[]> {
    return this.http.get<FcSpidMeta[]>(FC_METADATA_ENDPOINTS.SPID);
  }

  /**
   * 시즌 아이디(seasonId) 메타데이터를 조회한다.
   *
   * 시즌 아이디는 선수가 속한 클래스를 나타냅니다.
   *
   * @example
   * ```ts
   * const seasons = await client.fcOnline.getSeasonIdMeta();
   * for (const s of seasons) {
   *   console.log(`${s.seasonId}: ${s.className}`);
   * }
   * ```
   */
  async getSeasonIdMeta(): Promise<FcSeasonIdMeta[]> {
    return this.http.get<FcSeasonIdMeta[]>(FC_METADATA_ENDPOINTS.SEASON_ID);
  }

  /**
   * 선수 포지션(spposition) 메타데이터를 조회한다.
   *
   * @example
   * ```ts
   * const positions = await client.fcOnline.getSpPositionMeta();
   * // [{ spposition: 0, desc: "GK" }, { spposition: 1, desc: "SW" }, ...]
   * ```
   */
  async getSpPositionMeta(): Promise<FcSpPositionMeta[]> {
    return this.http.get<FcSpPositionMeta[]>(FC_METADATA_ENDPOINTS.SP_POSITION);
  }

  /**
   * 등급 식별자(division) 메타데이터를 조회한다.
   *
   * @example
   * ```ts
   * const divisions = await client.fcOnline.getDivisionMeta();
   * // [{ divisionId: 800, divisionName: "슈퍼챔피언스" }, ...]
   * ```
   */
  async getDivisionMeta(): Promise<FcDivisionMeta[]> {
    return this.http.get<FcDivisionMeta[]>(FC_METADATA_ENDPOINTS.DIVISION);
  }

  /**
   * 볼타 공식경기 등급 식별자 메타데이터를 조회한다.
   *
   * @example
   * ```ts
   * const voltaDivisions = await client.fcOnline.getDivisionVoltaMeta();
   * // [{ divisionId: 1100, divisionName: "월드 스타" }, ...]
   * ```
   */
  async getDivisionVoltaMeta(): Promise<FcDivisionVoltaMeta[]> {
    return this.http.get<FcDivisionVoltaMeta[]>(FC_METADATA_ENDPOINTS.DIVISION_VOLTA);
  }

  // ─── 이미지 URL 조회 (Image) ──────────────────────────────────────────

  /**
   * 선수 고유 식별자(spid)로 액션샷 이미지 URL을 반환한다.
   *
   * HTTP 호출 없이 URL만 조립합니다. 특정 선수는 이미지가 없을 수 있습니다.
   *
   * @param spid - 선수 고유 식별자 (seasonId 3자리 + pid 6자리)
   *
   * @example
   * ```ts
   * const url = client.fcOnline.getActionShotUrl(272167135);
   * // "https://open.api.nexon.com/live/externalAssets/common/playersAction/p272167135.png"
   * ```
   */
  getActionShotUrl(spid: number): string {
    return `${FC_IMAGE_ENDPOINTS.ACTION_SHOT}/p${spid}.png`;
  }

  /**
   * 선수 고유 식별자(spid)로 선수 이미지 URL을 반환한다.
   *
   * HTTP 호출 없이 URL만 조립합니다. 특정 선수는 이미지가 없을 수 있습니다.
   *
   * @param spid - 선수 고유 식별자 (seasonId 3자리 + pid 6자리)
   *
   * @example
   * ```ts
   * const url = client.fcOnline.getPlayerImageUrl(272167135);
   * // "https://open.api.nexon.com/live/externalAssets/common/players/p272167135.png"
   * ```
   */
  getPlayerImageUrl(spid: number): string {
    return `${FC_IMAGE_ENDPOINTS.PLAYER}/p${spid}.png`;
  }
}
