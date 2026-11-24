import { HttpClient } from '../../core/http/HttpClient.js';
import { AbstractMapleBaseClient } from '../_base/AbstractMapleStoryBaseClient.js';
import type { OCID } from '../_base/maple-base-types.js';
import { MapleStoryCharacterClient } from './character/MapleStoryCharacterClient.js';
import { MapleStoryUnionClient } from './union/MapleStoryUnionClient.js';
import { MapleStoryGuildClient } from './guild/MapleStoryGuildClient.js';
import { MapleStoryHistoryClient } from './history/MapleStoryHistoryClient.js';
import { MapleStoryRankingClient } from './ranking/MapleStoryRankingClient.js';
import { MapleStoryNoticeClient } from './notice/MapleStoryNoticeClient.js';
import { MapleStoryBattlePracticeClient } from './battle-practice/MapleStoryBattlePracticeClient.js';
import { MapleStorySchedulerClient } from './scheduler/MapleStorySchedulerClient.js';
import { assertNonEmptyString } from './validation.js';
import { OCID_SHAPE, OUID_SHAPE, ACHIEVEMENT_SHAPE } from './shapes.js';
import type { Achievement } from './user-types.js';

/**
 * 메이플스토리 (KMS) 클라이언트.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * const union = await client.maplestory.union.get({ ocid });
 * const ranking = await client.maplestory.ranking.getOverall({ date: '2026-11-01' });
 * const state = await client.maplestory.scheduler.getCharacterState({ ocid });
 * const replays = await client.maplestory.battlePractice.getReplayId({ ocid });
 * ```
 */
export class MapleStoryClient extends AbstractMapleBaseClient {
  protected readonly pathPrefix = 'maplestory';
  protected readonly timezoneOffset = 540; // UTC+9 (KST)

  private _character: MapleStoryCharacterClient | undefined;
  private _union: MapleStoryUnionClient | undefined;
  private _guild: MapleStoryGuildClient | undefined;
  private _history: MapleStoryHistoryClient | undefined;
  private _ranking: MapleStoryRankingClient | undefined;
  private _notice: MapleStoryNoticeClient | undefined;
  private _battlePractice: MapleStoryBattlePracticeClient | undefined;
  private _scheduler: MapleStorySchedulerClient | undefined;

  /** 캐릭터 관련 API (24개 엔드포인트) */
  get character(): MapleStoryCharacterClient {
    this._character ??= new MapleStoryCharacterClient(this.http);
    return this._character;
  }

  /** 유니온 관련 API (4개 엔드포인트) */
  get union(): MapleStoryUnionClient {
    this._union ??= new MapleStoryUnionClient(this.http);
    return this._union;
  }

  /** 길드 관련 API (2개 엔드포인트) */
  get guild(): MapleStoryGuildClient {
    this._guild ??= new MapleStoryGuildClient(this.http);
    return this._guild;
  }

  /** 확률/이력 관련 API (4개 엔드포인트) */
  get history(): MapleStoryHistoryClient {
    this._history ??= new MapleStoryHistoryClient(this.http);
    return this._history;
  }

  /** 랭킹 관련 API (6개 엔드포인트) */
  get ranking(): MapleStoryRankingClient {
    this._ranking ??= new MapleStoryRankingClient(this.http);
    return this._ranking;
  }

  /** 공지사항 관련 API (8개 엔드포인트) */
  get notice(): MapleStoryNoticeClient {
    this._notice ??= new MapleStoryNoticeClient(this.http);
    return this._notice;
  }

  /** 연무장 관련 API (4개 엔드포인트) */
  get battlePractice(): MapleStoryBattlePracticeClient {
    this._battlePractice ??= new MapleStoryBattlePracticeClient(this.http);
    return this._battlePractice;
  }

  /** 스케줄러 관련 API (1개 엔드포인트) */
  get scheduler(): MapleStorySchedulerClient {
    this._scheduler ??= new MapleStorySchedulerClient(this.http);
    return this._scheduler;
  }

  /**
   * 캐릭터명으로 OCID를 조회한다.
   *
   * @param characterName - 조회할 캐릭터명
   * @throws {NexonBadRequestError} 캐릭터명이 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('Arturia');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    assertNonEmptyString(
      characterName,
      'characterName',
      "조회할 캐릭터명을 전달하세요. 예: client.maplestory.getOcid('캐릭터명')",
    );
    const url = this.buildUrl('id');
    const response = await this.http.get<{ ocid: string }>(
      url,
      { character_name: characterName },
      OCID_SHAPE,
    );
    return response.ocid as OCID;
  }

  /**
   * 계정 식별자(ouid)를 조회한다.
   *
   * API 키에 연결된 계정의 ouid를 반환합니다.
   * 구 개발자센터에서 발급받은 API 키의 ouid가 필요하면 {@link getLegacyOuid} 를 사용하세요.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const ouid = await client.maplestory.getOuid();
   * ```
   */
  async getOuid(): Promise<string> {
    const url = this.buildUrl('ouid');
    const response = await this.http.get<{ ouid: string }>(url, undefined, OUID_SHAPE);
    return response.ouid;
  }

  /**
   * 구 개발자센터 API 키로 계정 식별자(ouid)를 조회한다.
   *
   * `GET /maplestory/legacy/ouid`. {@link getOuid} (`/maplestory/v1/ouid`) 와 응답 형태(`{ ouid }`)는
   * 같지만 인증 방식이 다릅니다. `getOuid` 는 현재 Open API 포털 키를 `x-nxopen-api-key` 헤더로
   * 보내고, 이 메서드는 구 개발자센터에서 발급받은 키를 `x-nxopen-legacy-api-key` 헤더로 보냅니다.
   * 그래서 `NexonClient` 의 `apiKey` 가 아니라 인자로 받은 키를 사용합니다.
   *
   * 이 요청은 전용 연결로 보내므로 `NexonClient` 에 설정한 `timeoutMs`·`maxRetries`·`logger`·
   * 인터셉터가 적용되지 않고 SDK 기본값(타임아웃 10초, 429/503 최대 3회 재시도)으로 동작합니다.
   *
   * @param legacyApiKey - 구 개발자센터에서 발급받은 API 키
   *
   * @throws {NexonBadRequestError} legacyApiKey가 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonAuthError} 구 API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const client = new NexonClient({ apiKey: 'your-api-key' });
   * const legacyOuid = await client.maplestory.getLegacyOuid('your-legacy-api-key');
   * ```
   */
  async getLegacyOuid(legacyApiKey: string): Promise<string> {
    assertNonEmptyString(
      legacyApiKey,
      'legacyApiKey',
      '구 개발자센터에서 발급받은 API 키를 전달하세요. 현재 포털 키의 ouid는 getOuid() 로 조회합니다.',
    );
    // HttpClient는 요청별 헤더를 받지 않고 x-nxopen-api-key만 주입한다.
    // 공유 http에 인터셉터를 걸면 다른 요청에도 영향을 주므로, 이 호출 전용 인스턴스에서 헤더 이름만 바꾼다.
    const legacyHttp = new HttpClient({ apiKey: legacyApiKey });
    legacyHttp.addRequestInterceptor((request) => {
      const { 'x-nxopen-api-key': key, ...headers } = request.headers;
      return {
        ...request,
        headers: { ...headers, 'x-nxopen-legacy-api-key': key ?? legacyApiKey },
      };
    });
    const url = this.buildUrl('ouid', 'legacy');
    const response = await legacyHttp.get<{ ouid: string }>(url, undefined, OUID_SHAPE);
    return response.ouid;
  }

  /**
   * 계정의 업적 정보를 조회한다.
   *
   * API 키에 연결된 계정의 달성 업적 목록을 반환합니다.
   * 파라미터 없이 API 키만으로 식별됩니다.
   *
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 요청 한도 초과 시
   *
   * @example
   * ```ts
   * const achievement = await client.maplestory.getAchievement();
   * for (const account of achievement.account_list) {
   *   for (const a of account.achievement_achieve) {
   *     console.log(`${a.achievement_name}: ${a.achievement_description}`);
   *   }
   * }
   * ```
   *
   */
  async getAchievement(): Promise<Achievement> {
    const url = this.buildUrl('user/achievement');
    return this.http.get<Achievement>(url, undefined, ACHIEVEMENT_SHAPE);
  }
}
