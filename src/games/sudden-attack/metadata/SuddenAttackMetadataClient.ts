import type { HttpClient } from '../../../core/http/HttpClient.js';
import { SUDDEN_ATTACK_ENDPOINTS } from '../endpoints.js';
import { GRADE_SHAPE, LOGO_SHAPE, SEASON_GRADE_SHAPE, TIER_SHAPE } from '../shapes.js';
import type {
  SuddenAttackLogo,
  SuddenAttackGradeMeta,
  SuddenAttackSeasonGradeMeta,
  SuddenAttackTierMeta,
} from './types.js';

/** 서든어택 정적 메타데이터 API. */
export class SuddenAttackMetadataClient {
  constructor(private readonly http: HttpClient) {}

  /**
   * 서든어택 로고의 이미지 주소를 조회한다.
   *
   * @throws {NexonError} 메타데이터 요청에 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 전적 검색기 상단에 공식 로고를 표시할 때
   * const result = await client.suddenAttack.metadata.getLogo();
   * console.log(result);
   * ```
   */
  async getLogo(): Promise<SuddenAttackLogo> {
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.LOGO, undefined, LOGO_SHAPE);
  }

  /**
   * 통합 계급과 계급 배지의 이미지 주소를 조회한다.
   *
   * @throws {NexonError} 메타데이터 요청에 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 클랜원 프로필에 통합 계급 배지를 붙일 때
   * const result = await client.suddenAttack.metadata.getGrade();
   * console.log(result);
   * ```
   */
  async getGrade(): Promise<readonly SuddenAttackGradeMeta[]> {
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.GRADE, undefined, GRADE_SHAPE);
  }

  /**
   * 시즌 계급과 계급 배지의 이미지 주소를 조회한다.
   *
   * @throws {NexonError} 메타데이터 요청에 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 클랜 랭킹 표에 시즌 계급 배지를 붙일 때
   * const result = await client.suddenAttack.metadata.getSeasonGrade();
   * console.log(result);
   * ```
   */
  async getSeasonGrade(): Promise<readonly SuddenAttackSeasonGradeMeta[]> {
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.SEASON_GRADE, undefined, SEASON_GRADE_SHAPE);
  }

  /**
   * 랭크전 티어와 티어 배지의 이미지 주소를 조회한다.
   *
   * @throws {NexonError} 메타데이터 요청에 실패했을 때
   *
   * @example
   * ```ts
   * import { NexonClient } from 'nexon-open-api';
   *
   * const apiKey = process.env['NEXON_API_KEY'];
   * if (!apiKey) throw new Error('NEXON_API_KEY를 설정하세요.');
   * const client = new NexonClient({ apiKey });
   *
   * // 파티 모집 게시판에 랭크전 티어 배지를 표시할 때
   * const result = await client.suddenAttack.metadata.getTier();
   * console.log(result);
   * ```
   */
  async getTier(): Promise<readonly SuddenAttackTierMeta[]> {
    return this.http.get(SUDDEN_ATTACK_ENDPOINTS.TIER, undefined, TIER_SHAPE);
  }
}
