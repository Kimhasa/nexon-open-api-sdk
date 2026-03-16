// Main entry point
export { NexonClient } from './NexonClient.js';
export type { NexonClientOptions } from './NexonClient.js';

// Game clients (also available via sub-path imports)
export { MapleStoryClient } from './games/maplestory/MapleStoryClient.js';
export { FcOnlineClient } from './games/fc-online/FcOnlineClient.js';
export { MapleStoryMClient } from './games/maplestory-m/MapleStoryMClient.js';
export { MapleStorySEAClient } from './games/maplestory-sea/MapleStorySEAClient.js';

// Errors
export {
  NexonError,
  NexonRateLimitError,
  NexonAuthError,
  NexonNotFoundError,
  NexonBadRequestError,
  NexonDataNotReadyError,
  NexonServerError,
  NEXON_ERROR_CODES,
  classifyError,
} from './core/errors/index.js';
export type { NexonErrorCode, NexonErrorPayload } from './core/errors/index.js';

// Types
export type { OCID, NexonDate, GuildId } from './games/_base/maple-base-types.js';
export type { OUID } from './games/fc-online/user/types.js';
export { toNexonDate } from './games/_base/maple-date.js';
export type { DateRange } from './games/_base/maple-date.js';
export type { CursorPage, CursorPageRequest, AutoPaginationOptions } from './core/types/index.js';

// MapleStory types
export type {
  Achievement,
  AccountAchievement,
  AchievementInfo,
} from './games/maplestory/user-types.js';
export type {
  CharacterList,
  AccountCharacterList,
  CharacterSummary,
  CharacterBasic,
  CharacterPopularity,
  CharacterStat,
  FinalStat,
  CharacterHyperStat,
  HyperStatPreset,
  CharacterPropensity,
  CharacterAbility,
  AbilityInfo,
  AbilityPreset,
  CharacterItemEquipment,
  ItemEquipment,
  PresetItemEquipment,
  ItemTotalOption,
  ItemBaseOption,
  ItemExceptionalOption,
  ItemAddOption,
  ItemEtcOption,
  TitleInfo,
  MedalShape,
  CharacterCashItemEquipment,
  CashItemEquipmentItem,
  CashItemOption,
  CashItemColoringPrism,
  CharacterSymbolEquipment,
  SymbolInfo,
  CharacterSetEffect,
  SetEffectInfo,
  SetEffectOption,
  CharacterBeautyEquipment,
  HairInfo,
  FaceInfo,
  SkinInfo,
  CharacterAndroidEquipment,
  AndroidCashItem,
  AndroidPresetInfo,
  CharacterPetEquipment,
  PetEquipmentItem,
  PetAutoSkill,
  PetItemOption,
  CharacterSkill,
  SkillInfo,
  SkillGrade,
  SkillRequest,
  CharacterLinkSkill,
  LinkSkillInfo,
  CharacterVMatrix,
  VCoreEquipment,
  CharacterHexaMatrix,
  HexaCoreEquipment,
  HexaLinkedSkill,
  CharacterHexaMatrixStat,
  HexaStatCore,
  CharacterDojang,
  CharacterOtherStat,
  OtherStatEntry,
  OtherStatInfo,
  CharacterRingExchangeSkillEquipment,
} from './games/maplestory/character/types.js';

// MapleStory union types
export type {
  Union,
  UnionInnerStat,
  UnionBlockPosition,
  UnionBlock,
  UnionRaiderPreset,
  UnionRaider,
  UnionArtifactEffect,
  UnionArtifactCrystal,
  UnionArtifact,
  UnionChampionBadgeInfo,
  UnionChampionInfo,
  UnionChampion,
} from './games/maplestory/union/types.js';

// MapleStory guild types
export type {
  GuildIdResponse,
  WorldName,
  GuildSkill,
  GuildBasic,
} from './games/maplestory/guild/types.js';

// MapleStory history types
export type {
  HistoryRequest,
  StarforceEvent,
  StarforceHistoryItem,
  StarforceHistory,
  PotentialOption,
  PotentialHistoryItem,
  PotentialHistory,
  CubeHistoryItem,
  CubeHistory,
} from './games/maplestory/history/types.js';

// MapleStory ranking types
export type {
  RankingBaseRequest,
  OverallRankingRequest,
  UnionRankingRequest,
  GuildRankingRequest,
  DojangRankingRequest,
  TheSeedRankingRequest,
  OverallRankingItem,
  OverallRanking,
  UnionRankingItem,
  UnionRanking,
  GuildRankingItem,
  GuildRanking,
  DojangRankingItem,
  DojangRanking,
  TheSeedRankingItem,
  TheSeedRanking,
  AchievementRankingItem,
  AchievementRanking,
} from './games/maplestory/ranking/types.js';

// MapleStory notice types
export type {
  NoticeItem,
  NoticeDetail,
  NoticeList,
  UpdateNoticeList,
  EventNoticeItem,
  EventNoticeList,
  EventNoticeDetail,
  CashshopNoticeItem,
  CashshopNoticeList,
  CashshopNoticeDetail,
} from './games/maplestory/notice/types.js';

// FC Online types
export type {
  FcUserBasic,
  FcMaxDivision,
  FcUserMatchRequest,
  FcUserTradeRequest,
  FcTradeType,
  FcTradeRecord,
} from './games/fc-online/user/types.js';
export type {
  FcMatchListRequest,
  FcMatchDetail,
  FcMatchInfo,
  FcMatchDetailInfo,
  FcMatchShoot,
  FcMatchShootDetail,
  FcMatchPass,
  FcMatchDefence,
  FcPlayerStatus,
  FcMatchPlayer,
} from './games/fc-online/match/types.js';
export type {
  FcRankerPlayer,
  FcRankerStatsRequest,
  FcRankerPlayerStatus,
  FcRankerStats,
} from './games/fc-online/ranker/types.js';
export type {
  FcMatchTypeMeta,
  FcSpidMeta,
  FcSeasonIdMeta,
  FcSpPositionMeta,
  FcDivisionMeta,
  FcDivisionVoltaMeta,
} from './games/fc-online/metadata/types.js';

// MapleStory M types
export type {
  MCharacterBasic,
  MCharacterStat,
  MStat,
  MCharacterHyperStat,
  MHyperStatInfo,
  MHyperStatPreset,
  MCharacterGuild,
  MCharacterItemEquipment,
  MItemEquipment,
  MItemOption,
  MSoulInfo,
  MEmblemInfo,
  MEquipmentPreset,
  MCharacterCashItemEquipment,
  MCashItemEquipmentItem,
  MCashItemOption,
  MCashItemColoringPrism,
  MCashEquipmentPreset,
  MAdditionalCashEquipmentPreset,
  MCharacterSymbolEquipment,
  MSymbolInfo,
  MCharacterSetEffect,
  MSetInfo,
  MCharacterAndroidEquipment,
  MAndroidCashItem,
  MAndroidEquipmentInfo,
  MHeartEquipment,
  MAndroidHeartPreset,
  // 스펙 확인 필요
  MCharacterJewel,
  MCharacterBeautyEquipment,
  MCharacterPetEquipment,
  MCharacterSkillEquipment,
  MCharacterLinkSkill,
  MCharacterVMatrix,
  MCharacterHexaMatrixSkill,
  MCharacterHexaMatrixStat,
} from './games/maplestory-m/character/types.js';

// MapleStory M common types
export type { MOcidRequest, MGuildIdRequest } from './games/maplestory-m/types.js';

// MapleStory M union types (스펙 확인 필요)
export type { MUnion, MUnionRaider } from './games/maplestory-m/union/types.js';

// MapleStory M guild types
export type {
  MGuildIdResponse,
  MWorldName,
  MGuildBasic,
} from './games/maplestory-m/guild/types.js';

// MapleStory M ranking types
export type {
  MRankingBaseRequest,
  MLevelRankingRequest,
  MLevelRankingItem,
  MLevelRanking,
  MDojangRankingRequest,
  MDojangRankingItem,
  MDojangRanking,
  MRootOfTimeRankingRequest,
  MRootOfTimeRankingItem,
  MRootOfTimeRanking,
  MUnionRankingRequest,
  MUnionRankingItem,
  MUnionRanking,
  MCombatPowerRankingRequest,
  MCombatPowerRankingItem,
  MCombatPowerRanking,
  MKerningMTowerRankingRequest,
  MKerningMTowerRankingItem,
  MKerningMTowerRanking,
  MAchievementRankingRequest,
  MHonorBadge,
  MAchievementRankingItem,
  MAchievementRanking,
  MSharenianRankingItem,
  MSharenianBattlefieldRankingRequest,
  MSharenianBattlefieldRanking,
  MSharenianWaterwayRankingRequest,
  MSharenianWaterwayRanking,
} from './games/maplestory-m/ranking/types.js';

// MapleStory M notice types
export type {
  MNoticeItem,
  MNoticeList,
  MNoticeDetail,
  MPatchNoticeList,
  MEventNoticeList,
  MEventNoticeDetail,
} from './games/maplestory-m/notice/types.js';

// MapleStory SEA character types
export type {
  SEACharacterBasic,
  SEACharacterPopularity,
  SEACharacterStat,
  SEAStatDetail,
  SEACharacterHyperStat,
  SEAHyperStatPreset,
  SEACharacterPropensity,
  SEACharacterAbility,
  SEAAbilityInfo,
  SEAAbilityPreset,
  SEAItemTotalOption,
  SEAItemBaseOption,
  SEAItemExceptionalOption,
  SEAItemAddOption,
  SEAItemEtcOption,
  SEAItemEquipment,
  SEAPresetItemEquipment,
  SEATitleInfo,
  SEAMedalShape,
  SEACharacterItemEquipment,
  SEACashItemOption,
  SEACashItemColoringPrism,
  SEACashItemEquipmentItem,
  SEACharacterCashItemEquipment,
  SEASymbolInfo,
  SEACharacterSymbolEquipment,
  SEASetEffectInfo,
  SEASetEffectDetail,
  SEACharacterSetEffect,
  SEAHairInfo,
  SEAFaceInfo,
  SEASkinInfo,
  SEACharacterBeautyEquipment,
  SEAAndroidCashItem,
  SEAAndroidPreset,
  SEACharacterAndroidEquipment,
  SEAPetItemOption,
  SEAPetEquipmentInfo,
  SEAPetAutoSkill,
  SEACharacterPetEquipment,
  SEASkillRequest,
  SEASkillInfo,
  SEACharacterSkill,
  SEALinkSkillInfo,
  SEALinkSkillPresetInfo,
  SEACharacterLinkSkill,
  SEAVCoreInfo,
  SEACharacterVMatrix,
  SEAHexaLinkedSkill,
  SEAHexaCoreInfo,
  SEACharacterHexaMatrix,
  SEAHexaStatCoreInfo,
  SEACharacterHexaMatrixStat,
  SEACharacterDojang,
} from './games/maplestory-sea/character/types.js';

// MapleStory SEA union types
export type {
  SEAUnion,
  SEAUnionRaider,
  SEAUnionInnerStat,
  SEAUnionBlockPosition,
  SEAUnionBlock,
  SEAUnionRaiderPreset,
  SEAUnionArtifact,
  SEAUnionArtifactEffect,
  SEAUnionArtifactCrystal,
  SEAUnionChampion,
  SEAUnionChampionInfo,
  SEAUnionChampionBadgeInfo,
} from './games/maplestory-sea/union/types.js';

// MapleStory SEA guild types
export type {
  SEAGuildIdResponse,
  SEAGuildSkill,
  SEAGuildBasic,
} from './games/maplestory-sea/guild/types.js';

// HttpClient (for advanced usage)
export { HttpClient } from './core/http/HttpClient.js';
export type {
  HttpClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  RetryInterceptor,
  HttpLogger,
} from './core/http/http-types.js';

// Metadata
export { API_METADATA, getApiMetadata } from './core/metadata/api-metadata.js';
export type { GameApiMetadata } from './core/metadata/api-metadata.js';

// Validation (advanced)
export type {
  ShapeDescriptor,
  ShapeMismatch,
  ExpectedType,
} from './core/validation/response-shape.js';

// Deprecation
export { emitDeprecation } from './core/deprecation/deprecation.js';
