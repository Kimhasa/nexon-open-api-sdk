import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
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
import { OCID_SHAPE, OUID_SHAPE, ACHIEVEMENT_SHAPE } from './shapes.js';
import type { Achievement } from './user-types.js';

/**
 * 메이플스토리(한국 서버) 클라이언트.
 *
 * 캐릭터 이름으로 캐릭터 고유 번호(OCID)를 먼저 받고, 그 값으로 캐릭터·유니온 정보를 조회합니다.
 * 날짜는 모두 한국 시간(KST, UTC+9) 기준입니다.
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const client = new NexonClient({ apiKey: 'your-api-key' });
 *
 * const ocid = await client.maplestory.getOcid('캐릭터명');
 * const basic = await client.maplestory.character.getBasic({ ocid });
 * const union = await client.maplestory.union.getUnion({ ocid });
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

  /** 캐릭터 정보: 스탯·장비·스킬·심볼·무릉도장 등 (23개) */
  get character(): MapleStoryCharacterClient {
    this._character ??= new MapleStoryCharacterClient(this.http);
    return this._character;
  }

  /** 유니온: 레벨·등급, 공격대 배치, 아티팩트, 챔피언 (4개) */
  get union(): MapleStoryUnionClient {
    this._union ??= new MapleStoryUnionClient(this.http);
    return this._union;
  }

  /** 길드: 길드 고유 번호와 길드 기본 정보 (2개) */
  get guild(): MapleStoryGuildClient {
    this._guild ??= new MapleStoryGuildClient(this.http);
    return this._guild;
  }

  /** 내 계정의 강화 기록: 스타포스, 큐브, 잠재능력 재설정, 소울 잠재능력 재설정 (4개) */
  get history(): MapleStoryHistoryClient {
    this._history ??= new MapleStoryHistoryClient(this.http);
    return this._history;
  }

  /** 랭킹: 종합·유니온·길드·무릉도장·더 시드·업적 (6개) */
  get ranking(): MapleStoryRankingClient {
    this._ranking ??= new MapleStoryRankingClient(this.http);
    return this._ranking;
  }

  /** 공지: 공지사항·업데이트·진행 중 이벤트·캐시샵 (8개) */
  get notice(): MapleStoryNoticeClient {
    this._notice ??= new MapleStoryNoticeClient(this.http);
    return this._notice;
  }

  /** 연무장: 리플레이별 측정 결과와 스킬 사용 내역 (4개) */
  get battlePractice(): MapleStoryBattlePracticeClient {
    this._battlePractice ??= new MapleStoryBattlePracticeClient(this.http);
    return this._battlePractice;
  }

  /** 스케줄러: 일일·주간·보스 콘텐츠 수행 현황 (1개) */
  get scheduler(): MapleStorySchedulerClient {
    this._scheduler ??= new MapleStorySchedulerClient(this.http);
    return this._scheduler;
  }

  /**
   * 캐릭터 이름으로 캐릭터 고유 번호(OCID)를 받아 온다. 캐릭터 정보를 조회하는 메서드에 이 값을 넣는다.
   *
   * @param characterName - 게임에서 쓰는 캐릭터 이름
   * @throws {NexonBadRequestError} 캐릭터명이 비어 있을 때 (요청 전 즉시 throw)
   * @throws {NexonNotFoundError} 캐릭터를 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * const ocid = await client.maplestory.getOcid('캐릭터명');
   * ```
   */
  async getOcid(characterName: string): Promise<OCID> {
    assertNonEmptyString(
      characterName,
      'characterName',
      "조회할 캐릭터명을 전달하세요. 예: client.maplestory.getOcid('캐릭터명')",
    );
    const url = this.buildUrl('id');
    const notFound = {
      message: `'${characterName}' 캐릭터를 찾을 수 없습니다.`,
      hint: '캐릭터 이름의 띄어쓰기와 대소문자를 확인하세요. 닉네임을 바꿨다면 새 이름으로 조회합니다.',
    };
    const response = await lookupByName(
      () => this.http.get<{ ocid: string }>(url, { character_name: characterName }, OCID_SHAPE),
      notFound,
    );
    return response.ocid as OCID;
  }

  /**
   * API 키를 발급받은 넥슨 계정의 고유 번호(ouid)를 조회한다.
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
   * 구 개발자센터 API 키로 계정 고유 번호(ouid)를 조회한다.
   *
   * `GET /maplestory/legacy/ouid`. {@link getOuid} (`/maplestory/v1/ouid`) 와 응답 형태(`{ ouid }`)는
   * 같지만 인증 방식이 다릅니다. `getOuid` 는 현재 Open API 포털 키를 `x-nxopen-api-key` 헤더로
   * 보내고, 이 메서드는 구 개발자센터에서 발급받은 키를 `x-nxopen-legacy-api-key` 헤더로 보냅니다.
   * 그래서 `NexonClient` 의 `apiKey` 가 아니라 인자로 받은 키를 사용합니다.
   *
   * `NexonClient` 에 설정한 `timeoutMs`·`maxRetries`·`logger`·인터셉터는 다른 요청과 똑같이 적용됩니다.
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
    const url = this.buildUrl('ouid', 'legacy');
    // 구 키 전용 경로라 현재 포털 키(x-nxopen-api-key)는 보내지 않는다
    const response = await this.http.get<{ ouid: string }>(url, undefined, OUID_SHAPE, {
      headers: { 'x-nxopen-api-key': undefined, 'x-nxopen-legacy-api-key': legacyApiKey },
    });
    return response.ouid;
  }

  /**
   * 내 계정이 달성한 업적 목록을 조회한다. API 키를 발급받은 계정이 기준이다.
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
