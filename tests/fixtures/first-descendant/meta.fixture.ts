// 정적 메타데이터는 API 키 없이 실데이터가 내려온다 (https://open.api.nexon.com/static/tfd/meta/...).
// 아래 값은 2026-11-24 실응답에서 원소 1~2개만 남기고 중첩 배열도 줄인 것이다.
// 160자를 넘는 설명 문자열은 '...' 로 잘랐다. 개인 데이터는 없다.

import type {
  TfdDescendantMeta,
  TfdWeaponMeta,
  TfdModuleMeta,
  TfdReactorMeta,
  TfdExternalComponentMeta,
  TfdRewardMeta,
  TfdStatMeta,
  TfdVoidBattleMeta,
  TfdTitleMeta,
  TfdDescendantLevelDetailMeta,
  TfdMasteryRankLevelDetailMeta,
  TfdConsumableMaterialMeta,
  TfdResearchMeta,
  TfdAmorphousRewardMeta,
  TfdAcquisitionDetailMeta,
  TfdWeaponTypeMeta,
  TfdFellowMeta,
  TfdFellowLevelDetailMeta,
  TfdTierMeta,
  TfdCoreSlotMeta,
  TfdCoreTypeMeta,
  TfdDescendantGroupMeta,
  TfdAdaptLevelMeta,
  TfdArcheTuningBoardGroupMeta,
  TfdArcheTuningBoardMeta,
  TfdArcheTuningNodeMeta,
  TfdCustomizingItemMeta,
  TfdMedalMeta,
  TfdVehicleMeta,
  TfdCollectibleItemMeta,
  TfdNodeItemMeta,
  TfdNodeSocketTypeMeta,
} from '../../../src/games/first-descendant/meta/types.js';

/** 계승자 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdDescendantMetaFixture: TfdDescendantMeta[] = [
  {
    descendant_id: '101000027',
    descendant_name: '세레나',
    descendant_group_id: '101200027',
    descendant_image_url:
      'https://open.api.nexon.com/static/tfd/img/d106721e64d412727aec86fca600ad22',
    descendant_stat: [
      {
        level: 1,
        stat_detail: [
          {
            stat_id: '105000001',
            stat_value: 187,
          },
        ],
      },
      {
        level: 2,
        stat_detail: [
          {
            stat_id: '105000001',
            stat_value: 189,
          },
        ],
      },
    ],
    descendant_skill: [
      {
        skill_type: '액티브 스킬',
        skill_name: '성스러운 불꽃',
        element_type: '화염',
        arche_type: '특이',
        skill_image_url:
          'https://open.api.nexon.com/static/tfd/img/49bf5fec45f6fc61eaf486971a37d9ac',
        skill_description:
          '크로스헤어 방향으로 불꽃을 날려 적중한 적에게는 피해 및 회개 효과를 부여하고, 적중한 아군에게는 축복 효과를 부여합니다.\n회개 효과는 화상과 동일한 효과로 취급되며, 회개 상태의 적에게 총기 공격 시, 일정 확률로 사용 중인 총기의 탄약을 회복합니다.\n추가로, 회개 효과는 적 사...',
      },
      {
        skill_type: '패시브 스킬',
        skill_name: '신성',
        element_type: '화염',
        arche_type: null,
        skill_image_url:
          'https://open.api.nexon.com/static/tfd/img/d71abb568eb4c4879b08bba50e71c38c',
        skill_description: '세레나는 공중에서 총기를 발사할 때 추가 스탯 보너스를 받습니다.',
      },
    ],
  },
  {
    descendant_id: '101000029',
    descendant_name: '넬',
    descendant_group_id: '101200029',
    descendant_image_url:
      'https://open.api.nexon.com/static/tfd/img/0a257481650002dbfaa5d4d89397ebd1',
    descendant_stat: [
      {
        level: 1,
        stat_detail: [
          {
            stat_id: '105000001',
            stat_value: 186,
          },
        ],
      },
      {
        level: 2,
        stat_detail: [
          {
            stat_id: '105000001',
            stat_value: 190,
          },
        ],
      },
    ],
    descendant_skill: [
      {
        skill_type: '액티브 스킬',
        skill_name: '균열 투사',
        element_type: '무 속성',
        arche_type: '공학',
        skill_image_url:
          'https://open.api.nexon.com/static/tfd/img/77b7d8825c1157d7adb17e7a6c3df6f4',
        skill_description:
          '균열 파편들을 발사하여 적중된 적에게 피해를 입힙니다.\n피격된 적이 에시브 스캔 효과를 가지고 있다면 추가적인 효과가 발동합니다.',
      },
      {
        skill_type: '액티브 스킬',
        skill_name: '균열 고리',
        element_type: '무 속성',
        arche_type: '융합',
        skill_image_url:
          'https://open.api.nexon.com/static/tfd/img/c963d7bad94ebcccaf174db62ac8a5a3',
        skill_description:
          '지정된 위치에 아르케 균열을 생성합니다.\n생성된 아르케 균열 주변의 적들에게 해로운 효과를 부여하며 바닥에 반중력 지대를 생성합니다.\n아르케 균열의 해로운 효과는 시간이 경과될 수록 강화되며 적응형 방어 효과를 추가로 약화 시킵니다.\n스킬 재사용 시 아르케 균열을 회수 하며 넬에게...',
      },
    ],
  },
];

/** 무기 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdWeaponMetaFixture: TfdWeaponMeta[] = [
  {
    weapon_id: '211051001',
    weapon_name: '백조',
    image_url: 'https://open.api.nexon.com/static/tfd/img/c4bd46e95cf93bf3c7ec7607bad632f7',
    weapon_type: '기관총',
    weapon_category: 'RangedWeapon',
    weapon_tier_id: 'Tier1',
    weapon_rounds_type: '일반탄',
    available_core_slot: [],
    base_stat: [
      {
        stat_id: '105000023',
        stat_value: 521,
      },
      {
        stat_id: '105000035',
        stat_value: 1,
      },
    ],
    firearm_atk: [
      {
        level: 1,
        firearm: [
          {
            firearm_atk_type: '105000026',
            firearm_atk_value: 25,
          },
        ],
      },
      {
        level: 2,
        firearm: [
          {
            firearm_atk_type: '105000026',
            firearm_atk_value: 54,
          },
        ],
      },
    ],
    weapon_perk_ability_name: null,
    weapon_perk_ability_description: null,
    weapon_perk_ability_image_url: null,
  },
  {
    weapon_id: '211053001',
    weapon_name: '위대한 유산',
    image_url: 'https://open.api.nexon.com/static/tfd/img/13e0b9972056d43d525c1faabefd54b4',
    weapon_type: '기관총',
    weapon_category: 'RangedWeapon',
    weapon_tier_id: 'Tier3',
    weapon_rounds_type: '일반탄',
    available_core_slot: ['381000011'],
    base_stat: [
      {
        stat_id: '105000023',
        stat_value: 571,
      },
      {
        stat_id: '105000035',
        stat_value: 1.85,
      },
    ],
    firearm_atk: [
      {
        level: 1,
        firearm: [
          {
            firearm_atk_type: '105000026',
            firearm_atk_value: 28,
          },
        ],
      },
      {
        level: 2,
        firearm: [
          {
            firearm_atk_type: '105000026',
            firearm_atk_value: 59,
          },
        ],
      },
    ],
    weapon_perk_ability_name: '장인정신',
    weapon_perk_ability_description:
      '총기 발사 유지 시, 일정 시간마다 담금질효과를 부여합니다. \n담금질효과 최대 중첩 시 자신에게 적열탄효과를 부여합니다.\n적열탄효과 보유 중 특정 발 수마다 폭열탄을 추가로 발사합니다.\n폭열탄에 피격된 대상에게 화염 상처효과를 부여합니다.\n적열탄효과 보유한 상태에서 화염 상처효과를...',
    weapon_perk_ability_image_url:
      'https://open.api.nexon.com/static/tfd/img/dccfe9158c24b771f488ed4762036af7',
  },
];

/** 모듈 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdModuleMetaFixture: TfdModuleMeta[] = [
  {
    module_name: '급속 냉동기',
    module_id: '252013003',
    image_url: 'https://open.api.nexon.com/static/tfd/img/faaa6db196c09c3f019121f2a1f26a2f',
    module_type: null,
    module_tier_id: 'Tier3',
    module_socket_type: '세룰리안',
    module_class: '일반탄',
    available_weapon_type: [],
    available_descendant_id: [],
    available_module_slot_type: [],
    module_stat: [
      {
        level: 0,
        module_capacity: 5,
        value:
          '동상 효과를 보유한 적 처치 시, 대상의 4m 이내의 다른 적들에게 0.8초간 동상 효과 부여 (재발동 대기시간 20초)',
      },
      {
        level: 1,
        module_capacity: 6,
        value:
          '동상 효과를 보유한 적 처치 시, 대상의 5.19m 이내의 다른 적들에게 0.8초간 동상 효과 부여 (재발동 대기시간 20초)',
      },
    ],
  },
  {
    module_name: '전략적 교체',
    module_id: '252013009',
    image_url: 'https://open.api.nexon.com/static/tfd/img/7cc8e9f3fffdfa569d533c05f1fb9183',
    module_type: '전투 숙련',
    module_tier_id: 'Tier3',
    module_socket_type: '루틸',
    module_class: '일반탄',
    available_weapon_type: [],
    available_descendant_id: [],
    available_module_slot_type: [],
    module_stat: [
      {
        level: 0,
        module_capacity: 6,
        value:
          '무기 교체 속도 +25%[+]\n무기 교체 시 5초 동안 방어력 +32%[x] (재발동 대기시간 15초)',
      },
      {
        level: 1,
        module_capacity: 7,
        value:
          '무기 교체 속도 +25%[+]\n무기 교체 시 6초 동안 방어력 +36.5%[x] (재발동 대기시간 15초)',
      },
    ],
  },
];

/** 반응로 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdReactorMetaFixture: TfdReactorMeta[] = [
  {
    reactor_id: '245001100',
    reactor_name: '타오르는 혼합물 반응로',
    image_url: 'https://open.api.nexon.com/static/tfd/img/8dbd68e19bed365cc5e326293aae086f',
    reactor_tier_id: 'Tier1',
    reactor_skill_power: [
      {
        level: 1,
        skill_atk_power: 21.538,
        sub_skill_atk_power: null,
        enchant_effect: [
          {
            enchant_level: 1,
            stat_id: '105000145',
            value: 0.646,
          },
        ],
        skill_power_coefficient: [
          {
            coefficient_stat_id: '105000148',
            coefficient_stat_value: 0.2,
          },
        ],
      },
      {
        level: 2,
        skill_atk_power: 38.29,
        sub_skill_atk_power: null,
        enchant_effect: [
          {
            enchant_level: 1,
            stat_id: '105000145',
            value: 1.149,
          },
        ],
        skill_power_coefficient: [
          {
            coefficient_stat_id: '105000148',
            coefficient_stat_value: 0.2,
          },
        ],
      },
    ],
    optimized_condition_type: null,
  },
  {
    reactor_id: '245001101',
    reactor_name: '타오르는 특이점 반응로',
    image_url: 'https://open.api.nexon.com/static/tfd/img/cdccdc01f2a42ddc53cfa6bd3e3b6837',
    reactor_tier_id: 'Tier1',
    reactor_skill_power: [
      {
        level: 1,
        skill_atk_power: 21.538,
        sub_skill_atk_power: null,
        enchant_effect: [
          {
            enchant_level: 1,
            stat_id: '105000145',
            value: 0.646,
          },
        ],
        skill_power_coefficient: [
          {
            coefficient_stat_id: '105000148',
            coefficient_stat_value: 0.2,
          },
        ],
      },
      {
        level: 2,
        skill_atk_power: 38.29,
        sub_skill_atk_power: null,
        enchant_effect: [
          {
            enchant_level: 1,
            stat_id: '105000145',
            value: 1.149,
          },
        ],
        skill_power_coefficient: [
          {
            coefficient_stat_id: '105000148',
            coefficient_stat_value: 0.2,
          },
        ],
      },
    ],
    optimized_condition_type: null,
  },
];

/** 외장 부품 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdExternalComponentMetaFixture: TfdExternalComponentMeta[] = [
  {
    external_component_id: '241193020',
    external_component_name: '움직이는 요새의 보조 전원',
    image_url: 'https://open.api.nexon.com/static/tfd/img/8d464e74463f8d7947e3f2e822012734',
    external_component_equipment_type: '보조 전원',
    external_component_tier_id: 'Tier3',
    available_core_slot: ['381010089'],
    base_stat: [
      {
        level: 1,
        stat_id: '105000029',
        stat_value: 19,
      },
      {
        level: 2,
        stat_id: '105000029',
        stat_value: 28,
      },
    ],
    set_option_detail: [
      {
        set_option: '움직이는 요새',
        set_count: 2,
        set_option_effect: '방어력 25%[x]',
      },
      {
        set_option: '움직이는 요새',
        set_count: 4,
        set_option_effect:
          '총기 치명타 확률 -8%[x]\n총기 치명타 배율 -12%[x]\n현재 방어력의 0.012%만큼 받는 피해량 계수 감소 (최대 -24%)',
      },
    ],
  },
  {
    external_component_id: '241203021',
    external_component_name: '껍질 분쇄기의 보조 전원',
    image_url: 'https://open.api.nexon.com/static/tfd/img/d6b633251eacf77cbdc42639221d0619',
    external_component_equipment_type: '보조 전원',
    external_component_tier_id: 'Tier3',
    available_core_slot: ['381010093'],
    base_stat: [
      {
        level: 1,
        stat_id: '105000025',
        stat_value: 8,
      },
      {
        level: 2,
        stat_id: '105000025',
        stat_value: 9,
      },
    ],
    set_option_detail: [
      {
        set_option: '껍질 분쇄기',
        set_count: 2,
        set_option_effect: '발사 속도 5%[x]',
      },
      {
        set_option: '껍질 분쇄기',
        set_count: 4,
        set_option_effect:
          '보이드 차폐막에 스킬 공격 시, 스킬 위력의 1218% 만큼 추가 피해 부여\n아르케 차단막에 무기 공격 시, 무기 피해량의 1218% 만큼 추가 피해 부여',
      },
    ],
  },
];

/** 난이도 보상 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdRewardMetaFixture: TfdRewardMeta[] = [
  {
    map_id: '610001000',
    map_name: '과거의 기록',
    battle_zone: [],
  },
  {
    map_id: '610002001',
    map_name: '베스퍼스',
    battle_zone: [
      {
        battle_zone_id: '401',
        battle_zone_name: '집하장',
        reward: [
          {
            rotation: 1,
            reward_type: '반응로',
            reactor_element_type: '독성',
            weapon_rounds_type: null,
            arche_type: '차원',
          },
        ],
      },
      {
        battle_zone_id: '402',
        battle_zone_name: '유적지',
        reward: [
          {
            rotation: 1,
            reward_type: '반응로',
            reactor_element_type: '화염',
            weapon_rounds_type: null,
            arche_type: '공학',
          },
        ],
      },
    ],
  },
];

/** 기본 스탯 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdStatMetaFixture: TfdStatMeta[] = [
  {
    stat_id: '105000001',
    stat_name: '최대 체력',
    stat_order_no: 300,
  },
  {
    stat_id: '105000219',
    stat_name: '발사체 관통력',
    stat_order_no: null,
  },
];

/** 보이드 요격전 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdVoidBattleMetaFixture: TfdVoidBattleMeta[] = [
  {
    void_battle_id: '651000001',
    void_battle_name: '그레이브 워커',
  },
  {
    void_battle_id: '651000002',
    void_battle_name: '스터닝 뷰티',
  },
];

/** 타이틀 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdTitleMetaFixture: TfdTitleMeta[] = [
  {
    title_id: '270300001',
    title_name: '촉망받는',
  },
  {
    title_id: '270300002',
    title_name: '무의식의',
  },
];

/** 계승자 레벨별 경험치 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdDescendantLevelDetailMetaFixture: TfdDescendantLevelDetailMeta[] = [
  {
    descendant_level: 1,
    exp_per_level: 4000,
  },
  {
    descendant_level: 2,
    exp_per_level: 5900,
  },
];

/** 마스터리 랭크별 경험치 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdMasteryRankLevelDetailMetaFixture: TfdMasteryRankLevelDetailMeta[] = [
  {
    mastery_level: 1,
    exp_per_level: 1500,
  },
  {
    mastery_level: 2,
    exp_per_level: 3300,
  },
];

/** 소비 아이템 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdConsumableMaterialMetaFixture: TfdConsumableMaterialMeta[] = [
  {
    consumable_material_id: '261521205',
    image_url: 'https://open.api.nexon.com/static/tfd/img/56dec771c32bdeb736ca1ee3bab12de7',
    consumable_material_name: '양자 배양기',
    required_mastery_rank_level: 1,
    material_type: 'ResearchMaterial',
    acquisition_detail: ['NS:102010049', 'VB:540000201:Hard'],
    amorphous_reward: [],
  },
  {
    consumable_material_id: '263078001',
    image_url: null,
    consumable_material_name: '얼티밋 루나 토큰',
    required_mastery_rank_level: 1,
    material_type: 'EventCoin',
    acquisition_detail: [],
    amorphous_reward: [],
  },
];

/** 연구 정보 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdResearchMetaFixture: TfdResearchMeta[] = [
  {
    research_id: '303010023',
    research_name: '버니',
    repeatable_research: true,
    research_type: 'Character',
    research_time: 10,
    research_cost: [
      {
        currency_type: 'Gold',
        currency_value: 400000,
      },
    ],
    research_boost_cost: [
      {
        currency_type: 'RedCash',
        currency_value: 1,
      },
    ],
    research_result: [
      {
        meta_type: 'descendant_id',
        meta_id: '101000006',
        result_count: 1,
      },
    ],
    research_material: [
      {
        meta_type: 'consumable_material_id',
        meta_id: '261011012',
        material_count: 1,
        research_id: [],
      },
      {
        meta_type: 'consumable_material_id',
        meta_id: '261011013',
        material_count: 1,
        research_id: [],
      },
    ],
    available_research_count: null,
  },
  {
    research_id: '303010186',
    research_name: '위상 치환기',
    repeatable_research: true,
    research_type: 'UpgradeMaterial',
    research_time: 75,
    research_cost: [
      {
        currency_type: 'Gold',
        currency_value: 2500,
      },
    ],
    research_boost_cost: [
      {
        currency_type: 'RedCash',
        currency_value: 1,
      },
    ],
    research_result: [
      {
        meta_type: 'consumable_material_id',
        meta_id: '262060002',
        result_count: 1,
      },
    ],
    research_material: [
      {
        meta_type: 'consumable_material_id',
        meta_id: '262031016',
        material_count: 50,
        research_id: [],
      },
    ],
    available_research_count: [1, 4],
  },
];

/** 비정형 물질 오픈 보상 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdAmorphousRewardMetaFixture: TfdAmorphousRewardMeta[] = [
  {
    amorphous_reward_id: '364000001',
    open_reward: [
      {
        reward_type: 'Default',
        required_stabilizer: null,
        reward_item: [
          {
            meta_type: 'consumable_material_id',
            meta_id: '261021019',
            rate: 100,
          },
        ],
      },
    ],
  },
  {
    amorphous_reward_id: '364000002',
    open_reward: [
      {
        reward_type: 'Default',
        required_stabilizer: null,
        reward_item: [
          {
            meta_type: 'consumable_material_id',
            meta_id: '261021045',
            rate: 100,
          },
        ],
      },
    ],
  },
];

/** 획득처 정보 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdAcquisitionDetailMetaFixture: TfdAcquisitionDetailMeta[] = [
  {
    acquisition_detail_id: 'MM:BaseMission:620310101:Normal',
    acquisition_detail_name: '[ 아그나 사막 ] [ 일반 ] - [ 수화물 거점 ] 임무 몬스터',
  },
  {
    acquisition_detail_id: 'MM:BaseMission:620310107:Normal',
    acquisition_detail_name: '[ 아그나 사막 ] [ 일반 ] - [ 카이퍼 집적소 ] 임무 몬스터',
  },
];

/** 무기 유형 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdWeaponTypeMetaFixture: TfdWeaponTypeMeta[] = [
  {
    weapon_type: 'All',
    weapon_type_name: '무기: 전체',
  },
  {
    weapon_type: 'WeaponMeleeBalanced',
    weapon_type_name: '밸런스형 근접 무기',
  },
];

/** 조력자 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdFellowMetaFixture: TfdFellowMeta[] = [
  {
    fellow_id: '107200001',
    fellow_name: '하기오스 쉽독',
    fellow_tier_id: 'Tier1',
    fellow_detail: [
      {
        fellow_level: 1,
        search_radius_value: null,
        stat_effect: [
          {
            stat_id: '105000176',
            stat_value: 0.01,
          },
        ],
      },
      {
        fellow_level: 2,
        search_radius_value: null,
        stat_effect: [
          {
            stat_id: '105000176',
            stat_value: 0.02,
          },
        ],
      },
    ],
  },
  {
    fellow_id: '107200002',
    fellow_name: '베스퍼스 헌팅독',
    fellow_tier_id: 'Tier1',
    fellow_detail: [
      {
        fellow_level: 1,
        search_radius_value: null,
        stat_effect: [
          {
            stat_id: '105000176',
            stat_value: 0.01,
          },
        ],
      },
      {
        fellow_level: 2,
        search_radius_value: null,
        stat_effect: [
          {
            stat_id: '105000176',
            stat_value: 0.02,
          },
        ],
      },
    ],
  },
];

/** 조력자 레벨별 경험치 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdFellowLevelDetailMetaFixture: TfdFellowLevelDetailMeta[] = [
  {
    fellow_level: 1,
    exp_per_level: 1000,
  },
  {
    fellow_level: 2,
    exp_per_level: 1000,
  },
];

/** 등급 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdTierMetaFixture: TfdTierMeta[] = [
  {
    tier_id: 'All',
    tier_name: '등급: 전체',
  },
  {
    tier_id: 'Tier1',
    tier_name: '일반',
  },
];

/** 코어 슬롯 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdCoreSlotMetaFixture: TfdCoreSlotMeta[] = [
  {
    core_slot_id: '381000001',
    available_weapon_id: ['211013001'],
    available_external_component_id: [],
    available_core_type_id: ['382009901', '382000101'],
  },
  {
    core_slot_id: '381000002',
    available_weapon_id: ['211013002'],
    available_external_component_id: [],
    available_core_type_id: ['382009901', '382000101'],
  },
];

/** 코어 타입 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdCoreTypeMetaFixture: TfdCoreTypeMeta[] = [
  {
    core_type_id: '382000101',
    core_type: '화력 증강',
    core_option: [
      {
        core_option_id: '383000101',
        detail: [
          {
            core_option_grade: null,
            required_core_item: {
              meta_type: 'consumable_material_id',
              meta_id: '265101001',
              count: 1,
            },
            available_item_option: [
              {
                item_option: '총기 공격력',
                option_type: 'Core',
                option_grade: 1,
                option_effect: {
                  stat_id: '105000026',
                  operator_type: 'Multiply',
                  min_stat_value: 0.02,
                  max_stat_value: 0.04,
                },
                rate: 10,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    core_type_id: '382000102',
    core_type: '화력 증강',
    core_option: [
      {
        core_option_id: '383000102',
        detail: [
          {
            core_option_grade: null,
            required_core_item: {
              meta_type: 'consumable_material_id',
              meta_id: '265101001',
              count: 1,
            },
            available_item_option: [
              {
                item_option: '폭발 공격력',
                option_type: 'Core',
                option_grade: 1,
                option_effect: {
                  stat_id: '105000057',
                  operator_type: 'Multiply',
                  min_stat_value: 0.02,
                  max_stat_value: 0.04,
                },
                rate: 10,
              },
            ],
          },
        ],
      },
    ],
  },
];

/** 계승자 그룹 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdDescendantGroupMetaFixture: TfdDescendantGroupMeta[] = [
  {
    descendant_group_id: '101200001',
    descendant_group_name: '계승자 그룹: 레픽',
  },
  {
    descendant_group_id: '101200002',
    descendant_group_name: '계승자 그룹: 에이잭스',
  },
];

/** 적응도 레벨 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdAdaptLevelMetaFixture: TfdAdaptLevelMeta[] = [
  {
    level: 1,
    exp_per_level: 2000,
  },
  {
    level: 2,
    exp_per_level: 2000,
  },
];

/** 아르케 조율 보드 그룹 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdArcheTuningBoardGroupMetaFixture: TfdArcheTuningBoardGroupMeta[] = [
  {
    arche_tuning_board_group_id: '101300001',
    descendant_group_id: '101200001',
    arche_tuning_board_id: '101400101',
  },
  {
    arche_tuning_board_group_id: '101300002',
    descendant_group_id: '101200002',
    arche_tuning_board_id: '101400201',
  },
];

/** 아르케 조율 보드 메타데이터 조회 — 실데이터(공통) 일부 */
export const tfdArcheTuningBoardMetaFixture: TfdArcheTuningBoardMeta[] = [
  {
    arche_tuning_board_id: '101400001',
    row_size: 21,
    column_size: 21,
    node: [
      {
        node_id: '101500003',
        position_row: 10,
        position_column: 0,
      },
      {
        node_id: '101530071',
        position_row: 10,
        position_column: 1,
      },
    ],
  },
  {
    arche_tuning_board_id: '101400101',
    row_size: 21,
    column_size: 21,
    node: [
      {
        node_id: '101500003',
        position_row: 10,
        position_column: 0,
      },
      {
        node_id: '101530071',
        position_row: 10,
        position_column: 1,
      },
    ],
  },
];

/** 아르케 조율 노드 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdArcheTuningNodeMetaFixture: TfdArcheTuningNodeMeta[] = [
  {
    node_id: '101500002',
    node_name: '조율 시작점',
    node_image_url: 'https://open.api.nexon.com/static/tfd/img/9e2dc3a13defcc1f5c9bff01980730d6',
    node_type: 'Start',
    tier_id: 'None',
    required_tuning_point: 0,
    node_effect: [],
  },
  {
    node_id: '101500003',
    node_name: '조율 연결점',
    node_image_url: 'https://open.api.nexon.com/static/tfd/img/420ea944adae725b142548fa0726eca4',
    node_type: 'Connect',
    tier_id: 'None',
    required_tuning_point: 1,
    node_effect: [],
  },
];

/** 커스터마이징 아이템 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdCustomizingItemMetaFixture: TfdCustomizingItemMeta[] = [
  {
    customizing_item_id: '282060001',
    customizing_item_name: '광속 각성자',
    customizing_item_type: 'CharacterHeadSkin',
    customizing_item_tier_id: 'Tier3',
    customizing_item_description:
      '계승자의 아르케에 동화되어 외형이 변화하는 성질을 가진 헬멧. 총 3단계의 진화를 거친다.',
    customizing_item_image_url:
      'https://open.api.nexon.com/static/tfd/img/128ba289b5491a02e38f0e3a78aa4095',
    customizing_item_evolution_stage: [
      {
        stage: 1,
        customizing_item_image_url:
          'https://open.api.nexon.com/static/tfd/img/721983eca1759fde92eaa7f77baaedaa',
      },
      {
        stage: 2,
        customizing_item_image_url:
          'https://open.api.nexon.com/static/tfd/img/588f862c693b446e90ef10d3179ad055',
      },
    ],
    available_descendant: ['101000006', '101000019'],
  },
  {
    customizing_item_id: '282100044',
    customizing_item_name: '액화 가속',
    customizing_item_type: 'CharacterBodySkin',
    customizing_item_tier_id: null,
    customizing_item_description:
      '밸비의 액체화가 더욱 원활할 수 있도록 슈트에 특수 기술을 패턴화하여 새겼다.',
    customizing_item_image_url:
      'https://open.api.nexon.com/static/tfd/img/19b41ca743ae260ad0ba934e0b6d2202',
    customizing_item_evolution_stage: [],
    available_descendant: ['101000013', '101000022'],
  },
];

/** 훈장 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdMedalMetaFixture: TfdMedalMeta[] = [
  {
    medal_id: '275000001',
    medal_detail: [
      {
        medal_level: 1,
        medal_name: '1성 알비온 명예 훈장',
        medal_tier_id: 'Tier3',
        medal_image_url:
          'https://open.api.nexon.com/static/tfd/img/2ed2cf0324c645a5088428cb7807c8a9',
      },
      {
        medal_level: 2,
        medal_name: '2성 알비온 명예 훈장',
        medal_tier_id: 'Tier3',
        medal_image_url:
          'https://open.api.nexon.com/static/tfd/img/fbce359bea05648f9467c30f569f3ce5',
      },
    ],
  },
  {
    medal_id: '275000002',
    medal_detail: [
      {
        medal_level: 1,
        medal_name: '1성 레일리 전승 훈장',
        medal_tier_id: 'Tier3',
        medal_image_url:
          'https://open.api.nexon.com/static/tfd/img/25b52bb281413b8b19dd74299dda8f46',
      },
      {
        medal_level: 2,
        medal_name: '2성 레일리 전승 훈장',
        medal_tier_id: 'Tier3',
        medal_image_url:
          'https://open.api.nexon.com/static/tfd/img/e1b2f83fc99207e209c02cd67bc6ec62',
      },
    ],
  },
];

/** 탈것 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdVehicleMetaFixture: TfdVehicleMeta[] = [
  {
    vehicle_id: '107300001',
    vehicle_name: '글라이드-4',
    vehicle_description: '기본형 호버 바이크 "글라이드-4"',
    vehicle_tier_id: 'Tier1',
    image_url: 'https://open.api.nexon.com/static/tfd/img/798b692523171dffbf0b0f8b0a841af4',
    stat_effect: [
      {
        stat_id: '105000233',
        stat_value: 3000,
      },
      {
        stat_id: '105000234',
        stat_value: 0.25,
      },
    ],
    stat_effect_per_level: [
      {
        vehicle_level: 1,
        stat_effect: [
          {
            stat_id: '105000230',
            stat_value: 1700,
          },
        ],
      },
      {
        vehicle_level: 2,
        stat_effect: [
          {
            stat_id: '105000230',
            stat_value: 1730,
          },
        ],
      },
    ],
  },
  {
    vehicle_id: '107300002',
    vehicle_name: '볼텍스',
    vehicle_description: '스피드를 중시한 호버 바이크 "볼텍스"',
    vehicle_tier_id: 'Tier2',
    image_url: 'https://open.api.nexon.com/static/tfd/img/59f6f6d4b60018a2d3396795a21b3fa7',
    stat_effect: [
      {
        stat_id: '105000233',
        stat_value: 3600,
      },
      {
        stat_id: '105000234',
        stat_value: 0.15,
      },
    ],
    stat_effect_per_level: [
      {
        vehicle_level: 1,
        stat_effect: [
          {
            stat_id: '105000230',
            stat_value: 2000,
          },
        ],
      },
      {
        vehicle_level: 2,
        stat_effect: [
          {
            stat_id: '105000230',
            stat_value: 2050,
          },
        ],
      },
    ],
  },
];

/** 수집형 아이템 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdCollectibleItemMetaFixture: TfdCollectibleItemMeta[] = [
  {
    collectible_item_id: '266100001',
    collectible_item_name: '부족한 드럼 세트',
    collectible_item_description: '라운지에 배치할 수 있는 수집품입니다.',
    collectible_item_narrative: '제이버가 소유한 드럼 모형이다. 뭔가 허전하다.',
    collectible_item_tier_id: 'Tier1',
    collectible_item_lounge_size: 'Size3',
    collect_type: 'Artifact',
    decomposition_flag: '1',
    decomposition_reward: [
      {
        item_id: '263080002',
        item_type: 'consumable_material_id',
        count: 25,
      },
    ],
  },
  {
    collectible_item_id: '266100019',
    collectible_item_name: '목재 관',
    collectible_item_description: '[기간한정]라운지에 배치할 수 있는 수집품입니다.',
    collectible_item_narrative: '뱀파이어 관이다. 가난한 귀족 출신인가?',
    collectible_item_tier_id: 'Tier1',
    collectible_item_lounge_size: 'Size3',
    collect_type: 'Artifact',
    decomposition_flag: '0',
    decomposition_reward: null,
  },
];

/** 변이 세포 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdNodeItemMetaFixture: TfdNodeItemMeta[] = [
  {
    node_item_id: '231003001',
    node_item_name: '공격 무력화',
    node_item_image_url:
      'https://open.api.nexon.com/static/tfd/img/691e9aafd9a809d552b8daf68dbfeafa',
    node_item_description:
      '체력이 최대치인 적에게 스킬 공격 적중 시 대상에게 공격 무력화 효과를 부여합니다.',
    node_item_socket_type: 'SocketType_A',
    node_item_effect: [
      {
        node_item_effect_name: '공격 무력화',
        node_item_effect_description:
          '공격 무력화에 걸린 적\n지속시간\t15초\n공격력\t-34.8%[x]\n화염 속성 공격력\t-34.8%[x]\n냉기 속성 공격력\t-34.8%[x]\n독 속성 공격력\t-34.8%[x]\n전기 속성 공격력\t-34.8%[x]',
      },
    ],
  },
  {
    node_item_id: '231003002',
    node_item_name: '방어 무력화',
    node_item_image_url:
      'https://open.api.nexon.com/static/tfd/img/fbe440ae8eeeb8b6304e612e3be4d390',
    node_item_description:
      '체력이 최대치인 적에게 스킬 공격 적중 시 대상에게 방어 무력화 효과를 부여합니다.',
    node_item_socket_type: 'SocketType_C',
    node_item_effect: [
      {
        node_item_effect_name: '방어 무력화',
        node_item_effect_description:
          '방어 무력화에 걸린 적\n지속시간\t15초\n방어력\t-50%[x]\n화염 속성 저항력\t-30%[x]\n냉기 속성 저항력\t-30%[x]\n독 속성 저항력\t-30%[x]\n전기 속성 저항력\t-30%[x]',
      },
    ],
  },
];

/** 변이 세포 소켓 타입 메타데이터 조회 — 실데이터(ko) 일부 */
export const tfdNodeSocketTypeMetaFixture: TfdNodeSocketTypeMeta[] = [
  {
    node_item_socket_type: 'All',
    node_item_socket_name: '자유',
    node_item_socket_image_url: null,
  },
  {
    node_item_socket_type: 'SocketType_A',
    node_item_socket_name: '세룰리안',
    node_item_socket_image_url:
      'https://open.api.nexon.com/static/tfd/img/cda2bedc16ecb6bb113fe9f623b7d45f',
  },
];
