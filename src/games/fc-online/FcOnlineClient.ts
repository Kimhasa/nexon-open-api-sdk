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
 * EA SPORTS FC 온라인 클라이언트.
 *
 * 구단주 닉네임으로 계정 고유 번호(ouid)를 먼저 받고, 그 값으로 구단주 정보와 경기 기록을 조회합니다.
 * 매치 종류·등급·선수·포지션은 숫자로 오므로 `get...Meta()` 로 이름을 찾아 바꿉니다.
 * 경기 데이터는 매시 정각에 두 시간 전까지의 내용이 갱신됩니다.
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
   * 구단주 닉네임으로 계정 고유 번호(ouid)를 받아 온다. 구단주 정보와 경기 기록을 조회할 때 이 값을 넣는다.
   *
   * @param nickname - 게임에서 쓰는 구단주 닉네임
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
    assertNonEmptyString(nickname, 'nickname', undefined, 'trim-truthy');
    const url = this.buildUrl('id');
    const response = await this.http.get<{ ouid: string }>(url, { nickname }, FC_OUID_SHAPE);
    return response.ouid as OUID;
  }

  /**
   * 구단주 기본 정보(닉네임과 레벨)를 조회한다.
   *
   * @param ouid - 계정 고유 번호. {@link FcOnlineClient.getOuid} 로 얻는다
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
    assertNonEmptyString(ouid, 'ouid', undefined, 'trim-truthy');
    const url = this.buildUrl('user/basic');
    return this.http.get<FcUserBasic>(url, { ouid: ouid as string }, FC_USER_BASIC_SHAPE);
  }

  /**
   * 역대 최고 등급(디비전)과 달성 일자를 매치 종류별로 조회한다.
   *
   * 최고 등급은 공식경기·감독모드·볼타 공식처럼 매치 종류마다 따로 있어서 항상 배열로 돌려준다.
   * 한 종류만 있어도 길이 1인 배열이다. `matchType` 은 {@link FcOnlineClient.getMatchTypeMeta},
   * `division` 은 {@link FcOnlineClient.getDivisionMeta} (볼타는 {@link FcOnlineClient.getDivisionVoltaMeta}) 로
   * 이름을 찾는다.
   *
   * @param ouid - 계정 고유 번호. {@link FcOnlineClient.getOuid} 로 얻는다
   * @throws {NexonBadRequestError} ouid가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const divisions = await client.fcOnline.getMaxDivision(ouid);
   * for (const division of divisions) {
   *   // matchType 50 = 공식경기, 52 = 감독모드. division 은 등급 번호 (예: 800 = 슈퍼 챔피언스)
   *   console.log(`매치 ${division.matchType} — 등급 ${division.division}`);
   * }
   * ```
   */
  async getMaxDivision(ouid: OUID): Promise<readonly FcMaxDivision[]> {
    assertNonEmptyString(ouid, 'ouid', undefined, 'trim-truthy');
    const url = this.buildUrl('user/maxdivision');
    const response = await this.http.get<FcMaxDivision | FcMaxDivision[]>(
      url,
      { ouid },
      FC_MAX_DIVISION_SHAPE,
    );
    return Array.isArray(response) ? response : [response];
  }

  /**
   * 구단주가 치른 경기의 매치 번호 목록을 매치 종류별로 조회한다 (최근 경기부터).
   *
   * 경기 내용은 받은 매치 번호를 {@link FcOnlineClient.getMatchDetail} 에 넣어 조회합니다.
   * 더 예전 경기는 `offset` 을 늘려 이어서 조회합니다.
   *
   * @param params.ouid - 계정 고유 번호. {@link FcOnlineClient.getOuid} 로 얻는다
   * @param params.matchtype - 매치 종류 번호 (50: 공식경기, 52: 감독모드, 214: 볼타 공식 등. 전체 목록은 {@link FcOnlineClient.getMatchTypeMeta})
   * @param params.offset - 건너뛸 경기 수 (기본값: 0)
   * @param params.limit - 가져올 경기 수 (최대 100, 기본값: 100)
   * @throws {NexonBadRequestError} ouid 또는 matchtype이 유효하지 않을 때
   *
   * @example
   * ```ts
   * // 전적 검색: 공식경기 최근 10경기의 매치 번호
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
    assertNonEmptyString(params.ouid, 'ouid', undefined, 'trim-truthy');
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
   * 내 이적시장 거래 기록(거래한 선수 카드, 강화 등급, 거래 가격)을 조회한다 (최근 거래부터).
   *
   * API 키를 발급한 넥슨 계정 본인의 이적시장 거래 기록만 조회됩니다.
   *
   * @param params.tradetype - 거래 종류 (`'buy'`: 구입, `'sell'`: 판매)
   * @param params.offset - 건너뛸 거래 수 (기본값: 0)
   * @param params.limit - 가져올 거래 수 (최대 100, 기본값: 100)
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
   * 모든 구단주의 매치 번호 목록을 매치 종류별로 요청한다. 더 이상 쓸 수 없다.
   *
   * @deprecated 넥슨이 2026년 7월 7일 제공을 종료했습니다. 개별 계정의 기록은 {@link FcOnlineClient.getMatchList}를 사용하세요.
   * @see https://openapi.nexon.com/support/notice/3495136/
   *
   * @param params.matchtype - 매치 종류 번호 (50: 공식경기, 52: 감독모드 등)
   * @param params.offset - 건너뛸 경기 수 (기본값: 0)
   * @param params.limit - 가져올 경기 수 (최대 100, 기본값: 100)
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
   * 경기 한 판의 상세 기록(승패, 점유율, 슛·패스·수비 통계, 출전 선수별 평점)을 조회한다.
   *
   * 경기에 참여한 구단주마다 `matchInfo` 항목이 하나씩 들어 있습니다.
   * 매치 통계가 생성되기 전에 상대방이 종료하면 상대 정보가 없을 수 있습니다.
   *
   * @param matchId - 매치 번호. {@link FcOnlineClient.getMatchList} 로 얻는다
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
    assertNonEmptyString(matchId, 'matchid', undefined, 'trim-truthy');
    const url = this.buildUrl('match-detail');
    return this.http.get<FcMatchDetail>(url, { matchid: matchId }, FC_MATCH_DETAIL_SHAPE);
  }

  // ─── 랭커 정보 조회 (Ranker) ────────────────────────────────────────────

  /**
   * TOP 10,000 랭커가 쓴 선수 카드의 포지션별 20경기 평균 기록(골·어시스트·패스·수비 등)을 조회한다.
   *
   * 선수 카드 번호(spid)와 포지션 번호를 짝지어 넣습니다. 한 번에 50명 이내를 권장합니다
   * (너무 많으면 넥슨 서버가 요청을 거절할 수 있음). 목록의 인코딩은 SDK가 처리합니다.
   *
   * @param params.matchtype - 매치 종류 번호 (50: 공식경기, 52: 감독모드 등)
   * @param params.players - 조회할 선수 목록. `id` 는 선수 카드 번호(spid), `po` 는 포지션 번호 ({@link FcOnlineClient.getSpPositionMeta} 참고, 예: 0 = GK)
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
   *   console.log(`선수 카드 ${s.spid} — 평균 골 ${s.status.goal}, 패스 ${s.status.passSuccess}`);
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
   * 매치 종류 번호와 이름(50 = 공식경기, 52 = 감독모드, 214 = 볼타 공식 등) 목록을 조회한다. API 키 없이도 받을 수 있는 공개 목록이다.
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
   * 모든 선수 카드의 번호(spid)와 선수 이름 목록을 조회한다.
   *
   * 선수 카드 번호(spid)는 클래스 번호 3자리 + 선수 번호(pid) 6자리입니다.
   * 같은 선수라도 클래스(시즌 카드)가 다르면 spid 가 다릅니다. 목록이 크므로 한 번 받아 두고 재사용하세요.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * // 거래 기록의 선수 카드 번호를 선수 이름으로 바꾸기
   * const players = await client.fcOnline.getSpidMeta();
   * const nameBySpid = new Map(players.map((p) => [p.id, p.name]));
   * console.log(nameBySpid.get(100167680));
   * ```
   */
  async getSpidMeta(): Promise<FcSpidMeta[]> {
    return this.http.get<FcSpidMeta[]>(FC_METADATA_ENDPOINTS.SPID, undefined, FC_SPID_META_SHAPE);
  }

  /**
   * 선수 클래스(시즌 카드) 번호와 이름 목록을 예전 형식으로 조회한다. 더 이상 권장하지 않는다.
   *
   * 여기서 말하는 시즌 아이디는 공식경기 시즌이 아니라 선수 클래스 번호입니다.
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
   * 포지션 번호와 이름(0 = GK, 1 = SW 등) 목록을 조회한다.
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
   * 공식경기 등급(디비전) 번호와 이름(800 = 슈퍼 챔피언스, 900 = 챔피언스 등) 목록을 조회한다.
   *
   * @throws {NexonError} 메타데이터를 가져오지 못했을 때
   *
   * @example
   * ```ts
   * const divisions = await client.fcOnline.getDivisionMeta();
   * // [{ divisionId: 800, divisionName: "슈퍼 챔피언스" }, ...]
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
   * 볼타 공식경기 등급 번호와 이름(1100 = 월드 스타 등) 목록을 조회한다.
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
   * 공식경기·감독모드의 현재(최신) 시즌 번호를 조회한다.
   *
   * 경기 기록의 `seasonId` 가 이 목록에 없으면 EA 리그 경기로 구분할 수 있습니다.
   * 넥슨은 시즌 번호를 문자열로 주지만 SDK는 숫자(`seasonId`)로 바꿔 돌려줍니다.
   * 선수 클래스(시즌 카드)는 이 메서드가 아니라 {@link FcOnlineClient.getClassMeta} 로 조회합니다.
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
   * 선수 클래스(ICON TM 같은 시즌 카드 종류)의 번호·이름·아이콘 이미지 목록을 조회한다.
   *
   * 클래스 번호는 선수 카드 번호(spid)의 앞 3자리입니다.
   * 넥슨 공지에 따라 기존 {@link FcOnlineClient.getSeasonIdMeta} 를 대체합니다.
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
   * 선수 카드 번호(spid) 또는 선수 번호(pid)로 선수 액션샷 이미지 주소를 만든다.
   *
   * 주소만 만들고 서버에 요청하지 않습니다. 선수에 따라 spid 주소와 pid 주소 중 한쪽에만
   * 이미지가 있으므로, spid 주소가 열리지 않으면 pid(spid 의 뒤 6자리, 앞쪽 0 제외)로 다시 시도하세요.
   *
   * @param spid - 선수 카드 번호(spid, 클래스 3자리 + 선수 번호 6자리) 또는 선수 번호(pid)
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
   * 선수 카드 번호(spid) 또는 선수 번호(pid)로 선수 얼굴 이미지 주소를 만든다.
   *
   * 주소만 만들고 서버에 요청하지 않습니다. 선수에 따라 spid 주소와 pid 주소 중 한쪽에만
   * 이미지가 있으므로, spid 주소가 열리지 않으면 pid(spid 의 뒤 6자리, 앞쪽 0 제외)로 다시 시도하세요.
   *
   * @param spid - 선수 카드 번호(spid, 클래스 3자리 + 선수 번호 6자리) 또는 선수 번호(pid)
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
