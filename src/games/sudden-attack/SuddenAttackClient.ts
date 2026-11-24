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

  /** 계정 정보 API. */
  get user(): SuddenAttackUserClient {
    return (this._user ??= new SuddenAttackUserClient(this.http));
  }

  /** 매치 API. */
  get match(): SuddenAttackMatchClient {
    return (this._match ??= new SuddenAttackMatchClient(this.http));
  }

  /** 로고, 계급, 티어 메타데이터 API. */
  get metadata(): SuddenAttackMetadataClient {
    return (this._metadata ??= new SuddenAttackMetadataClient(this.http));
  }

  /**
   * 닉네임으로 서든어택 계정 식별자를 조회합니다.
   *
   * @param userName - 조회할 닉네임
   * @throws {TypeError} 닉네임이 비어 있을 때
   * @throws {NexonNotFoundError} 계정을 찾을 수 없을 때
   * @throws {NexonAuthError} API 키가 유효하지 않을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const client = new NexonClient({ apiKey: 'YOUR_API_KEY' });
   * const ouid = await client.suddenAttack.getOuid('닉네임');
   * console.log(ouid);
   * ```
   */
  async getOuid(userName: string): Promise<SuddenAttackOuid> {
    if (typeof userName !== 'string' || userName.trim() === '') {
      throw new TypeError('userName이 비어 있습니다. 조회할 서든어택 닉네임을 입력하세요.');
    }

    const response = await this.http.get<SuddenAttackOuidResponse>(
      SUDDEN_ATTACK_ENDPOINTS.ID,
      { user_name: userName },
      OUID_SHAPE,
    );
    return response.ouid;
  }
}
