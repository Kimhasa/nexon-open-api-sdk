import type { CharacterList } from '../../../src/games/maplestory/character/types.js';
import type { Achievement } from '../../../src/games/maplestory/user-types.js';
import type { OCID } from '../../../src/games/_base/maple-base-types.js';

/** GET /maplestory/v1/character/list — 포털 스펙 스키마로 합성한 응답 */
export const characterListFixture: CharacterList = {
  account_list: [
    {
      account_id: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      character_list: [
        {
          ocid: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz' as OCID,
          character_name: '테스트캐릭터',
          world_name: '스카니아',
          character_class: '아크메이지(불,독)',
          character_level: 10,
        },
      ],
    },
  ],
};

/** GET /maplestory/v1/user/achievement — 포털 스펙 스키마로 합성한 응답 */
export const achievementFixture: Achievement = {
  account_list: [
    {
      account_id: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      achievement_achieve: [
        {
          achievement_name: '샘플 업적',
          achievement_description: '설명 텍스트',
        },
      ],
    },
  ],
};

/** GET /maplestory/legacy/ouid — 포털 스펙 스키마로 합성한 응답 */
export const legacyOuidFixture = {
  ouid: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
};

/** GET /maplestory/v1/ouid — 포털 스펙 스키마로 합성한 응답 */
export const ouidFixture = {
  ouid: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
};
