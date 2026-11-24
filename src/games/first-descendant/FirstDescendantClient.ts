import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { FirstDescendantLeaderboardClient } from './leaderboard/FirstDescendantLeaderboardClient.js';
import { FirstDescendantMetaClient } from './meta/FirstDescendantMetaClient.js';
import { FirstDescendantRecommendationClient } from './recommendation/FirstDescendantRecommendationClient.js';
import { TFD_OUID_SHAPE } from './shapes.js';
import type { TfdOuid } from './types.js';
import { FirstDescendantUserClient } from './user/FirstDescendantUserClient.js';

/**
 * 퍼스트 디센던트 (The First Descendant) 클라이언트.
 *
 * 포털 스펙: `specs/openapi/tfd/` (https://openapi.nexon.com/ko/game/tfd/)
 *
 * @example
 * ```ts
 * import { NexonClient } from 'nexon-open-api';
 *
 * const apiKey = process.env['NEXON_API_KEY'];
 * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
 * const client = new NexonClient({ apiKey });
 *
 * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
 * const basic = await client.firstDescendant.user.getBasic({ ouid });
 * const descendants = await client.firstDescendant.meta.getDescendant('ko');
 * ```
 */
export class FirstDescendantClient extends AbstractGameClient {
  protected readonly pathPrefix = 'tfd';

  private _user: FirstDescendantUserClient | undefined;
  private _meta: FirstDescendantMetaClient | undefined;
  private _recommendation: FirstDescendantRecommendationClient | undefined;
  private _leaderboard: FirstDescendantLeaderboardClient | undefined;

  /**
   * 닉네임과 태그로 계정 고유 번호를 조회한다.
   *
   * 닉네임은 대소문자를 구분하며 `#` 뒤 태그까지 포함해야 한다.
   * 게임 콘텐츠 변경으로 ouid가 바뀔 수 있으므로 오래 보관한 값은 다시 조회한다.
   *
   * @param userName - 대소문자와 태그를 포함한 닉네임(예: `'닉네임#1234'`)
   * @throws {NexonBadRequestError} userName이 비어 있을 때 (요청 전 SDK 검증)
   * @throws {NexonBadRequestError} 닉네임 형식이 잘못됐거나 계정을 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   * @throws {NexonRateLimitError} 호출 한도를 초과했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 빌드 검색에서 입력한 닉네임을 계정 번호로 바꿀 때
   * const ouid = await client.firstDescendant.getOuid('닉네임#1234');
   * const basic = await client.firstDescendant.user.getBasic({ ouid });
   * ```
   */
  async getOuid(userName: string): Promise<TfdOuid> {
    assertNonEmptyString(
      userName,
      'userName',
      "게임 내 닉네임을 태그까지 포함해 넘기세요. 예: getOuid('닉네임#1234') (대소문자 구분)",
    );
    const notFound = {
      message: `'${userName}' 계정을 찾을 수 없습니다.`,
      hint: "닉네임은 '#' 뒤 태그까지 대소문자를 맞춰 넣습니다 (예: '닉네임#1234'). .env 에서 읽었다면 값을 큰따옴표로 감쌌는지 확인하세요 ('#' 뒤가 주석으로 잘립니다).",
    };
    const response = await lookupByName(
      () =>
        this.http.get<{ ouid: string }>(
          this.buildUrl('id'),
          { user_name: userName },
          TFD_OUID_SHAPE,
        ),
      notFound,
    );
    return response.ouid as TfdOuid;
  }

  /** 프로필·장착 계승자·장비·아르케 조율을 조회하는 계정 메뉴. */
  get user(): FirstDescendantUserClient {
    this._user ??= new FirstDescendantUserClient(this.http);
    return this._user;
  }

  /** 계승자·무기·모듈의 번호를 이름으로 바꾸는 게임 도감. */
  get meta(): FirstDescendantMetaClient {
    this._meta ??= new FirstDescendantMetaClient(this.http);
    return this._meta;
  }

  /** 보이드 요격전 성공 기록으로 추천 모듈을 찾는 메뉴. */
  get recommendation(): FirstDescendantRecommendationClient {
    this._recommendation ??= new FirstDescendantRecommendationClient(this.http);
    return this._recommendation;
  }

  /** 보이드 요격전과 보이드 침식 정화 - 도전의 순위를 보는 메뉴. */
  get leaderboard(): FirstDescendantLeaderboardClient {
    this._leaderboard ??= new FirstDescendantLeaderboardClient(this.http);
    return this._leaderboard;
  }
}
