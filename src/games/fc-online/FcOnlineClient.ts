import {
  assertInteger,
  assertNonEmptyString,
  assertOneOf,
  invalidInput,
} from '../../core/validation/input.js';
import { emitDeprecation } from '../../core/deprecation/deprecation.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import type { OUID } from './user/types.js';
import {
  FC_CLASS_META_SHAPE,
  FC_DIVISION_META_SHAPE,
  FC_MATCH_DETAIL_SHAPE,
  FC_MATCH_ID_LIST_SHAPE,
  FC_MATCH_TYPE_META_SHAPE,
  FC_MAX_DIVISION_SHAPE,
  FC_OUID_SHAPE,
  FC_RANKER_STATS_SHAPE,
  FC_SEASON_ID_META_SHAPE,
  FC_SEASON_META_SHAPE,
  FC_SPID_META_SHAPE,
  FC_SP_POSITION_META_SHAPE,
  FC_TRADE_LIST_SHAPE,
  FC_USER_BASIC_SHAPE,
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
  FcSeasonMeta,
  FcClassMeta,
  FcSpPositionMeta,
  FcDivisionMeta,
  FcDivisionVoltaMeta,
} from './metadata/types.js';

// 실제 정적 응답은 포털 YAML의 seasonId 정수 대신 seasonid 문자열을 사용합니다.
interface FcSeasonMetaWire {
  readonly matchtype: number;
  readonly seasonid: string;
}

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
 * const divisions = await client.fcOnline.getMaxDivision(ouid);
 * ```
 */
export class FcOnlineClient extends AbstractGameClient {
  protected readonly pathPrefix = 'fconline';

  // ─── 계정 정보 조회 (User) ──────────────────────────────────────────────

  /**
   * 닉네임으로 계정 식별자(ouid)를 조회한다.
   *
   * @param nickname - 조회할 유저 닉네임
   * @throws {NexonBadRequestError} 닉네임이 비어 있을 때
   * @throws {NexonNotFoundError} 유저를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ouid = await client.fcOnline.getOuid('닉네임');
   * ```
   */
  async getOuid(nickname: string): Promise<OUID> {
    assertNonEmptyString(nickname, 'nickname');
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
    assertNonEmptyString(ouid, 'ouid');
    const url = this.buildUrl('user/basic');
    return this.http.get<FcUserBasic>(url, { ouid: ouid as string }, FC_USER_BASIC_SHAPE);
  }

  /**
   * 매치 종류별 역대 최고 등급과 달성일자를 배열로 조회한다.
   *
   * 포털은 단일 객체를 명세합니다. 단일 객체 응답도 한 항목의 배열로 반환합니다.
   * 기존 객체 반환 계약에서 배열로 변경되었습니다.
   *
   * @param ouid - 계정 식별자
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const divisions = await client.fcOnline.getMaxDivision(ouid);
   * for (const division of divisions) {
   *   console.log(`매치 ${division.matchType} — 등급 ${division.division}`);
   * }
   * ```
   */
  async getMaxDivision(ouid: OUID): Promise<readonly FcMaxDivision[]> {
    assertNonEmptyString(ouid, 'ouid');
    const url = this.buildUrl('user/maxdivision');
    const response = await this.http.get<FcMaxDivision | FcMaxDivision[]>(
      url,
      { ouid },
      FC_MAX_DIVISION_SHAPE,
    );
    return Array.isArray(response) ? response : [response];
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
    assertNonEmptyString(params.ouid, 'ouid');
    const url = this.buildUrl('user/match');
    return this.http.get<string[]>(
      url,
      {
        ouid: params.ouid as string,
        matchtype: params.matchtype,
        offset: params.offset,
        limit: params.limit,
      },
      FC_MATCH_ID_LIST_SHAPE,
    );
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
   * @throws {NexonBadRequestError} 거래 종류가 유효하지 않을 때
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
    assertOneOf(params.tradetype, ['buy', 'sell'], 'tradetype');
    const url = this.buildUrl('user/trade');
    return this.http.get<FcTradeRecord[]>(
      url,
      {
        tradetype: params.tradetype,
        offset: params.offset,
        limit: params.limit,
      },
      FC_TRADE_LIST_SHAPE,
    );
  }

  // ─── 매치 정보 조회 (Match) ─────────────────────────────────────────────

  /**
   * 모든 매치의 종류별 기록(매치 ID 목록)을 요청한다.
   *
   * @deprecated 넥슨이 2026년 7월 7일 제공을 종료했습니다. 개별 계정의 기록은 {@link FcOnlineClient.getMatchList}를 사용하세요.
   * @see https://openapi.nexon.com/support/notice/3495136/
   *
   * @param params.matchtype - 매치 종류 (/metadata/matchtype 참고)
   * @param params.offset - 시작 위치 (기본값: 0)
   * @param params.limit - 가져올 갯수 (최대 100, 기본값: 100)
   * @param params.orderby - 정렬 순서 (`'desc'` | `'asc'`, 기본값: `'desc'`)
   * @throws {NexonError} 서비스가 종료된 경로에서 HTTP 오류를 반환할 때
   *
   * @example
   * ```ts
   * const matchIds = await client.fcOnline.getAllMatchList({ matchtype: 50, limit: 10 });
   * ```
   */
  async getAllMatchList(params: FcMatchListRequest): Promise<string[]> {
    emitDeprecation(
      'FcOnlineClient.getAllMatchList',
      '넥슨이 전체 매치 목록 API를 종료했습니다. 개별 계정의 매치 기록은 getMatchList()로 조회하세요.',
    );
    const url = this.buildUrl('match');
    return this.http.get<string[]>(
      url,
      {
        matchtype: params.matchtype,
        offset: params.offset,
        limit: params.limit,
        orderby: params.orderby,
      },
      FC_MATCH_ID_LIST_SHAPE,
    );
  }

  /**
   * 매치 상세 기록을 조회한다.
   *
   * 매치 시점, 매치 종류와 참여 유저의 상세한 매치 통계가 반환됩니다.
   * 매치 통계가 생성되기 전에 상대방이 종료하면 상대 정보가 없을 수 있습니다.
   *
   * @param matchId - 매치 고유 식별자 ({@link FcOnlineClient.getMatchList}로 획득)
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
    assertNonEmptyString(matchId, 'matchid');
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
    if (params.players.length === 0) {
      invalidInput('players가 비어 있습니다.', '조회할 선수와 포지션을 한 쌍 이상 지정하세요.');
    }
    const url = this.buildUrl('ranker-stats');
    return this.http.get<FcRankerStats[]>(
      url,
      {
        matchtype: params.matchtype,
        players: JSON.stringify(params.players),
      },
      FC_RANKER_STATS_SHAPE,
    );
  }

  // ─── 메타데이터 정보 조회 (MetaData) ──────────────────────────────────

  /**
   * 매치 종류(matchtype) 메타데이터를 조회한다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
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
    return this.http.get<FcMatchTypeMeta[]>(
      FC_METADATA_ENDPOINTS.MATCH_TYPE,
      undefined,
      FC_MATCH_TYPE_META_SHAPE,
    );
  }

  /**
   * 선수 고유 식별자(spid) 메타데이터를 조회한다.
   *
   * spid = class(3자리) + pid(6자리)로 구성됩니다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const players = await client.fcOnline.getSpidMeta();
   * const player = players.find(p => p.name === '손흥민');
   * ```
   */
  async getSpidMeta(): Promise<FcSpidMeta[]> {
    return this.http.get<FcSpidMeta[]>(FC_METADATA_ENDPOINTS.SPID, undefined, FC_SPID_META_SHAPE);
  }

  /**
   * 시즌 아이디(seasonId) 메타데이터를 조회한다.
   *
   * 이 경로의 시즌 아이디는 선수 클래스 식별자입니다.
   *
   * @deprecated 넥슨은 2026년 11월 19일 이후 제공 종료를 공지했습니다. 선수 클래스는 {@link FcOnlineClient.getClassMeta}, 공식경기 시즌은 {@link FcOnlineClient.getSeasonMeta}를 사용하세요.
   * @see https://openapi.nexon.com/ko/game/fconline/?id=3
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
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
    emitDeprecation(
      'FcOnlineClient.getSeasonIdMeta',
      '선수 클래스는 getClassMeta()로, 공식경기 시즌은 getSeasonMeta()로 조회하세요.',
    );
    return this.http.get<FcSeasonIdMeta[]>(
      FC_METADATA_ENDPOINTS.SEASON_ID,
      undefined,
      FC_SEASON_ID_META_SHAPE,
    );
  }

  /**
   * 선수 포지션(spposition) 메타데이터를 조회한다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const positions = await client.fcOnline.getSpPositionMeta();
   * // [{ spposition: 0, desc: "GK" }, { spposition: 1, desc: "SW" }, ...]
   * ```
   */
  async getSpPositionMeta(): Promise<FcSpPositionMeta[]> {
    return this.http.get<FcSpPositionMeta[]>(
      FC_METADATA_ENDPOINTS.SP_POSITION,
      undefined,
      FC_SP_POSITION_META_SHAPE,
    );
  }

  /**
   * 등급 식별자(division) 메타데이터를 조회한다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const divisions = await client.fcOnline.getDivisionMeta();
   * // [{ divisionId: 800, divisionName: "슈퍼챔피언스" }, ...]
   * ```
   */
  async getDivisionMeta(): Promise<FcDivisionMeta[]> {
    return this.http.get<FcDivisionMeta[]>(
      FC_METADATA_ENDPOINTS.DIVISION,
      undefined,
      FC_DIVISION_META_SHAPE,
    );
  }

  /**
   * 볼타 공식경기 등급 식별자 메타데이터를 조회한다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const voltaDivisions = await client.fcOnline.getDivisionVoltaMeta();
   * // [{ divisionId: 1100, divisionName: "월드 스타" }, ...]
   * ```
   */
  async getDivisionVoltaMeta(): Promise<FcDivisionVoltaMeta[]> {
    return this.http.get<FcDivisionVoltaMeta[]>(
      FC_METADATA_ENDPOINTS.DIVISION_VOLTA,
      undefined,
      FC_DIVISION_META_SHAPE,
    );
  }

  /**
   * 공식경기 매치 종류별 최신 시즌 메타데이터를 조회한다.
   *
   * 응답에 없는 시즌은 EA 리그 경기로 구분할 수 있습니다.
   * 정적 응답의 seasonid 문자열은 포털 스펙의 seasonId 정수로 반환합니다.
   * 선수 클래스 식별자는 {@link FcOnlineClient.getClassMeta}에서 조회합니다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const seasons = await client.fcOnline.getSeasonMeta();
   * console.log(seasons.find((season) => season.matchtype === 50)?.seasonId);
   * ```
   */
  async getSeasonMeta(): Promise<FcSeasonMeta[]> {
    const response = await this.http.get<Array<FcSeasonMetaWire | FcSeasonMeta>>(
      FC_METADATA_ENDPOINTS.SEASON,
      undefined,
      FC_SEASON_META_SHAPE,
    );
    return response.map((row) =>
      'seasonid' in row ? { matchtype: row.matchtype, seasonId: Number(row.seasonid) } : row,
    );
  }

  /**
   * 선수가 속한 클래스의 식별자, 이름과 이미지 경로를 조회한다.
   *
   * 넥슨 공지에 따라 선수 클래스의 기존 {@link FcOnlineClient.getSeasonIdMeta} 경로를 대체합니다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const classes = await client.fcOnline.getClassMeta();
   * const icon = classes.find((entry) => entry.class === 100);
   * console.log(icon?.classImg);
   * ```
   */
  async getClassMeta(): Promise<FcClassMeta[]> {
    return this.http.get<FcClassMeta[]>(
      FC_METADATA_ENDPOINTS.CLASS,
      undefined,
      FC_CLASS_META_SHAPE,
    );
  }

  // ─── 이미지 URL 조회 (Image) ──────────────────────────────────────────

  /**
   * 선수 고유 식별자(spid) 또는 선수 식별자(pid)로 액션샷 이미지 URL을 반환한다.
   *
   * HTTP 호출 없이 URL만 조립합니다. 특정 선수는 이미지가 없을 수 있습니다.
   *
   * @param spid - 선수 고유 식별자 (class 3자리 + pid 6자리) 또는 선수 식별자 (pid)
   * @throws {NexonBadRequestError} 식별자가 양의 정수가 아닐 때
   *
   * @example
   * ```ts
   * const url = client.fcOnline.getActionShotUrl(272167135);
   * // "https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p272167135.png"
   * ```
   */
  getActionShotUrl(spid: number): string {
    assertInteger(spid, 'spid', {
      min: 1,
      safe: true,
      hint: '선수 메타데이터에서 spid 또는 pid를 확인하세요.',
    });
    return `${FC_IMAGE_ENDPOINTS.ACTION_SHOT}/p${spid}.png`;
  }

  /**
   * 선수 고유 식별자(spid) 또는 선수 식별자(pid)로 선수 이미지 URL을 반환한다.
   *
   * HTTP 호출 없이 URL만 조립합니다. 특정 선수는 이미지가 없을 수 있습니다.
   *
   * @param spid - 선수 고유 식별자 (class 3자리 + pid 6자리) 또는 선수 식별자 (pid)
   * @throws {NexonBadRequestError} 식별자가 양의 정수가 아닐 때
   *
   * @example
   * ```ts
   * const url = client.fcOnline.getPlayerImageUrl(167680);
   * // "https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p167680.png"
   * ```
   */
  getPlayerImageUrl(spid: number): string {
    assertInteger(spid, 'spid', {
      min: 1,
      safe: true,
      hint: '선수 메타데이터에서 spid 또는 pid를 확인하세요.',
    });
    return `${FC_IMAGE_ENDPOINTS.PLAYER}/p${spid}.png`;
  }
}
