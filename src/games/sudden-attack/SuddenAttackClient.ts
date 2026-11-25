import { assertNonEmptyString } from '../../core/validation/input.js';
import { lookupByName } from '../../core/errors/name-lookup.js';
import { AbstractGameClient } from '../_base/AbstractGameClient.js';
import { SUDDEN_ATTACK_ENDPOINTS } from './endpoints.js';
import { SuddenAttackMatchClient } from './match/SuddenAttackMatchClient.js';
import { SuddenAttackMetadataClient } from './metadata/SuddenAttackMetadataClient.js';
import { OUID_SHAPE } from './shapes.js';
import type { SuddenAttackOuid, SuddenAttackOuidResponse } from './types.js';
import { SuddenAttackUserClient } from './user/SuddenAttackUserClient.js';

/** 서든어택 Open API 클라이언트. */
export class SuddenAttackClient extends AbstractGameClient {
  protected readonly pathPrefix = 'suddenattack';

  private _user: SuddenAttackUserClient | undefined;
  private _match: SuddenAttackMatchClient | undefined;
  private _metadata: SuddenAttackMetadataClient | undefined;

  /** 서든어택 유저의 프로필·클랜·계급·티어를 조회하는 메뉴. */
  get user(): SuddenAttackUserClient {
    return (this._user ??= new SuddenAttackUserClient(this.http));
  }

  /** 최근 매치와 참가자별 전적을 조회하는 메뉴. */
  get match(): SuddenAttackMatchClient {
    return (this._match ??= new SuddenAttackMatchClient(this.http));
  }

  /** 서든어택 로고와 통합 계급·시즌 계급·랭크전 티어 배지 이미지. */
  get metadata(): SuddenAttackMetadataClient {
    return (this._metadata ??= new SuddenAttackMetadataClient(this.http));
  }

  /**
   * 닉네임으로 계정 식별자를 조회한다.
   *
   * @param userName - 조회할 서든어택 닉네임
   * @throws {NexonBadRequestError} 닉네임이 비어 있을 때
   * @throws {NexonNotFoundError} 계정을 찾을 수 없을 때
   * @throws {NexonAuthError} API Key가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 클랜원 검색에 입력한 닉네임을 식별자로 바꿀 때
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * console.log(ouid);
   * ```
   */
  async getOuid(userName: string): Promise<SuddenAttackOuid> {
    assertNonEmptyString(userName, 'userName', '조회할 서든어택 닉네임을 입력하세요.');

    const notFound = {
      message: `'${userName}' 계정을 찾을 수 없습니다.`,
      hint: '서든어택 닉네임을 확인하세요. 닉네임을 바꿨다면 새 닉네임으로 조회합니다.',
    };
    const response = await lookupByName(
      () =>
        this.http.get<SuddenAttackOuidResponse>(
          SUDDEN_ATTACK_ENDPOINTS.ID,
          { user_name: userName },
          OUID_SHAPE,
        ),
      notFound,
    );
    return response.ouid;
  }
}
